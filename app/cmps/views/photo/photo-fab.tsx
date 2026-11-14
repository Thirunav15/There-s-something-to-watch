import { useShallowState } from '@/store'
import { ImagePlus, ListChecks, Trash2 } from 'lucide-react'
import { type ChangeEvent, useRef, useState } from 'react'
import { Button } from '../../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog'

export const PhotoFloatingActionOverlay = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [manageOpen, setManageOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const {
    setUploadModalOpen,
    setPendingUploadFile,
    setPendingUploadBatch,
    hasPhotos,
    favoritesOpen,
    photos,
    deletePhotos,
  } = useShallowState((state) => ({
      setUploadModalOpen: state.setUploadModalOpen,
      setPendingUploadFile: state.setPendingUploadFile,
      setPendingUploadBatch: state.setPendingUploadBatch,
      hasPhotos: state.photos.length > 0,
      favoritesOpen: state.favoritesOpen,
      photos: state.photos,
      deletePhotos: state.deletePhotos,
    }))

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const selectedFiles = Array.from(files)
      setPendingUploadFile(selectedFiles.length === 1 ? selectedFiles[0] : undefined)
      setPendingUploadBatch(selectedFiles.length > 1 ? selectedFiles : undefined)
      setUploadModalOpen(true)
      e.target.value = ''
    }
  }

  const togglePhoto = (id: number) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id],
    )
  }

  const toggleAll = () => {
    setSelectedIds((current) =>
      current.length === photos.length ? [] : photos.map((photo) => photo.id),
    )
  }

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return
    deletePhotos(selectedIds)
    setSelectedIds([])
    setManageOpen(false)
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        multiple
        onChange={handleFileSelect}
        className='hidden'
      />
      {hasPhotos && !favoritesOpen && (
        <div className='font-gallery pointer-events-none fixed right-4 bottom-4 z-40 flex items-center overflow-hidden rounded-full border border-white/15 bg-[#181818]/95 shadow-xl shadow-black/30 backdrop-blur-xl md:right-6 md:bottom-6'>
          <Button
            type='button'
            onClick={() => fileInputRef.current?.click()}
            className='pointer-events-auto flex h-9 cursor-pointer items-center gap-2 rounded-none border-0 bg-transparent px-3 font-semibold text-sm text-white shadow-none transition-colors duration-300 hover:bg-white/10 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/80 sm:px-4'
          >
            <ImagePlus className='size-4' />
            <span>+ Add Photo</span>
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={() => {
              setSelectedIds([])
              setManageOpen(true)
            }}
            className='pointer-events-auto h-9 cursor-pointer gap-1.5 rounded-none border-0 border-l border-l-white/15 bg-transparent px-3 font-semibold text-sm text-white shadow-none transition-colors duration-300 hover:bg-white/10 hover:text-white focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/80'
          >
            <ListChecks className='size-3.5' />
            <span>Manage</span>
          </Button>
        </div>
      )}

      <Dialog
        open={manageOpen}
        onOpenChange={(open) => {
          setManageOpen(open)
          if (!open) setSelectedIds([])
        }}
      >
        <DialogContent className='flex max-h-[85vh] flex-col gap-4 overflow-hidden border-white/10 bg-background/95 sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle>Manage photos</DialogTitle>
            <DialogDescription>
              Select the photos you want to remove from this browser's gallery.
            </DialogDescription>
          </DialogHeader>

          <div className='flex items-center justify-between border-b border-white/10 pb-3'>
            <span className='text-muted-foreground text-sm'>
              {selectedIds.length} of {photos.length} selected
            </span>
            <Button type='button' variant='ghost' size='sm' onClick={toggleAll}>
              {selectedIds.length === photos.length ? 'Clear selection' : 'Select all'}
            </Button>
          </div>

          <div className='min-h-0 flex-1 space-y-1 overflow-y-auto pr-1'>
            {photos.map((photo) => (
              <label
                key={photo.id}
                className='flex cursor-pointer items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/5'
              >
                <input
                  type='checkbox'
                  checked={selectedIds.includes(photo.id)}
                  onChange={() => togglePhoto(photo.id)}
                  className='size-4 shrink-0 accent-indigo-500'
                />
                <img
                  src={photo.imageUrl}
                  alt=''
                  className='size-11 shrink-0 rounded-lg object-cover'
                />
                <span className='min-w-0 flex-1 truncate text-sm font-medium'>
                  {photo.title}
                </span>
              </label>
            ))}
          </div>

          <DialogFooter className='flex-row justify-between border-t border-white/10 pt-3 sm:justify-between sm:space-x-0'>
            <Button type='button' variant='ghost' onClick={() => setManageOpen(false)}>
              Cancel
            </Button>
            <Button
              type='button'
              disabled={selectedIds.length === 0}
              onClick={handleBulkDelete}
              className='gap-2 bg-rose-600 text-white hover:bg-rose-500'
            >
              <Trash2 className='size-4' />
              Remove {selectedIds.length || ''} photos
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
