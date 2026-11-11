import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { selectIsSelectMode, useShallowState } from '@/store'
import type { DialogProps } from 'vaul'
import { useMediaQuery } from '@/hooks/use-media-query'
import { isInputDOMNode } from '@/hooks/use-key-press'
import { down, orientation } from '@/utils/mq'
import { cn } from '@/utils/tw'
import type { VoroforceCell } from '@/vf'
import type { PhotoNode } from '@/vf/utils/photos'
import { Modal } from '../../common/modal'

const PhotoView = lazy(() =>
  import('./photo-detail').then((module) => ({ default: module.PhotoDetail })),
)

const PhotoViewFooter = lazy(() =>
  import('./photo-detail-actions').then((module) => ({
    default: module.PhotoDetailActions,
  })),
)

const getDefaultDirection = (isLandscape: boolean): DialogProps['direction'] =>
  isLandscape ? 'left' : 'top'

export const PhotoDetailDrawer = () => {
  const [open, setOpen] = useState(false)
  const isSmallScreen = useMediaQuery(down('md'))
  const isLandscape = useMediaQuery(orientation('landscape'))
  const [direction, setDirection] = useState(getDefaultDirection(isLandscape))
  const [mountContent, setMountContent] = useState(false)
  const [freezePhoto, setFreezePhoto] = useState(false)
  const heldArrowTimersRef = useRef(
    new Map<string, ReturnType<typeof setTimeout>>(),
  )
  const longPressArrowKeysRef = useRef(new Set<string>())
  const photoRef = useRef<PhotoNode>(undefined)
  const voroforceCellRef = useRef<VoroforceCell>(undefined)

  const {
    photo: activePhoto,
    isSelectMode,
    voroforce,
    exitVoroforceSelectMode,
    addCustomLinkTypeOpen,
    setAddCustomLinkTypeOpen,
    photos,
    setActivePhoto,
    editTagsModalOpen,
  } = useShallowState((state) => ({
    photo: state.activePhoto,
    isSelectMode: selectIsSelectMode(state),
    voroforce: state.voroforce,
    exitVoroforceSelectMode: state.exitSelectMode,
    addCustomLinkTypeOpen: state.addCustomLinkTypeOpen,
    setAddCustomLinkTypeOpen: state.setAddCustomLinkTypeOpen,
    photos: state.photos,
    setActivePhoto: state.setActivePhoto,
    editTagsModalOpen: state.editTagsModalOpen,
  }))
  const activePhotoRef = useRef(activePhoto)
  activePhotoRef.current = activePhoto

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  const [photo, voroforceCell] = useMemo(() => {
    if (freezePhoto) return [photoRef.current, voroforceCellRef.current]
    photoRef.current = activePhoto
    voroforceCellRef.current = voroforce?.cells?.focused
    return [activePhoto, voroforceCellRef.current]
  }, [activePhoto, freezePhoto])

  useEffect(() => {
    if (mountContent) return
    const mount = () => setMountContent(true)
    if (isSelectMode) {
      mount()
    } else if (voroforce) {
      setTimeout(() => {
        mount()
      }, 5000)
    }
  }, [voroforce, isSelectMode, mountContent])

  const onClose = useCallback(() => {
    setFreezePhoto(false)
    setOpen(false)
    setAddCustomLinkTypeOpen(false)
  }, [setAddCustomLinkTypeOpen])

  const handleClose = useCallback(() => {
    exitVoroforceSelectMode()
    onClose()
  }, [exitVoroforceSelectMode, onClose])

  useEffect(() => {
    if (!open) return

    const clearHeldKeys = () => {
      for (const timer of heldArrowTimersRef.current.values())
        clearTimeout(timer)
      heldArrowTimersRef.current.clear()
      longPressArrowKeysRef.current.clear()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isInputDOMNode(event)) return

      if (event.key === 'Escape') {
        if (editTagsModalOpen || addCustomLinkTypeOpen) return
        event.preventDefault()
        event.stopImmediatePropagation()
        handleClose()
        return
      }

      const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
      if (
        editTagsModalOpen ||
        addCustomLinkTypeOpen ||
        !arrowKeys.includes(event.key)
      ) {
        return
      }

      event.preventDefault()

      // Once a key has been held for two seconds, let Voroforce handle it.
      if (longPressArrowKeysRef.current.has(event.key)) return

      event.stopImmediatePropagation()
      if (event.repeat || heldArrowTimersRef.current.has(event.key)) return

      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        const currentPhoto = activePhotoRef.current
        const currentIndex = currentPhoto
          ? photos.findIndex((item) => item.id === currentPhoto.id)
          : -1
        if (currentIndex >= 0 && photos.length > 1) {
          const offset = event.key === 'ArrowRight' ? 1 : -1
          const nextIndex =
            (currentIndex + offset + photos.length) % photos.length
          setFreezePhoto(false)
          setActivePhoto(photos[nextIndex])
        }
      }

      const key = event.key
      const timer = setTimeout(() => {
        heldArrowTimersRef.current.delete(key)
        longPressArrowKeysRef.current.add(key)
        // Pass one keydown through to the field controls; native repeats keep moving.
        window.dispatchEvent(
          new KeyboardEvent('keydown', {
            key,
            code: key,
            bubbles: true,
            cancelable: true,
          }),
        )
      }, 2000)
      heldArrowTimersRef.current.set(key, timer)
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!event.key.startsWith('Arrow')) return
      const timer = heldArrowTimersRef.current.get(event.key)
      if (timer) clearTimeout(timer)
      heldArrowTimersRef.current.delete(event.key)
      longPressArrowKeysRef.current.delete(event.key)
    }

    window.addEventListener('keydown', handleKeyDown, true)
    window.addEventListener('keyup', handleKeyUp, true)
    window.addEventListener('blur', clearHeldKeys)
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true)
      window.removeEventListener('keyup', handleKeyUp, true)
      window.removeEventListener('blur', clearHeldKeys)
      clearHeldKeys()
    }
  }, [
    open,
    photos,
    setActivePhoto,
    handleClose,
    editTagsModalOpen,
    addCustomLinkTypeOpen,
  ])

  useEffect(() => {
    if (isSelectMode) {
      let direction = getDefaultDirection(isLandscape)
      const voroforceCell = voroforceCellRef.current
      if (voroforceCell) {
        if (isLandscape) {
          if (voroforceCell.x < window.innerWidth / (isSmallScreen ? 2 : 3)) {
            direction = 'right'
          }
        } else {
          if (voroforceCell.y < window.innerHeight / 2) {
            direction = 'bottom'
          }
        }
      }
      setDirection(direction)
      setOpen(true)
    } else {
      onClose()
    }
  }, [isSelectMode, isLandscape, isSmallScreen, onClose])

  return (
    <Modal
      rootProps={{
        direction,
        open,
        onClose: handleClose,
        modal: false,
      }}
      contentProps={{
        ...(!isSmallScreen && {
          onMouseEnter: () => setFreezePhoto(true),
          onMouseLeave: () => setFreezePhoto(false),
        }),
        className: cn(
          'group z-50 landscape:!max-h-[min(85vh,44rem)] landscape:!w-fit landscape:!min-w-72 landscape:!max-w-[min(90vw,32rem)]',
          {
            'contain-layout contain-paint contain-style':
              !addCustomLinkTypeOpen,
            'lg:landscape:pt-24': direction === 'right',
          },
        ),
      }}
      innerContentProps={{
        className:
          'relative z-40 flex h-[min(85dvh,44rem)] min-h-0 flex-col overflow-hidden landscape:lg:!h-[min(85dvh,44rem)]',
      }}
      footer={
        mountContent ? (
          <PhotoViewFooter
            photo={photo}
            voroforceCell={voroforceCell}
            handleClose={handleClose}
            direction={direction}
          />
        ) : null
      }
      footerProps={{ className: '!static !pointer-events-auto shrink-0' }}
      handleProps={{
        className:
          'max-md:bg-background max-md:-translate-y-[150%] max-md:h-1.5 lg:bg-transparent lg:backdrop-blur-lg',
      }}
      additional={null}
      disableVoroforceKeyboardControls={editTagsModalOpen}
    >
      <Suspense>
        {mountContent && (
          <PhotoView
            photo={photo}
            className='min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain'
          />
        )}
      </Suspense>
    </Modal>
  )
}
