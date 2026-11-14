import { useShallowState } from '@/store'
import { isInputDOMNode } from '@/hooks/use-key-press'
import { MAX_PHOTO_COUNT } from '@/vf/consts'
import {
  AVAILABLE_TAG_OPTIONS,
  type PhotoNode,
  preparePhotoForStorage,
} from '@/vf/utils/photos'
import { Calendar, ImagePlus, MapPin, Sparkles, Tag, X } from 'lucide-react'
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
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

type PhotoDraft = {
  file: File
  title: string
  caption: string
  location: string
  date: string
  tags: string[]
}

const createPhotoDraft = (file: File): PhotoDraft => ({
  file,
  title: formatFilenameToTitle(file.name),
  caption: '',
  location: '',
  date: new Date(file.lastModified || Date.now()).toISOString().split('T')[0],
  tags: [],
})

export const AddPhotoModal = () => {
  const additionalFilesRef = useRef<HTMLInputElement>(null)
  const {
    open,
    setOpen,
    pendingFile,
    setPendingFile,
    pendingBatch,
    setPendingBatch,
    addPhoto,
    addPhotos,
    photoCount,
    voroforce,
  } = useShallowState((state) => ({
    open: state.uploadModalOpen,
    setOpen: state.setUploadModalOpen,
    pendingFile: state.pendingUploadFile,
    setPendingFile: state.setPendingUploadFile,
    pendingBatch: state.pendingUploadBatch,
    setPendingBatch: state.setPendingUploadBatch,
    addPhoto: state.addPhoto,
    addPhotos: state.addPhotos,
    photoCount: state.photos.length,
    voroforce: state.voroforce,
  }))

  const uploadFiles =
    pendingBatch !== undefined ? pendingBatch : pendingFile ? [pendingFile] : []
  const isBatchUpload = pendingBatch !== undefined
  const previewFile = uploadFiles[0]

  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [caption, setCaption] = useState<string>('')
  const [location, setLocation] = useState<string>('')
  const [date, setDate] = useState<string>('')
  const [tags, setTags] = useState<string[]>([])
  const [customTagInput, setCustomTagInput] = useState<string>('')
  const [saveError, setSaveError] = useState<string>('')
  const [photoDrafts, setPhotoDrafts] = useState<PhotoDraft[]>([])
  const [batchPreviewUrls, setBatchPreviewUrls] = useState<string[]>([])
  const [activeBatchIndex, setActiveBatchIndex] = useState(0)

  // Resolve drafts by their File object so a file list update cannot shift another
  // photo's metadata to the wrong thumbnail.
  const draftsByFile = new Map(photoDrafts.map((draft) => [draft.file, draft]))
  const selectedPhotoDrafts = uploadFiles.map(
    (file) => draftsByFile.get(file) ?? createPhotoDraft(file),
  )
  const activeBatchPhoto = selectedPhotoDrafts[activeBatchIndex]
  const currentTags = isBatchUpload ? (activeBatchPhoto?.tags ?? []) : tags

  const updateActiveBatchPhoto = (updates: Partial<PhotoDraft>) => {
    setPhotoDrafts((current) => {
      const nextDrafts = uploadFiles.map(
        (file) =>
          current.find((draft) => draft.file === file) ??
          createPhotoDraft(file),
      )
      const activeDraft = nextDrafts[activeBatchIndex]
      if (activeDraft)
        nextDrafts[activeBatchIndex] = { ...activeDraft, ...updates }
      return nextDrafts
    })
  }

  useEffect(() => {
    if (previewFile) {
      const url = URL.createObjectURL(previewFile)
      setPreviewUrl(url)
      setSaveError('')
      setTitle(formatFilenameToTitle(previewFile.name))
      const fileDate = new Date(previewFile.lastModified || Date.now())
      setDate(fileDate.toISOString().split('T')[0])
      setCaption('')
      setLocation('')
      setTags([])

      return () => {
        URL.revokeObjectURL(url)
      }
    }
    setPreviewUrl('')
  }, [previewFile])

  useEffect(() => {
    if (!pendingBatch?.length) {
      setPhotoDrafts([])
      setBatchPreviewUrls([])
      setActiveBatchIndex(0)
      return
    }

    const urls = pendingBatch.map((file) => URL.createObjectURL(file))
    setBatchPreviewUrls(urls)
    setPhotoDrafts((current) => {
      const currentByFile = new Map(current.map((draft) => [draft.file, draft]))
      return pendingBatch.map(
        (file) => currentByFile.get(file) ?? createPhotoDraft(file),
      )
    })
    setActiveBatchIndex((current) => Math.min(current, pendingBatch.length - 1))

    return () => urls.forEach((url) => URL.revokeObjectURL(url))
  }, [pendingBatch])

  const toggleTag = (tag: string) => {
    if (currentTags.includes(tag)) {
      const nextTags = currentTags.filter((t) => t !== tag)
      isBatchUpload
        ? updateActiveBatchPhoto({ tags: nextTags })
        : setTags(nextTags)
    } else {
      const nextTags = [...currentTags, tag]
      isBatchUpload
        ? updateActiveBatchPhoto({ tags: nextTags })
        : setTags(nextTags)
    }
  }

  const addCustomTag = () => {
    const trimmed = customTagInput.trim()
    if (trimmed && !currentTags.includes(trimmed)) {
      const nextTags = [...currentTags, trimmed]
      isBatchUpload
        ? updateActiveBatchPhoto({ tags: nextTags })
        : setTags(nextTags)
      setCustomTagInput('')
    }
  }

  const handleClose = () => {
    setOpen(false)
    setPendingFile(undefined)
    setPendingBatch(undefined)
    setPhotoDrafts([])
    setActiveBatchIndex(0)
  }

  const handleAddMoreFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? [])
    if (selectedFiles.length === 0) return

    const existingDrafts = uploadFiles.map((file, index) =>
      isBatchUpload
        ? selectedPhotoDrafts[index]
        : {
            file,
            title,
            caption,
            location,
            date,
            tags,
          },
    )
    setPhotoDrafts([...existingDrafts, ...selectedFiles.map(createPhotoDraft)])
    setActiveBatchIndex(existingDrafts.length)
    setPendingFile(undefined)
    setPendingBatch([...uploadFiles, ...selectedFiles])
    event.target.value = ''
  }

  const handleRemovePhoto = (indexToRemove: number) => {
    const nextFiles = uploadFiles.filter((_, index) => index !== indexToRemove)
    const nextDrafts = selectedPhotoDrafts.filter(
      (_, index) => index !== indexToRemove,
    )
    setPhotoDrafts(nextDrafts)
    setPendingFile(undefined)
    setPendingBatch(nextFiles)
    setActiveBatchIndex((current) => {
      if (nextFiles.length === 0) return 0
      if (current === indexToRemove)
        return Math.min(indexToRemove, nextFiles.length - 1)
      return current > indexToRemove ? current - 1 : current
    })
    setSaveError('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (uploadFiles.length === 0 || !previewUrl) return
    if (!isBatchUpload && !title.trim()) return
    const remainingSlots = Math.max(0, MAX_PHOTO_COUNT - photoCount)
    if (uploadFiles.length > remainingSlots) {
      setSaveError(
        `Only ${remainingSlots.toLocaleString()} more photo${remainingSlots === 1 ? '' : 's'} can be added. The gallery limit is ${MAX_PHOTO_COUNT.toLocaleString()}.`,
      )
      return
    }

    let created: PhotoNode
    try {
      if (isBatchUpload) {
        const photosToAdd: Omit<PhotoNode, 'id'>[] = []
        const missingTitleIndex = uploadFiles.findIndex(
          (_, index) => !(selectedPhotoDrafts[index]?.title ?? '').trim(),
        )
        if (missingTitleIndex >= 0) {
          setActiveBatchIndex(missingTitleIndex)
          setSaveError(
            `Add a title for Photo ${missingTitleIndex + 1} before uploading.`,
          )
          return
        }
        for (const [index, file] of uploadFiles.entries()) {
          const draft = selectedPhotoDrafts[index]
          photosToAdd.push({
            title: draft.title.trim(),
            caption: draft.caption.trim() || undefined,
            imageUrl: await preparePhotoForStorage(file),
            location: draft.location.trim() || undefined,
            date: draft.date || new Date().toISOString().split('T')[0],
            tags: draft.tags,
          })
        }
        const addedPhotos = addPhotos(photosToAdd)
        created = addedPhotos[addedPhotos.length - 1]
      } else {
        const file = uploadFiles[0]
        const newPhotoData: Omit<PhotoNode, 'id'> = {
          title: title.trim(),
          caption: caption.trim() || undefined,
          imageUrl: await preparePhotoForStorage(file),
          location: location.trim() || undefined,
          date: date || new Date().toISOString().split('T')[0],
          tags,
        }
        created = addPhoto(newPhotoData)
      }
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : isBatchUpload
            ? 'Could not save the selected photos.'
            : 'Could not save this photo.',
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

  const photoTabBar = isBatchUpload ? (
    <div className='shrink-0 border-b border-white/10 bg-[#181818] px-5 py-3 sm:px-7'>
      <div className='no-scrollbar flex gap-2 overflow-x-auto'>
        <div
          role='tablist'
          aria-label='Selected photos'
          className='flex shrink-0 gap-2'
        >
          {uploadFiles.map((file, index) => (
            <div
              key={`${file.name}-${file.lastModified}-${index}`}
              className='relative shrink-0'
            >
              <button
                id={`upload-photo-tab-${index}`}
                type='button'
                role='tab'
                aria-selected={activeBatchIndex === index}
                aria-controls='upload-photo-fields'
                onClick={() => {
                  setActiveBatchIndex(index)
                  setCustomTagInput('')
                  setSaveError('')
                }}
                className={`flex min-w-0 items-center gap-2 rounded-xl border py-2 pr-8 pl-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                  activeBatchIndex === index
                    ? 'border-violet-400/80 bg-violet-500/15 text-white shadow-[0_0_0_1px_rgba(167,139,250,0.25)]'
                    : 'border-white/10 bg-white/[0.03] text-muted-foreground hover:border-white/25 hover:text-foreground'
                }`}
              >
                {batchPreviewUrls[index] && (
                  <img
                    src={batchPreviewUrls[index]}
                    alt=''
                    className='size-10 shrink-0 rounded-lg object-cover'
                  />
                )}
                <span className='flex min-w-0 flex-col'>
                  <span className='font-medium text-xs'>Photo {index + 1}</span>
                  <span className='max-w-32 truncate text-[11px] opacity-70'>
                    {file.name}
                  </span>
                </span>
              </button>
              <button
                type='button'
                aria-label={`Remove Photo ${index + 1}`}
                title={`Remove Photo ${index + 1}`}
                onClick={() => handleRemovePhoto(index)}
                className='absolute top-1 right-1 z-10 grid size-6 place-items-center rounded-full border border-white/15 bg-[#1F1F1F] text-muted-foreground transition-colors hover:border-red-400/50 hover:bg-red-500/20 hover:text-red-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60'
              >
                <X className='size-3.5' />
              </button>
            </div>
          ))}
        </div>
        <Button
          type='button'
          variant='ghost'
          onClick={() => additionalFilesRef.current?.click()}
          className='h-auto shrink-0 gap-1.5 self-stretch rounded-xl border border-dashed border-white/15 px-3 text-xs text-muted-foreground hover:bg-white/5 hover:text-foreground'
        >
          <ImagePlus className='size-4' />
          Add more
        </Button>
      </div>
    </div>
  ) : null

  return (
    <Dialog open={open} onOpenChange={(o) => (!o ? handleClose() : null)}>
      <DialogContent className='font-gallery flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-2xl flex-col gap-0 overflow-hidden rounded-2xl border-white/10 bg-[#181818]/95 p-0 shadow-2xl shadow-black/40 backdrop-blur-2xl'>
        <form
          onSubmit={handleSubmit}
          onKeyDownCapture={(event) => {
            if (event.key === ' ' && isInputDOMNode(event.nativeEvent)) {
              event.stopPropagation()
            }
          }}
          className='flex min-h-0 flex-1 flex-col overflow-hidden'
        >
          <DialogHeader className='shrink-0 border-b border-white/10 px-5 py-5 pr-12 text-left sm:px-7'>
            <div className='flex items-start gap-3'>
              <div className='grid size-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-foreground'>
                <Sparkles className='size-4' />
              </div>
              <div className='min-w-0 flex-1'>
                <DialogTitle className='font-semibold text-xl tracking-tight'>
                  {isBatchUpload
                    ? `Add ${uploadFiles.length} photo${uploadFiles.length === 1 ? '' : 's'}`
                    : 'Add a photo'}
                </DialogTitle>
                <DialogDescription className='mt-2 text-sm leading-relaxed'>
                  {isBatchUpload
                    ? 'Choose a photo tab to edit its title, story, date, location, and tags.'
                    : 'Add details to help you find and organize this photo later.'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {photoTabBar}

          <div className='min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7'>
            <div className='flex flex-col gap-4'>
              <input
                ref={additionalFilesRef}
                type='file'
                accept='image/*'
                multiple
                onChange={handleAddMoreFiles}
                className='hidden'
              />
              {isBatchUpload && uploadFiles.length === 0 && (
                <div className='flex min-h-48 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-5 text-center'>
                  <p className='text-sm text-muted-foreground'>
                    No photos selected.
                  </p>
                  <Button
                    type='button'
                    variant='ghost'
                    onClick={() => additionalFilesRef.current?.click()}
                    className='gap-2 rounded-lg border border-white/10 text-foreground hover:bg-white/5'
                  >
                    <ImagePlus className='size-4' />
                    Choose photos
                  </Button>
                </div>
              )}
              {/* Image Preview */}
              {previewUrl && !isBatchUpload && (
                <div className='flex min-w-0 items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-3'>
                  <img
                    src={previewUrl}
                    alt='Selected photo preview'
                    className='size-16 shrink-0 rounded-lg bg-black/40 object-cover'
                  />
                  <div className='min-w-0'>
                    <p className='font-medium text-sm text-foreground'>
                      Photo selected
                    </p>
                    <p className='mt-1 truncate text-sm text-muted-foreground'>
                      {previewFile?.name}
                    </p>
                    {!isBatchUpload && previewFile?.size && (
                      <p className='mt-1 text-xs text-muted-foreground/75'>
                        {(previewFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    )}
                  </div>
                  <Button
                    type='button'
                    variant='ghost'
                    onClick={() => additionalFilesRef.current?.click()}
                    className='h-9 shrink-0 gap-1.5 rounded-lg px-2.5 text-xs text-muted-foreground transition-colors duration-300 hover:bg-white/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 sm:px-3 sm:text-sm'
                  >
                    <ImagePlus className='size-4' />
                    Add more
                  </Button>
                </div>
              )}

              {/* Current photo fields */}
              <div
                hidden={isBatchUpload && uploadFiles.length === 0}
                id='upload-photo-fields'
                role={isBatchUpload ? 'tabpanel' : undefined}
                aria-labelledby={
                  isBatchUpload
                    ? `upload-photo-tab-${activeBatchIndex}`
                    : undefined
                }
                className='flex flex-col gap-4'
              >
                <div className='flex flex-col gap-1.5'>
                  <label
                    htmlFor='photo-title'
                    className='font-medium text-sm text-muted-foreground'
                  >
                    {isBatchUpload
                      ? `Photo ${activeBatchIndex + 1} title *`
                      : 'Title *'}
                  </label>
                  <Input
                    id='photo-title'
                    required
                    value={
                      isBatchUpload ? (activeBatchPhoto?.title ?? '') : title
                    }
                    onChange={(e) =>
                      isBatchUpload
                        ? updateActiveBatchPhoto({ title: e.target.value })
                        : setTitle(e.target.value)
                    }
                    placeholder='e.g., Summit at Sunrise'
                    className='h-11 rounded-lg border-white/10 bg-black/20 font-medium focus-visible:ring-white/30'
                  />
                </div>

                {saveError && (
                  <p
                    role='alert'
                    className='rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-destructive text-sm'
                  >
                    {saveError}
                  </p>
                )}

                {/* Caption */}
                <div className='flex flex-col gap-1.5'>
                  <label
                    htmlFor='photo-caption'
                    className='font-medium text-sm text-muted-foreground'
                  >
                    {isBatchUpload
                      ? `Caption & story for Photo ${activeBatchIndex + 1}`
                      : 'Caption & Story'}
                  </label>
                  <textarea
                    id='photo-caption'
                    rows={2}
                    value={
                      isBatchUpload
                        ? (activeBatchPhoto?.caption ?? '')
                        : caption
                    }
                    onChange={(e) =>
                      isBatchUpload
                        ? updateActiveBatchPhoto({ caption: e.target.value })
                        : setCaption(e.target.value)
                    }
                    placeholder='Tell the memory behind this shot...'
                    className='min-h-20 w-full resize-y rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-sm shadow-none placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30'
                  />
                </div>

                {/* Date and Location Grid */}
                <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                  <div className='flex flex-col gap-1.5'>
                    <label
                      htmlFor='photo-date'
                      className='flex items-center gap-2 font-medium text-sm text-muted-foreground'
                    >
                      <Calendar className='size-4 text-muted-foreground' />
                      {isBatchUpload
                        ? `Date taken · Photo ${activeBatchIndex + 1}`
                        : 'Date Taken'}
                    </label>
                    <Input
                      id='photo-date'
                      type='date'
                      value={
                        isBatchUpload ? (activeBatchPhoto?.date ?? '') : date
                      }
                      onChange={(e) =>
                        isBatchUpload
                          ? updateActiveBatchPhoto({ date: e.target.value })
                          : setDate(e.target.value)
                      }
                      className='h-11 rounded-lg border-white/10 bg-black/20 focus-visible:ring-white/30'
                    />
                  </div>

                  <div className='flex flex-col gap-1.5'>
                    <label
                      htmlFor='photo-location'
                      className='flex items-center gap-2 font-medium text-sm text-muted-foreground'
                    >
                      <MapPin className='size-4 text-muted-foreground' />
                      {isBatchUpload
                        ? `Location · Photo ${activeBatchIndex + 1}`
                        : 'Location'}
                    </label>
                    <Input
                      id='photo-location'
                      value={
                        isBatchUpload
                          ? (activeBatchPhoto?.location ?? '')
                          : location
                      }
                      onChange={(e) =>
                        isBatchUpload
                          ? updateActiveBatchPhoto({ location: e.target.value })
                          : setLocation(e.target.value)
                      }
                      placeholder='e.g., Yosemite National Park, CA'
                      className='h-11 rounded-lg border-white/10 bg-black/20 focus-visible:ring-white/30'
                    />
                  </div>
                </div>

                {/* Clustering Tags */}
                <div className='flex flex-col gap-2'>
                  <div className='flex items-center gap-2 font-medium text-sm text-muted-foreground'>
                    <Tag className='size-4 text-muted-foreground' />
                    {isBatchUpload
                      ? `Tags for Photo ${activeBatchIndex + 1}`
                      : 'Tags'}
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    {AVAILABLE_TAG_OPTIONS.map((tagOption) => {
                      const isSelected = currentTags.includes(tagOption)
                      return (
                        <button
                          key={tagOption}
                          type='button'
                          onClick={() => toggleTag(tagOption)}
                          className={`cursor-pointer rounded-lg border px-3 py-2 font-medium text-sm transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${
                            isSelected
                              ? 'border-white bg-white text-black'
                              : 'border-white/10 bg-white/[0.03] text-muted-foreground hover:border-white/25 hover:text-foreground'
                          }`}
                        >
                          {tagOption}
                        </button>
                      )
                    })}
                  </div>

                  {/* Custom Tag Input */}
                  <div className='flex flex-col gap-2 pt-1 sm:flex-row'>
                    <Input
                      value={customTagInput}
                      onChange={(e) => setCustomTagInput(e.target.value)}
                      placeholder='Add custom tag (e.g., Sunset, Portrait)...'
                      className='h-11 min-w-0 rounded-lg border-white/10 bg-black/20 text-sm focus-visible:ring-white/30'
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
                      className='h-11 shrink-0 cursor-pointer rounded-lg border border-white/10 bg-white/5 px-4 text-sm text-foreground shadow-none hover:bg-white/10 hover:text-foreground'
                    >
                      Add Tag
                    </Button>
                  </div>

                  {/* Active custom tags */}
                  {currentTags.filter((t) => !AVAILABLE_TAG_OPTIONS.includes(t))
                    .length > 0 && (
                    <div className='flex flex-wrap gap-2 pt-1'>
                      {currentTags
                        .filter((t) => !AVAILABLE_TAG_OPTIONS.includes(t))
                        .map((customTag) => (
                          <Badge
                            key={customTag}
                            variant='outline'
                            className='flex items-center gap-1.5 border-white/15 bg-white/5 px-2.5 py-1 text-foreground/80 text-xs'
                          >
                            {customTag}
                            <button
                              type='button'
                              onClick={() => toggleTag(customTag)}
                              className='cursor-pointer rounded-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60'
                            >
                              <X className='size-3' />
                            </button>
                          </Badge>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className='shrink-0 flex-row justify-between gap-2 border-t border-white/10 bg-[#181818]/95 px-5 py-4 sm:px-7'>
            <Button
              type='button'
              variant='ghost'
              onClick={handleClose}
              className='w-auto shrink-0 cursor-pointer rounded-lg px-4 text-muted-foreground hover:bg-white/5 hover:text-foreground'
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={uploadFiles.length === 0}
              className='flex-1 cursor-pointer rounded-lg bg-white px-5 font-semibold text-black shadow-none transition-colors duration-300 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:flex-none'
            >
              <Sparkles className='mr-2 size-4' />
              {isBatchUpload
                ? `Upload All (${uploadFiles.length} Photo${uploadFiles.length === 1 ? '' : 's'})`
                : 'Add to Galaxy'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
