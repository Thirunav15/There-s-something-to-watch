import { useShallowState } from '@/store'
import { cn } from '@/utils/tw'
import { getPhotoCaption } from '@/vf/utils/photos'

export const PhotoDetail = ({
  className = '',
}: { photo?: unknown; className?: string }) => {
  const { activePhoto } = useShallowState((state) => ({
    activePhoto: state.activePhoto,
  }))

  if (!activePhoto) return null
  const caption = getPhotoCaption(activePhoto)

  return (
    <div
      className={cn('font-gallery relative flex w-full flex-col', className)}
    >
      {/* High-Resolution Photo Preview */}
      <div className='group relative flex max-h-[min(20dvh,10rem)] min-h-24 w-full shrink-0 items-center justify-center overflow-hidden bg-black/60'>
        <img
          src={activePhoto.imageUrl}
          alt={activePhoto.title}
          className='block h-auto max-h-[min(20dvh,10rem)] w-auto max-w-full object-contain object-center'
        />
        <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30' />

      </div>

      {/* Photo Information & Metadata */}
      <div className='flex min-h-0 min-w-0 flex-col gap-2 overflow-hidden bg-background px-4 py-3 md:px-5'>
        {/* Title & Location/Date Bar */}
        <div className='flex min-w-0 flex-col gap-2'>
          <h2 className='break-words font-semibold text-xl text-foreground tracking-tight md:text-2xl'>
            {activePhoto.title}
          </h2>

          {caption && (
            <div className='rounded-xl border border-white/10 bg-white/[0.03] p-2.5'>
              <p className='whitespace-pre-wrap break-words text-foreground/85 text-sm leading-relaxed'>
                {caption}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
