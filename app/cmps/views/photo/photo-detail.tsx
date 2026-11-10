import { useShallowState } from '@/store'
import { Calendar, MapPin, Tag } from 'lucide-react'
import { cn } from '@/utils/tw'
import { Badge } from '@/cmps/ui/badge'

export const PhotoDetail = ({
  className = '',
}: { photo?: unknown; className?: string }) => {
  const { activePhoto } = useShallowState((state) => ({
    activePhoto: state.activePhoto,
  }))

  if (!activePhoto) return null

  return (
    <div
      className={cn('font-gallery relative flex w-full flex-col overflow-hidden', className)}
    >
      {/* High-Resolution Photo Preview */}
      <div className='group relative flex max-h-[min(38vh,16rem)] min-h-40 w-full shrink-0 items-center justify-center overflow-hidden bg-black/60'>
        <img
          src={activePhoto.imageUrl}
          alt={activePhoto.title}
          className='block h-auto max-h-[min(38vh,16rem)] w-auto max-w-full object-contain object-center'
        />
        <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30' />

      </div>

      {/* Photo Information & Metadata */}
      <div className='flex min-w-0 flex-col gap-3 bg-background px-4 py-4 md:px-5 md:py-5'>
        {/* Title & Location/Date Bar */}
        <div className='flex flex-col gap-2'>
          <h2 className='break-words font-semibold text-xl text-foreground tracking-tight md:text-2xl'>
            {activePhoto.title}
          </h2>

          <div className='flex flex-wrap items-center gap-2 text-muted-foreground text-sm'>
            {activePhoto.location && (
              <span className='flex min-w-0 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-medium text-foreground/80'>
                <MapPin className='size-4 shrink-0 text-muted-foreground' />
                {activePhoto.location}
              </span>
            )}
            {activePhoto.date && (
              <span className='flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-medium text-foreground/80'>
                <Calendar className='size-4 shrink-0 text-muted-foreground' />
                {activePhoto.date}
              </span>
            )}
          </div>
        </div>

        {activePhoto.tags?.length > 0 && (
          <div className='flex flex-wrap gap-2'>
            {activePhoto.tags.map((tag: string) => (
              <Badge key={tag} className='border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-foreground/80'>
                <Tag className='mr-1 size-3 text-muted-foreground' />
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Caption */}
        {activePhoto.caption && (
          <div className='rounded-xl border border-white/10 bg-white/[0.03] p-4'>
            <p className='text-foreground/85 text-sm leading-relaxed'>
              {activePhoto.caption}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
