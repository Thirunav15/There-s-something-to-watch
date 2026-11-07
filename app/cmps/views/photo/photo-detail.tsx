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
      className={cn('relative flex w-full flex-col overflow-hidden', className)}
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
      <div className='flex min-w-0 flex-col gap-2.5 bg-background px-3 py-3 md:px-4'>
        {/* Title & Location/Date Bar */}
        <div className='flex flex-col gap-2'>
          <h2 className='break-words font-bold text-lg text-foreground tracking-tight md:text-xl'>
            {activePhoto.title}
          </h2>

          <div className='flex flex-wrap items-center gap-2 text-muted-foreground text-xs'>
            {activePhoto.location && (
              <span className='flex items-center gap-1.5 rounded-md border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 font-medium text-rose-300'>
                <MapPin className='size-3.5 shrink-0 text-rose-400' />
                {activePhoto.location}
              </span>
            )}
            {activePhoto.date && (
              <span className='flex items-center gap-1.5 rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 font-medium text-indigo-300'>
                <Calendar className='size-3.5 shrink-0 text-indigo-400' />
                {activePhoto.date}
              </span>
            )}
          </div>
        </div>

        {activePhoto.tags?.length > 0 && (
          <div className='flex flex-wrap gap-1.5'>
            {activePhoto.tags.map((tag: string) => (
              <Badge key={tag} className='border border-white/15 bg-white/5 px-2 py-0.5 text-xs text-foreground/80'>
                <Tag className='mr-1 size-3 text-indigo-400' />
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Caption */}
        {activePhoto.caption && (
          <div className='rounded-lg border border-border/60 bg-muted/20 p-3'>
            <p className='text-foreground/90 text-sm leading-relaxed'>
              {activePhoto.caption}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
