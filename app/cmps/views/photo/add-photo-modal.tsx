import { useShallowState } from '@/store'
import {
  AVAILABLE_TAG_OPTIONS,
  type PhotoNode,
  preparePhotoForStorage,
} from '@/vf/utils/photos'
import { Calendar, MapPin, Sparkles, Tag, X } from 'lucide-react'
import { type FormEvent, useEffect, useState } from 'react'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog'
import { Input } from '../../ui/input'

const formatFilenameToTitle = (filename: string): string => {
  const withoutExt = filename.replace(/\.[^/.]+$/, '')
  const clean = withoutExt.replace(/[_-]+/g, ' ')
  return clean
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export const AddPhotoModal = () => {
  const { open, setOpen, pendingFile, setPendingFile, addPhoto, voroforce } =
    useShallowState((state) => ({
      open: state.uploadModalOpen,
      setOpen: state.setUploadModalOpen,
      pendingFile: state.pendingUploadFile,
      setPendingFile: state.setPendingUploadFile,
      addPhoto: state.addPhoto,
      voroforce: state.voroforce,
    }))

  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [caption, setCaption] = useState<string>('')
  const [location, setLocation] = useState<string>('')
  const [date, setDate] = useState<string>('')
  const [tags, setTags] = useState<string[]>(['Travel', 'Nature'])
  const [customTagInput, setCustomTagInput] = useState<string>('')
  const [saveError, setSaveError] = useState<string>('')

  useEffect(() => {
    if (pendingFile) {
      const url = URL.createObjectURL(pendingFile)
      setPreviewUrl(url)
      setSaveError('')
      setTitle(formatFilenameToTitle(pendingFile.name))
      const fileDate = new Date(pendingFile.lastModified || Date.now())
      setDate(fileDate.toISOString().split('T')[0])
      setCaption('')
      setLocation('')
      setTags(['Travel', 'Nature'])

      return () => {
        URL.revokeObjectURL(url)
      }
    }
  }, [pendingFile])

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag))
    } else {
      setTags([...tags, tag])
    }
  }

  const addCustomTag = () => {
    const trimmed = customTagInput.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
      setCustomTagInput('')
    }
  }

  const handleClose = () => {
    setOpen(false)
    setPendingFile(undefined)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!pendingFile || !previewUrl || !title.trim()) return

    let storedImage: string
    try {
      storedImage = await preparePhotoForStorage(pendingFile)
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : 'Could not save this image.',
      )
      return
    }

    const newPhotoData: Omit<PhotoNode, 'id'> = {
      title: title.trim(),
      caption: caption.trim() || undefined,
      imageUrl: storedImage,
      location: location.trim() || undefined,
      date: date || new Date().toISOString().split('T')[0],
      tags: tags.length > 0 ? tags : ['Uncategorized'],
    }

    let created: PhotoNode
    try {
      created = addPhoto(newPhotoData)
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : 'Could not save this photo.',
      )
      return
    }

    // The store subscription streams the new photo into the WebGL texture field.
    if (voroforce && created) {
      const targetIndex = created.cellId ?? voroforce.cells?.length ?? 0
      // Smooth camera glide to the newly added photo node
      setTimeout(() => {
        try {
          voroforce.controls?.navigateToCell?.(targetIndex)
        } catch (err) {
          console.warn('Could not navigate to newly added photo cell:', err)
        }
      }, 350)
    }

    handleClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => (!o ? handleClose() : null)}>
      <DialogContent className='max-h-[90vh] overflow-y-auto border-border/80 bg-background/95 backdrop-blur-2xl sm:max-w-xl'>
        <form onSubmit={handleSubmit}>
          <DialogHeader className='pb-2'>
            <DialogTitle className='flex items-center gap-2 font-bold text-xl'>
              <Sparkles className='size-5 animate-pulse text-indigo-400' />
              Add Photo to Galaxy
            </DialogTitle>
            <DialogDescription className='text-muted-foreground text-sm'>
              Fill in the details for your photo. The galaxy physics engine will
              automatically cluster it by tags and date.
            </DialogDescription>
          </DialogHeader>

          <div className='flex flex-col gap-4 py-3'>
            {/* Image Preview */}
            {previewUrl && (
              <div className='group relative h-48 w-full overflow-hidden rounded-xl border border-border/70 bg-black/40 md:h-56'>
                <img
                  src={previewUrl}
                  alt='Preview'
                  className='h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105'
                />
                <div className='absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-3'>
                  <span className='truncate font-mono text-xs text-zinc-300'>
                    {pendingFile?.name} (
                    {pendingFile?.size
                      ? (pendingFile.size / 1024 / 1024).toFixed(2)
                      : 0}{' '}
                    MB)
                  </span>
                </div>
              </div>
            )}

            {/* Title Input */}
            <div className='flex flex-col gap-1.5'>
              <label
                htmlFor='photo-title'
                className='font-semibold text-muted-foreground text-xs uppercase tracking-wider'
              >
                Title *
              </label>
              <Input
                id='photo-title'
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='e.g., Summit at Sunrise'
                className='font-medium'
              />
            </div>

            {saveError && (
              <p role='alert' className='text-rose-400 text-sm'>
                {saveError}
              </p>
            )}

            {/* Caption */}
            <div className='flex flex-col gap-1.5'>
              <label
                htmlFor='photo-caption'
                className='font-semibold text-muted-foreground text-xs uppercase tracking-wider'
              >
                Caption & Story
              </label>
              <textarea
                id='photo-caption'
                rows={2}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder='Tell the memory behind this shot...'
                className='w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
              />
            </div>

            {/* Date and Location Grid */}
            <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
              <div className='flex flex-col gap-1.5'>
                <label
                  htmlFor='photo-date'
                  className='flex items-center gap-1.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider'
                >
                  <Calendar className='size-3.5 text-indigo-400' />
                  Date Taken
                </label>
                <Input
                  id='photo-date'
                  type='date'
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className='flex flex-col gap-1.5'>
                <label
                  htmlFor='photo-location'
                  className='flex items-center gap-1.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider'
                >
                  <MapPin className='size-3.5 text-rose-400' />
                  Location
                </label>
                <Input
                  id='photo-location'
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder='e.g., Yosemite National Park, CA'
                />
              </div>
            </div>

            {/* Clustering Tags */}
            <div className='flex flex-col gap-2'>
              <div className='flex items-center gap-1.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider'>
                <Tag className='size-3.5 text-emerald-400' />
                Galaxy Cluster Tags
              </div>
              <div className='flex flex-wrap gap-1.5'>
                {AVAILABLE_TAG_OPTIONS.map((tagOption) => {
                  const isSelected = tags.includes(tagOption)
                  return (
                    <button
                      key={tagOption}
                      type='button'
                      onClick={() => toggleTag(tagOption)}
                      className={`cursor-pointer rounded-full border px-3 py-1 font-medium text-xs transition-all ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-600 text-white shadow-indigo-500/20 shadow-sm'
                          : 'border-border/80 bg-muted/40 text-muted-foreground hover:border-foreground/40'
                      }`}
                    >
                      {tagOption}
                    </button>
                  )
                })}
              </div>

              {/* Custom Tag Input */}
              <div className='flex gap-2 pt-1'>
                <Input
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  placeholder='Add custom tag (e.g., Sunset, Portrait)...'
                  className='h-8 text-xs'
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addCustomTag()
                    }
                  }}
                />
                <Button
                  type='button'
                  size='sm'
                  variant='secondary'
                  onClick={addCustomTag}
                  className='h-8 cursor-pointer px-3 text-xs'
                >
                  Add Tag
                </Button>
              </div>

              {/* Active custom tags */}
              {tags.filter((t) => !AVAILABLE_TAG_OPTIONS.includes(t)).length >
                0 && (
                <div className='flex flex-wrap gap-1.5 pt-1'>
                  {tags
                    .filter((t) => !AVAILABLE_TAG_OPTIONS.includes(t))
                    .map((customTag) => (
                      <Badge
                        key={customTag}
                        variant='outline'
                        className='flex items-center gap-1 border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-indigo-300 text-xs'
                      >
                        {customTag}
                        <button
                          type='button'
                          onClick={() => toggleTag(customTag)}
                          className='cursor-pointer hover:text-white'
                        >
                          <X className='size-3' />
                        </button>
                      </Badge>
                    ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className='gap-2 pt-2 sm:gap-0'>
            <Button
              type='button'
              variant='ghost'
              onClick={handleClose}
              className='cursor-pointer'
            >
              Cancel
            </Button>
            <Button
              type='submit'
              className='cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 font-medium text-white shadow-indigo-600/20 shadow-lg hover:from-blue-500 hover:to-indigo-500'
            >
              <Sparkles className='mr-1.5 size-4' />
              Add to Galaxy
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
