import { type ReactNode, useState } from 'react'

import { useShallowState } from '../../../store'
import { isDefined } from '../../../utils/misc'
import { cn } from '../../../utils/tw'
import { VOROFORCE_PRESET } from '../../../vf'
import { CELL_LIMIT } from '../../../vf/consts'
import { Button, type ButtonProps } from '../../ui/button'
import { AnimateDimensionsChange } from '../animate-dimensions-change'
import { FadeTransition } from '../fade-transition'
import { CellLimitSelector } from './cell-limit-selector'

export function CoreSettingsWidget({
  className = '',
  onSubmit,
  submitLabel = 'Apply',
  submitProps,
  submitVisibility = 'dirty',
  defaultCellLimit,
}: {
  className?: string
  onSubmit?: () => void
  submitLabel?: string | ReactNode
  submitProps?: ButtonProps
  submitVisibility?: 'dirty' | 'always'
  defaultCellLimit?: CELL_LIMIT
}) {
  const {
    setStorePreset,
    setStoreCellLimit,
    storeCellLimit,
  } = useShallowState((state) => ({
    setStorePreset: state.setPreset,
    setStoreCellLimit: state.setCellLimit,
    storeCellLimit: state.cellLimit,
  }))

  const [cellLimit, setCellLimit] = useState<CELL_LIMIT | undefined>(
    defaultCellLimit ?? storeCellLimit ?? CELL_LIMIT.xxs,
  )

  const [isDirty, setIsDirty] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  return (
    <AnimateDimensionsChange
      axis='height'
      className='overflow-visible'
      innerClassName={cn('flex flex-col gap-4', className)}
    >
      <CellLimitSelector
        className='max-md:hidden'
        value={cellLimit}
        onValueChange={(value: CELL_LIMIT) => {
          setCellLimit(value)
          setIsDirty(value !== storeCellLimit)
        }}
      />
      <FadeTransition
        transitionOptions={{
          initialEntered: submitVisibility === 'always',
          timeout: 0,
        }}
        visible={submitVisibility === 'always' || isDirty}
      >
        <Button
          onClick={() => {
            if (isSubmitted) return
            setIsSubmitted(true)
            setStorePreset(VOROFORCE_PRESET.minimal)
            setStoreCellLimit(isDefined(cellLimit) ? cellLimit : CELL_LIMIT.xxs)
            onSubmit?.()
          }}
          size='lg'
          disabled={!isDefined(cellLimit)}
          {...submitProps}
          className={cn(
            'w-full cursor-pointer text-lg',
            submitProps?.className,
          )}
        >
          {submitLabel}
        </Button>
      </FadeTransition>
    </AnimateDimensionsChange>
  )
}
