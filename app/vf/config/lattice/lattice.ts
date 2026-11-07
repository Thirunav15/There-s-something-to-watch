import { mergeConfigs } from '√'
import { VOROFORCE_MODE } from '../../consts'

export const baseLatticeConfig = {
  enabled: true,
  aspect: 2 / 3,
  modes: {
    [VOROFORCE_MODE.intro]: {},
  },
}

export const introModeLatticeConfig = mergeConfigs(baseLatticeConfig, {
  targetCellSizeViewportPercentage: 0.075,
})
