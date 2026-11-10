import { useEffect, useState } from 'react'
import { useShallowState } from '@/store'
import { Settings2 } from 'lucide-react'

export const FpsIndicator = () => {
  const {
    performanceMonitor,
    performanceSettingsOpen,
    setPerformanceSettingsOpen,
  } = useShallowState((state) => ({
    performanceMonitor: state.performanceMonitor,
    performanceSettingsOpen: state.performanceSettingsOpen,
    setPerformanceSettingsOpen: state.setPerformanceSettingsOpen,
  }))
  const [fps, setFps] = useState<number | null>(null)

  useEffect(() => {
    if (!performanceMonitor) {
      setFps(null)
      return
    }

    const updateFps = () => {
      setFps(
        performanceMonitor.visible && performanceMonitor.fps > 0
          ? Math.round(performanceMonitor.fps)
          : null,
      )
    }

    updateFps()
    const interval = window.setInterval(updateFps, 500)
    return () => window.clearInterval(interval)
  }, [performanceMonitor])

  if (!performanceMonitor) return null

  const minimumFps = performanceMonitor.refreshRate > 100 ? 60 : 50
  const statusColor =
    fps === null
      ? 'bg-white/40'
      : fps < minimumFps
        ? 'bg-rose-400'
        : 'bg-emerald-400'
  return (
    <div className='font-gallery pointer-events-none fixed bottom-4 left-4 z-40 md:bottom-6 md:left-6'>
      <button
        type='button'
        aria-haspopup='dialog'
        aria-expanded={performanceSettingsOpen}
        aria-label={`${fps === null ? 'FPS is measuring' : `Current frame rate: ${fps} FPS`}. Open performance settings`}
        onClick={() => setPerformanceSettingsOpen(true)}
        title={`Live frame rate${fps === null ? '' : `: ${fps} FPS`}. Click to open performance settings.`}
        className='pointer-events-auto flex items-center gap-1.5 rounded-full border border-white/10 bg-[#181818]/95 px-2.5 py-1.5 text-[11px] font-medium tabular-nums text-foreground/80 shadow-lg backdrop-blur-xl transition-colors hover:border-white/25 hover:bg-[#272727] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70'
      >
        <span className={`size-1.5 rounded-full ${statusColor}`} />
        <span>{fps === null ? 'FPS —' : `FPS ${fps}`}</span>
        <Settings2 className='size-3 text-muted-foreground' />
      </button>
    </div>
  )
}
