export const selectForceSimulationStepConfig = {
  parameters: {
    alpha: 0.15,
    velocityDecay: 0.8,
    velocityDecayBase: 0.8,
    velocityDecayTransitionEnterMode: 0.8,
  },
  forces: {
    manageWeights: true,
    primaryCellWeightPushFactorEnabled: false,
    smoothPrimaryCell: false,
    requestMediaVersions: {
      enabled: false,
    },
    breathing: {
      enabled: false,
    },
    push: {
      strength: 0.05,
      selector: 'focused',
      yFactor: 1.5,
    },
    lattice: {
      strength: 1,
      yFactor: 1.5,
      xFactor: 1,
      maxLevelsFromPrimary: 50,
    },
    origin: {
      strength: 0.1,
      latticeScale: 3,
    },
  },
}
