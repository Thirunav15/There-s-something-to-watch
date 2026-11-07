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
        'relative flex flex-col items-stretch gap-1.5 border-border/60 border-t bg-background/95 px-3 py-3 backdrop-blur-xl md:px-4',
        className,
      )}
    >
      {/* Primary Actions: Download & Edit Tags */}
      <div className='flex flex-col items-stretch gap-1.5'>
        <Button
          variant='outline'
          size='sm'
          className='w-full justify-start'
          onClick={() => toggleFavoritePhoto(activePhoto.id)}
          aria-pressed={isFavorite}
        >
          <Heart
            className={`mr-2 size-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`}
          />
          {isFavorite ? 'Favorited' : 'Favorite'}
        </Button>
        <Button
          variant='default'
          size='sm'
          onClick={handleDownload}
          disabled={downloading}
          className='w-full cursor-pointer justify-start bg-indigo-600 text-white shadow-indigo-600/20 shadow-md hover:bg-indigo-500'
        >
          {downloading ? (
            <Loader2 className='mr-2 size-4 animate-spin' />
          ) : (
            <Download className='mr-2 size-4' />
          )}
          Download Photo
        </Button>

        <Button
          variant='outline'
          size='sm'
          onClick={() => setEditTagsModalOpen(true)}
          className='w-full cursor-pointer justify-start border-border/80 hover:bg-muted/50'
        >
          <Edit3 className='mr-2 size-4 text-indigo-400' />
          Edit Tags
        </Button>

        <Button
          variant='ghost'
          size='sm'
          onClick={handleDelete}
          className='w-full cursor-pointer justify-start text-rose-400 hover:bg-rose-500/10 hover:text-rose-300'
        >
          <Trash2 className='mr-2 size-4' />
          Delete from Galaxy
        </Button>
      </div>

      {/* Close button */}
      <div className='pt-1'>
        <Button
          variant='outline'
          size='sm'
          onClick={handleClose}
          className='w-full cursor-pointer justify-start'
        >
          <X className='mr-1.5 size-4' />
          Close
        </Button>
      </div>
    </div>
  )
}
