import { type ReactNode, useEffect, useState } from 'react'

import { useShallowState } from '../../../store'
import { isDefined } from '../../../utils/misc'
import { cn } from '../../../utils/tw'
import { VOROFORCE_PRESET } from '../../../vf'
import { CELL_LIMIT, DEFAULT_CELL_LIMIT } from '../../../vf/consts'
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
  const { setStorePreset, setStoreCellLimit, storeCellLimit } = useShallowState(
    (state) => ({
      setStorePreset: state.setPreset,
      setStoreCellLimit: state.setCellLimit,
      storeCellLimit: state.cellLimit,
    }),
  )

  const [cellLimit, setCellLimit] = useState<CELL_LIMIT | undefined>(
    defaultCellLimit ?? storeCellLimit ?? DEFAULT_CELL_LIMIT,
  )

  const [isDirty, setIsDirty] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [hasUserSelectedCellLimit, setHasUserSelectedCellLimit] =
    useState(false)

  useEffect(() => {
    if (defaultCellLimit !== undefined && !hasUserSelectedCellLimit) {
      setCellLimit(defaultCellLimit)
    }
  }, [defaultCellLimit, hasUserSelectedCellLimit])

  return (
    <AnimateDimensionsChange
      axis='height'
      className='overflow-visible'
      innerClassName={cn('flex flex-col gap-4', className)}
    >
      <CellLimitSelector
        value={cellLimit}
        onValueChange={(value: CELL_LIMIT) => {
          setHasUserSelectedCellLimit(true)
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
            setStoreCellLimit(
              isDefined(cellLimit) ? cellLimit : DEFAULT_CELL_LIMIT,
            )
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
