import { useShallowState } from '@/store'
import { VOROFORCE_MODE } from '@/vf/consts'
import { MapPin, Trash } from 'lucide-react'
import { Modal } from '../../common/modal'
import { Button } from '../../ui/button'
import { ScrollArea } from '../../ui/scroll-area'

export const Favorites = () => {
  const {
    open,
    setOpen,
    photos,
    favoritePhotoIds,
    toggleFavoritePhoto,
    setActivePhoto,
    voroforce,
    setMode,
  } = useShallowState((state) => ({
    open: state.favoritesOpen,
    setOpen: state.setFavoritesOpen,
    photos: state.photos,
    favoritePhotoIds: state.favoritePhotoIds,
    toggleFavoritePhoto: state.toggleFavoritePhoto,
    setActivePhoto: state.setActivePhoto,
    voroforce: state.voroforce,
    setMode: state.setMode,
  }))
  const favorites = photos.filter((photo) =>
    favoritePhotoIds.includes(photo.id),
  )

  return (
    <Modal
      rootProps={{ open, onClose: () => setOpen(false) }}
      contentProps={{
        className: '!top-32 !bottom-0 !z-50 !h-[calc(100dvh-8rem)]',
      }}
      innerContentProps={{ className: 'flex h-full min-h-0 flex-col' }}
      footerProps={{
        className: '!static !pointer-events-auto !z-10 shrink-0',
      }}
      overlay
      footer={
        <div className='flex w-full justify-between gap-3 p-4 md:p-6'>
          <Button variant='outline' onClick={() => setOpen(false)}>
            Close
          </Button>
          {favorites.length > 0 && (
            <Button
              variant='outline'
              onClick={() =>
                favorites.forEach((photo) => toggleFavoritePhoto(photo.id))
              }
            >
              Clear favorites
            </Button>
          )}
        </div>
      }
    >
      <ScrollArea
        className='min-h-0 flex-1 bg-background/60'
        innerClassName='h-full max-h-full'
      >
        <div className='grid w-full grid-cols-1 gap-3 p-4 sm:grid-cols-2 md:gap-4 md:p-6'>
          {favorites.map((photo) => (
            <article
              key={photo.id}
              className='group relative overflow-hidden rounded-xl border border-white/10 bg-background/70'
            >
              <button
                type='button'
                className='block h-44 w-full cursor-pointer overflow-hidden bg-black/40 text-left'
                onClick={() => {
                  setActivePhoto(photo)
                  if (photo.cellId !== undefined)
                    voroforce?.controls?.navigateToCell(photo.cellId)
                  setMode(VOROFORCE_MODE.select)
                  setOpen(false)
                }}
                aria-label={`Show ${photo.title} in the galaxy`}
              >
                <img
                  src={photo.imageUrl}
                  alt=''
                  className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                />
              </button>
              <div className='p-3 pr-12'>
                <h2 className='truncate font-semibold'>{photo.title}</h2>
                <p className='mt-1 flex items-center gap-1 truncate text-muted-foreground text-xs'>
                  {photo.location && (
                    <>
                      <MapPin className='size-3 shrink-0' />
                      {photo.location}
                    </>
                  )}
                  {!photo.location && photo.date}
                </p>
              </div>
              <Button
                size='icon'
                variant='ghost'
                aria-label={`Remove ${photo.title} from favorites`}
                className='absolute top-2 right-2 size-8 rounded-full bg-black/60 text-white hover:bg-black/80'
                onClick={() => toggleFavoritePhoto(photo.id)}
              >
                <Trash className='size-4' />
              </Button>
            </article>
          ))}
          {favorites.length === 0 && (
            <div className='col-span-full flex min-h-56 items-center justify-center text-muted-foreground'>
              No favorite photos yet
            </div>
          )}
        </div>
      </ScrollArea>
    </Modal>
  )
}
