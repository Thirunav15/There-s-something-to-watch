import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'

import { type PhotoDataSlice, createPhotoDataSlice } from './photo-data-slice'
import { type UiSlice, createUiSlice } from './ui-slice'
import { type VoroforceSlice, createEngineSlice } from './voroforce-slice'

export type StoreState = UiSlice & VoroforceSlice & PhotoDataSlice

export const store = create(
  subscribeWithSelector<StoreState>((...a) => ({
    ...createUiSlice(...a),
    ...createEngineSlice(...a),
    ...createPhotoDataSlice(...a),
  })),
)

export const useShallowState = <U>(selector: (state: StoreState) => U) =>
  store(useShallow(selector))

// Re-export slice types for convenience
export type { PhotoDataSlice, VoroforceSlice, UiSlice }

// Export selectors
export * from './selectors'
