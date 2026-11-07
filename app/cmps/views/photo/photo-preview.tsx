import { selectIsPreviewMode, useShallowState } from '@/store'
import { MapPin } from 'lucide-react'
import { Badge } from '../../ui/badge'

/** Compact photo details shown while a cell is focused in preview mode. */
export const PhotoPreview = () => {
  const { photo, isPreviewMode } = useShallowState((state) => ({
    photo: state.activePhoto,
    isPreviewMode: selectIsPreviewMode(state),
  }))

  if (!photo || !isPreviewMode) return null

  return (
    <aside className='pointer-events-none fixed top-5 left-5 z-10 flex max-w-[min(34rem,calc(100vw-2.5rem))] items-center gap-4 rounded-2xl border border-white/10 bg-black/65 p-3 text-white shadow-2xl backdrop-blur-xl md:top-8 md:left-8 md:gap-5 md:p-4'>
      <img src={photo.imageUrl} alt='' className='size-16 shrink-0 rounded-xl object-cover md:size-24' />
      <div className='min-w-0'>
        {photo.location && <p className='mb-1 flex items-center gap-1 text-xs text-white/60'><MapPin className='size-3' />{photo.location}</p>}
        <h2 className='line-clamp-2 font-semibold text-lg leading-tight md:text-2xl'>{photo.title}</h2>
        {photo.date && <p className='mt-1 text-xs text-white/55'>{photo.date}</p>}
        <div className='mt-2 flex flex-wrap gap-1.5'>
          {photo.tags.slice(0, 4).map((tag) => <Badge key={tag} className='border-white/10 bg-white/10 text-white/75'>{tag}</Badge>)}
        </div>
      </div>
    </aside>
  )
}
