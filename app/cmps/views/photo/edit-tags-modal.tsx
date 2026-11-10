import { useShallowState } from '@/store'
import { isInputDOMNode } from '@/hooks/use-key-press'
import { AVAILABLE_TAG_OPTIONS } from '@/vf/utils/photos'
import { Calendar, Edit3, MapPin, Plus, X } from 'lucide-react'
import { useState } from 'react'
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

export const EditTagsModal = () => {
  const { open, setOpen, activePhoto, updatePhotoDetails } = useShallowState(
    (state) => ({
      open: state.editTagsModalOpen,
      setOpen: state.setEditTagsModalOpen,
      activePhoto: state.activePhoto,
      updatePhotoDetails: state.updatePhotoDetails,
    }),
  )

  const [currentTags, setCurrentTags] = useState<string[]>(
    activePhoto?.tags ?? [],
  )
  const [newTagInput, setNewTagInput] = useState('')
  const [title, setTitle] = useState(activePhoto?.title ?? '')
  const [caption, setCaption] = useState(activePhoto?.caption ?? '')
  const [date, setDate] = useState(activePhoto?.date ?? '')
  const [location, setLocation] = useState(activePhoto?.location ?? '')

  // Sync state when modal opens
  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen && activePhoto) {
      setCurrentTags([...activePhoto.tags])
      setTitle(activePhoto.title)
      setCaption(activePhoto.caption ?? '')
      setDate(activePhoto.date ?? '')
      setLocation(activePhoto.location ?? '')
      setNewTagInput('')
    }
    setOpen(nextOpen)
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setCurrentTags(currentTags.filter((t) => t !== tagToRemove))
  }

  const handleAddTag = (tagToAdd: string) => {
    const trimmed = tagToAdd.trim()
    if (!trimmed) return
    if (!currentTags.includes(trimmed)) {
      setCurrentTags([...currentTags, trimmed])
    }
    setNewTagInput('')
  }

  const handleSave = () => {
    if (activePhoto) {
      updatePhotoDetails(activePhoto.id, {
        title: title.trim(),
        caption: caption.trim() || undefined,
        date: date || new Date().toISOString().split('T')[0],
        location: location.trim() || undefined,
        tags: currentTags,
      })
    }
    setOpen(false)
  }

  if (!activePhoto) return null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        onKeyDownCapture={(event) => {
          if (event.key === ' ' && isInputDOMNode(event.nativeEvent)) {
            event.stopPropagation()
          }
        }}
        className='font-gallery flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-lg flex-col gap-0 overflow-hidden rounded-2xl border-white/10 bg-[#181818] p-0 shadow-2xl shadow-black/40'
      >
        <DialogHeader className='shrink-0 border-b border-white/10 px-5 py-5 pr-12 text-left sm:px-6'>
          <DialogTitle className='flex items-center gap-2 font-bold text-xl'>
            <Edit3 className='size-5 text-muted-foreground' />
            Edit Photo Details
          </DialogTitle>
          <DialogDescription className='mt-2 text-muted-foreground text-sm leading-relaxed'>
            Update this photo&rsquo;s details and the tags used to group it in
            your galaxy.
          </DialogDescription>
        </DialogHeader>

        <div className='min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-6'>
          <div className='flex flex-col gap-1.5'>
            <label
              htmlFor='edit-photo-title'
              className='font-medium text-sm text-muted-foreground'
            >
              Title *
            </label>
            <Input
              id='edit-photo-title'
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder='Photo title'
              className='h-11 rounded-lg border-white/10 bg-black/20 font-medium focus-visible:ring-white/30'
            />
          </div>

          <div className='flex flex-col gap-1.5'>
            <label
              htmlFor='edit-photo-caption'
              className='font-medium text-sm text-muted-foreground'
            >
              Caption & story
            </label>
            <textarea
              id='edit-photo-caption'
              rows={3}
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              placeholder='Tell the memory behind this shot...'
              className='min-h-20 w-full resize-y rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-sm placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30'
            />
          </div>

          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
            <div className='flex flex-col gap-1.5'>
              <label
                htmlFor='edit-photo-date'
                className='flex items-center gap-2 font-medium text-sm text-muted-foreground'
              >
                <Calendar className='size-4' /> Date taken
              </label>
              <Input
                id='edit-photo-date'
                type='date'
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className='h-11 rounded-lg border-white/10 bg-black/20 focus-visible:ring-white/30'
              />
            </div>
            <div className='flex flex-col gap-1.5'>
              <label
                htmlFor='edit-photo-location'
                className='flex items-center gap-2 font-medium text-sm text-muted-foreground'
              >
                <MapPin className='size-4' /> Location
              </label>
              <Input
                id='edit-photo-location'
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder='e.g., Yosemite National Park, CA'
                className='h-11 rounded-lg border-white/10 bg-black/20 focus-visible:ring-white/30'
              />
            </div>
          </div>

          {/* Active Tags */}
          <div className='flex flex-col gap-2'>
            <span className='font-semibold text-muted-foreground text-xs uppercase tracking-wider'>
              Current Tags ({currentTags.length})
            </span>
            <div className='flex min-h-10 flex-wrap gap-2 rounded-lg border border-border/60 bg-muted/20 p-2'>
              {currentTags.length === 0 ? (
                <span className='px-2 py-1 text-muted-foreground/60 text-xs italic'>
                  No tags assigned yet.
                </span>
              ) : (
                currentTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant='secondary'
                    className='flex items-center gap-1.5 border border-indigo-500/30 bg-indigo-500/15 px-3 py-1 text-indigo-200 text-xs'
                  >
                    {tag}
                    <button
                      type='button'
                      onClick={() => handleRemoveTag(tag)}
                      className='cursor-pointer rounded-full p-0.5 transition-colors hover:bg-indigo-500/30'
                    >
                      <X className='size-3' />
                    </button>
                  </Badge>
                ))
              )}
            </div>
          </div>

          {/* Add Custom Tag */}
          <div className='flex gap-2'>
            <Input
              placeholder='Enter custom tag...'
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddTag(newTagInput)
                }
              }}
              className='h-9 text-sm'
            />
            <Button
              type='button'
              size='sm'
              variant='outline'
              onClick={() => handleAddTag(newTagInput)}
              disabled={!newTagInput.trim()}
              className='cursor-pointer'
            >
              <Plus className='mr-1 size-4' />
              Add
            </Button>
          </div>

          {/* Suggested Quick Tags */}
          <div className='flex flex-col gap-1.5'>
            <span className='text-muted-foreground text-xs'>
              Quick Suggestions:
            </span>
            <div className='flex flex-wrap gap-1.5'>
              {AVAILABLE_TAG_OPTIONS.filter(
                (t) => !currentTags.includes(t),
              ).map((suggestedTag) => (
                <button
                  key={suggestedTag}
                  type='button'
                  onClick={() => handleAddTag(suggestedTag)}
                  className='cursor-pointer rounded-md border border-border/60 px-2.5 py-1 text-muted-foreground text-xs transition-all hover:border-indigo-400/60 hover:bg-indigo-500/10 hover:text-foreground'
                >
                  + {suggestedTag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className='shrink-0 flex-row justify-between gap-2 border-t border-white/10 bg-[#181818] px-5 py-4 sm:px-6'>
          <Button
            type='button'
            variant='ghost'
            onClick={() => setOpen(false)}
            className='cursor-pointer'
          >
            Cancel
          </Button>
          <Button
            type='button'
            onClick={handleSave}
            disabled={!title.trim()}
            className='cursor-pointer bg-white font-semibold text-black hover:bg-white/90'
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
