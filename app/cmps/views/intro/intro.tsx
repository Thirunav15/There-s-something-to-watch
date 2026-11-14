import { useEffect, useReducer, useState } from 'react'
import { useShallowState } from '../../../store'
import { cn } from '../../../utils/tw'
import { VOROFORCE_MODE, VOROFORCE_PRESET } from '../../../vf'
import {
  DEFAULT_CELL_LIMIT,
  DEVICE_CLASS_ITEMS,
  OBSCURE_VISUAL_DEFECTS,
} from '../../../vf/consts'
import { DeviceClassWidget } from '../../common/device-class/device-class-widget'
import { FadeTransition } from '../../common/fade-transition'

export const Intro = () => {
  const { preset, playedIntro, setPreset, setCellLimit } = useShallowState(
    (state) => ({
      preset: state.preset,
      playedIntro: state.playedIntro,
      setPreset: state.setPreset,
      setCellLimit: state.setCellLimit,
    }),
  )

  const [initialPreset] = useState(preset)

  const visible = useIntroVisible()

  return (
    <FadeTransition
      className={cn(
        'fixed inset-0 z-60 flex h-dvh w-full justify-center bg-background px-6 py-6 duration-700 sm:px-8 sm:py-8 md:px-12 md:py-10',
        {
          '!duration-0': visible,
        },
      )}
      visible={visible}
      transitionOptions={{
        initialEntered: visible,
        timeout: visible ? 0 : 700,
      }}
    >
      <div className='font-gallery grid h-full min-h-0 w-full max-w-6xl grid-rows-[1fr_auto_1fr]'>
        <div
          className={cn('min-h-8', {
            'max-lg:landscape:hidden [@media(min-aspect-ratio:2.5)]:hidden':
              !initialPreset,
          })}
        />
        <div className='flex flex-col items-start justify-center py-8 text-left'>
          <h1 className='text-balance font-semibold text-4xl leading-none tracking-tighter sm:text-5xl md:text-7xl'>
            <span className='text-foreground'>Photo </span>
            <span className='relative inline-flex bg-gradient-to-r from-white to-[#9b9b9b] bg-clip-text text-transparent'>
              Galaxy
              <span className='absolute bottom-0 left-full after:animate-ellipsis' />
            </span>
          </h1>
          <p className='mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg'>
            Explore your photos in a living, spatial gallery.
          </p>
        </div>
        <div className='relative flex min-h-0 flex-col items-stretch justify-end gap-4 pb-2 sm:pb-4'>
          <FadeTransition
            visible={!preset || !playedIntro}
            className='absolute inset-x-0 bottom-2 w-full rounded-2xl border border-white/10 bg-[#181818]/85 p-4 shadow-xl backdrop-blur-xl duration-500 sm:bottom-4 sm:p-6'
            transitionOptions={{
              timeout: 500,
            }}
          >
            <DeviceClassWidget
              className='mx-auto w-full max-w-xl gap-4'
              onSubmit={(deviceClass) => {
                const recommendedCellLimit =
                  DEVICE_CLASS_ITEMS.find((item) => item.id === deviceClass)
                    ?.recommendedCellLimit ?? DEFAULT_CELL_LIMIT
                setCellLimit(recommendedCellLimit)
                setPreset(VOROFORCE_PRESET.minimal)
              }}
            />
            <PhotoGalaxyInfo />
          </FadeTransition>
        </div>
      </div>
    </FadeTransition>
  )
}

const PhotoGalaxyInfo = () => (
  <span className='mt-3 block text-center text-xs leading-relaxed text-muted-foreground'>
    Your photos stay in this browser &bull; Explore by place, date, and tag
  </span>
)

const DEFAULT_REVEAL_SCREEN_DELAY = 1200
const DEFAULT_PREVIEW_MODE_REVEAL_SCREEN_DELAY = 600
let hideScreen = OBSCURE_VISUAL_DEFECTS
function useIntroVisible() {
  const { introRequired, voroforceMediaPreloaded, revealScreenDelay } =
    useShallowState((state) => ({
      introRequired: !state.playedIntro || !state.preset,
      voroforceMediaPreloaded: state.voroforceMediaPreloaded,
      revealScreenDelay: state.config?.revealScreenDelay
        ? (state.config.revealScreenDelay.modes?.[state.mode] ??
          state.config.revealScreenDelay.default)
        : state.mode === VOROFORCE_MODE.preview
          ? DEFAULT_PREVIEW_MODE_REVEAL_SCREEN_DELAY
          : DEFAULT_REVEAL_SCREEN_DELAY,
    }))

  if (OBSCURE_VISUAL_DEFECTS) {
    const [, forceUpdate] = useReducer((x) => x + 1, 0)
    // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
    useEffect(() => {
      setTimeout(() => {
        hideScreen = false
        forceUpdate()
      }, revealScreenDelay)
    }, [])

    useEffect(() => {
      let timeout: NodeJS.Timeout
      const onResize = () => {
        hideScreen = true
        forceUpdate()
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          hideScreen = false
          forceUpdate()
        }, revealScreenDelay)
      }
      window.addEventListener('resize', onResize)
      return () => {
        window.removeEventListener('resize', onResize)
      }
    }, [revealScreenDelay])
  }

  return introRequired || hideScreen || !voroforceMediaPreloaded
}
