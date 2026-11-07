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
  const { isEmpty, setPendingUploadFile, setUploadModalOpen, setPhotos } =
    useShallowState((state) => ({
      isEmpty: state.photos.length === 0,
      setPendingUploadFile: state.setPendingUploadFile,
      setUploadModalOpen: state.setUploadModalOpen,
      setPhotos: state.setPhotos,
    }))

  if (!isEmpty) return null

  const handlePhotoSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setPendingUploadFile(file)
    setUploadModalOpen(true)
    event.target.value = ''
  }

  return (
    <section className='pointer-events-none fixed inset-0 z-20 grid place-items-center px-5 text-center'>
      <div className='pointer-events-auto flex max-w-sm flex-col items-center rounded-3xl border border-white/10 bg-black/65 p-6 shadow-2xl backdrop-blur-xl sm:p-8'>
        <div className='mb-4 grid size-12 place-items-center rounded-2xl border border-indigo-400/20 bg-indigo-400/10 text-indigo-300'>
          <ImagePlus className='size-5' />
        </div>
        <h1 className='font-semibold text-xl text-white sm:text-2xl'>
          Your galaxy is waiting
        </h1>
        <p className='mt-2 text-sm leading-relaxed text-white/60'>
          Add a photo to start building a private collection of your moments.
        </p>
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          onChange={handlePhotoSelect}
          className='hidden'
        />
        <Button
          type='button'
          onClick={() => fileInputRef.current?.click()}
          className='mt-5 h-10 rounded-full bg-indigo-600 px-5 text-white hover:bg-indigo-500'
        >
          <ImagePlus className='mr-2 size-4' />
          Add your first photo
        </Button>
        <Button
          type='button'
          variant='ghost'
          onClick={() => setPhotos(clusterPhotosByTagOrDate(SEED_PHOTOS))}
          className='mt-2 h-9 text-xs text-white/55 hover:bg-white/5 hover:text-white'
        >
          <Sparkles className='mr-2 size-3.5' />
          Explore sample photos
        </Button>
      </div>
    </section>
  )
}
