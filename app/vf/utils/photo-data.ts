import { store } from '@/store'
import type { VoroforceCell } from '../types'
import type { PhotoNode } from './photos'

/** Resolve the photo represented by a Voroforce cell from the current gallery. */
export const getCellPhoto = async (
  cell: VoroforceCell,
): Promise<PhotoNode | undefined> => {
  if (!cell) return undefined
  const photos = store.getState().photos
  if (photos.length === 0) return undefined
  const cellIndex = cell.id !== undefined && cell.id >= 0 ? cell.id : cell.index
  return photos[cellIndex % photos.length]
}
