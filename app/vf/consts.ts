export enum VOROFORCE_MODE {
  preview = 0,
  select = 1,
  intro = 2,
}

export const DEFAULT_VOROFORCE_MODE: VOROFORCE_MODE = VOROFORCE_MODE.preview

export enum VOROFORCE_PRESET {
  mobile = 'mobile',
  minimal = 'minimal',
  contours = 'contours',
  depth = 'depth',
  chaos = 'chaos',
}

export const DEFAULT_VOROFORCE_PRESET: VOROFORCE_PRESET =
  VOROFORCE_PRESET.minimal

export enum DEVICE_CLASS {
  mobile = 0,
  low = 1,
  mid = 2,
  high = 3,
}

export type PresetItem = {
  id: VOROFORCE_PRESET
  name: string
  videoSrc?: string
  imgSrc?: string
  recommendedDeviceClass?: DEVICE_CLASS
  wip?: boolean
  disabled?: boolean
}

export type PresetItems = Array<PresetItem | Array<PresetItem>>

export const PRESET_ITEMS: PresetItems = [
  {
    id: VOROFORCE_PRESET.mobile,
    name: 'Mobile',
  },
  {
    id: VOROFORCE_PRESET.minimal,
    name: 'Minimal',
    // videoSrc: '/tmp.webm',
    recommendedDeviceClass: DEVICE_CLASS.low,
  },
  {
    id: VOROFORCE_PRESET.depth,
    name: 'Depth',
    // videoSrc: '/tmp.webm',
    recommendedDeviceClass: DEVICE_CLASS.high,
  },
  [
    {
      id: VOROFORCE_PRESET.chaos,
      name: 'Chaos',
      recommendedDeviceClass: DEVICE_CLASS.mid,
      wip: true,
    },
    {
      id: VOROFORCE_PRESET.contours,
      name: 'Contours',
      recommendedDeviceClass: DEVICE_CLASS.mid,
      wip: true,
      disabled: true,
    },
  ],
]

export enum CELL_LIMIT {
  xxs = 2000,
  xs = 3000,
  sm = 4000,
  md = 5000,
}

export const DEFAULT_CELL_LIMIT = CELL_LIMIT.md
export const MAX_PHOTO_COUNT = 5000

export const CELL_LIMIT_ITEMS = [
  { value: CELL_LIMIT.xxs, label: '2,000' },
  { value: CELL_LIMIT.xs, label: '3,000' },
  { value: CELL_LIMIT.sm, label: '4,000' },
  { value: CELL_LIMIT.md, label: '5,000' },
]

export const DEVICE_CLASS_ITEMS = [
  {
    id: DEVICE_CLASS.mobile,
    name: '📱Mobile',
    recommendedCellLimit: CELL_LIMIT.xxs,
  },
  {
    id: DEVICE_CLASS.low,
    name: '🥔 Potato',
    recommendedCellLimit: CELL_LIMIT.xxs,
  },
  {
    id: DEVICE_CLASS.mid,
    name: '😐 Mid-range',
    recommendedCellLimit: CELL_LIMIT.sm,
  },
  {
    id: DEVICE_CLASS.high,
    name: '💪 High-end',
    recommendedCellLimit: CELL_LIMIT.md,
  },
]

export const OBSCURE_VISUAL_DEFECTS = true
