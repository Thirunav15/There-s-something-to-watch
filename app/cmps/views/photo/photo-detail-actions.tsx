import { useShallowState } from '@/store'
import { Download, Edit3, Heart, Loader2, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/utils/tw'
import { Button } from '@/cmps/ui/button'

export const PhotoDetailActions = ({
  className = '',
  handleClose,
}: {
  photo?: unknown
  voroforceCell?: unknown
  className?: string
  handleClose?: () => void
  direction?: unknown
}) => {
  const {
    activePhoto,
    deletePhoto,
    setEditTagsModalOpen,
    isFavorite,
    toggleFavoritePhoto,
  } = useShallowState((state) => ({
    activePhoto: state.activePhoto,
    deletePhoto: state.deletePhoto,
    setEditTagsModalOpen: state.setEditTagsModalOpen,
    isFavorite: state.favoritePhotoIds.includes(state.activePhoto?.id ?? -1),
    toggleFavoritePhoto: state.toggleFavoritePhoto,
  }))

  const [downloading, setDownloading] = useState(false)

  if (!activePhoto) return null

  const handleDownload = async () => {
    try {
      setDownloading(true)
      const response = await fetch(activePhoto.imageUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${activePhoto.title.toLowerCase().replace(/\s+/g, '-')}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      // Fallback: direct download link navigation
      const a = document.createElement('a')
      a.href = activePhoto.imageUrl
      a.target = '_blank'
      a.download = `${activePhoto.title}.jpg`
      a.click()
    } finally {
      setDownloading(false)
    }
  }

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to remove "${activePhoto.title}" from your Photo Galaxy?`,
    )
    if (confirmed) {
      deletePhoto(activePhoto.id)
      handleClose?.()
    }
  }

  return (
    <div
      className={cn(
        'font-gallery relative flex flex-col gap-3 border-t border-white/10 bg-[#181818]/95 px-4 py-4 backdrop-blur-xl sm:px-5',
        className,
      )}
    >
      <div className='grid grid-cols-2 gap-2'>
        <Button
          type='button'
          onClick={handleDownload}
          disabled={downloading}
          className='col-span-2 h-11 w-full cursor-pointer justify-center rounded-lg bg-white font-semibold text-black shadow-none transition-colors duration-300 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70'
        >
          {downloading ? <Loader2 className='animate-spin' /> : <Download />}
          Download Photo
        </Button>

        <Button
          variant='outline'
          type='button'
          onClick={() => toggleFavoritePhoto(activePhoto.id)}
          aria-pressed={isFavorite}
          className='h-10 w-full cursor-pointer justify-center gap-2 rounded-lg border-white/10 bg-white/[0.03] px-3 text-sm text-foreground/85 shadow-none transition-colors duration-300 hover:border-white/20 hover:bg-white/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50'
        >
          <Heart
            className={
              isFavorite
                ? 'fill-rose-400 text-rose-400'
                : 'text-muted-foreground'
            }
          />
          {isFavorite ? 'Favorited' : 'Favorite'}
        </Button>
        <Button
          variant='outline'
          type='button'
          onClick={() => setEditTagsModalOpen(true)}
          className='h-10 w-full cursor-pointer justify-center gap-2 rounded-lg border-white/10 bg-white/[0.03] px-3 text-sm text-foreground/85 shadow-none transition-colors duration-300 hover:border-white/20 hover:bg-white/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50'
        >
          <Edit3 className='text-muted-foreground' />
          Edit Details
        </Button>
      </div>

      <div className='border-t border-white/10 pt-3'>
        <Button
          type='button'
          variant='ghost'
          onClick={handleDelete}
          className='h-10 w-full cursor-pointer justify-start gap-2 rounded-lg bg-rose-500/[0.06] px-3 text-sm font-medium text-rose-300 shadow-none transition-colors duration-300 hover:bg-rose-500/10 hover:text-rose-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/60'
        >
          <Trash2 className='text-rose-300' />
          Delete from Galaxy
        </Button>
      </div>

      <div className='-mt-1'>
        <Button
          type='button'
          variant='outline'
          onClick={handleClose}
          className='h-9 w-full cursor-pointer justify-center gap-2 rounded-lg border-transparent bg-transparent text-sm text-muted-foreground shadow-none transition-colors duration-300 hover:border-white/10 hover:bg-white/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50'
        >
          <X className='size-4' />
          Close
        </Button>
      </div>
    </div>
  )
}
