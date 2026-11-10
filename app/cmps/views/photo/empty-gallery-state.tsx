import { useShallowState } from '@/store'
import {
  clusterPhotosByTagOrDate,
  SEED_PHOTOS,
} from '@/vf/utils/photos'
import { ImagePlus, Sparkles } from 'lucide-react'
import { type ChangeEvent, useRef } from 'react'
import { Button } from '../../ui/button'

export const EmptyGalleryState = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const {
    isEmpty,
    setPendingUploadFile,
    setPendingUploadBatch,
    setUploadModalOpen,
    setPhotos,
  } =
    useShallowState((state) => ({
      isEmpty: state.photos.length === 0,
      setPendingUploadFile: state.setPendingUploadFile,
      setPendingUploadBatch: state.setPendingUploadBatch,
      setUploadModalOpen: state.setUploadModalOpen,
      setPhotos: state.setPhotos,
    }))

  if (!isEmpty) return null

  const handlePhotoSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    if (files.length === 0) return

    setPendingUploadFile(files.length === 1 ? files[0] : undefined)
    setPendingUploadBatch(files.length > 1 ? files : undefined)
    setUploadModalOpen(true)
    event.target.value = ''
  }

  return (
    <section className='pointer-events-none fixed inset-0 z-20 grid place-items-center px-4 py-6 sm:px-6'>
      <div className='font-gallery pointer-events-auto grid w-full max-w-3xl gap-6 rounded-2xl border border-white/10 bg-[#181818]/90 p-5 text-left shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-8'>
        <div className='min-w-0'>
          <div className='mb-5 grid size-12 place-items-center rounded-xl border border-white/10 bg-white/5 text-foreground'>
            <ImagePlus className='size-5' />
          </div>
          <h1 className='text-balance font-semibold text-2xl text-white tracking-tight sm:text-3xl'>
            Your galaxy is waiting
          </h1>
          <p className='mt-3 max-w-lg text-base leading-relaxed text-white/65'>
            Select one or more photos to start building a private collection of your moments.
          </p>
        </div>
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          multiple
          onChange={handlePhotoSelect}
          className='hidden'
        />
        <div className='flex w-full flex-col gap-2 md:min-w-44'>
          <Button
            type='button'
            onClick={() => fileInputRef.current?.click()}
            className='h-11 w-full rounded-lg bg-white px-4 font-semibold text-sm text-black shadow-none transition-colors duration-300 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70'
          >
            <ImagePlus className='mr-2 size-4' />
            Add photos
          </Button>
          <Button
            type='button'
            variant='ghost'
            onClick={() => setPhotos(clusterPhotosByTagOrDate(SEED_PHOTOS))}
            className='h-10 w-full rounded-lg text-sm text-white/65 transition-colors duration-300 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70'
          >
            <Sparkles className='mr-2 size-4' />
            Explore sample photos
          </Button>
        </div>
      </div>
    </section>
  )
}
