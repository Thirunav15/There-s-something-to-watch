import type { StateCreator } from 'zustand'
import {
  type PhotoNode,
  clusterPhotosByTagOrDate,
  loadFavoritePhotoIds,
  loadStoredPhotos,
  persistFavoritePhotoIds,
  persistPhotos,
} from '../vf/utils/photos'

export interface PhotoDataSlice {
  // Photo Galaxy Core Data
  photos: PhotoNode[]
  favoritePhotoIds: number[]
  toggleFavoritePhoto: (id: number) => void
  setPhotos: (photos: PhotoNode[]) => void
  activePhoto?: PhotoNode
  setActivePhoto: (photo?: PhotoNode) => void
  addPhoto: (newPhotoData: Omit<PhotoNode, 'id'>) => PhotoNode
  addPhotos: (newPhotosData: Omit<PhotoNode, 'id'>[]) => PhotoNode[]
  deletePhoto: (id: number) => void
  deletePhotos: (ids: number[]) => void
  updatePhotoTags: (id: number, tags: string[]) => void
  updatePhotoDetails: (
    id: number,
    details: Partial<
      Pick<PhotoNode, 'title' | 'caption' | 'date' | 'location' | 'tags'>
    >,
  ) => void

  // Search & Filtering
  searchQuery: string
  setSearchQuery: (query: string) => void
  activeFilterTag?: string
  setActiveFilterTag: (tag?: string) => void

  // Upload UI State
  uploadModalOpen: boolean
  setUploadModalOpen: (open: boolean) => void
  pendingUploadFile?: File
  setPendingUploadFile: (file?: File) => void
  pendingUploadBatch?: File[]
  setPendingUploadBatch: (files?: File[]) => void

  // Edit Tags UI State
  editTagsModalOpen: boolean
  setEditTagsModalOpen: (open: boolean) => void
}

export const createPhotoDataSlice: StateCreator<
  PhotoDataSlice,
  [],
  [],
  PhotoDataSlice
> = (set, get) => {
  const initialPhotos = clusterPhotosByTagOrDate(loadStoredPhotos())

  return {
    photos: initialPhotos,
    setPhotos: (photos: PhotoNode[]) => {
      persistPhotos(photos)
      set({
        photos,
        activePhoto: get().activePhoto ?? photos[0],
      })
    },
    activePhoto: initialPhotos[0],
    setActivePhoto: (photo?: PhotoNode) => {
      set({
        activePhoto: photo,
      })
    },
    addPhoto: (newPhotoData: Omit<PhotoNode, 'id'>) => {
      const current = get().photos
      const nextId =
        current.length > 0
          ? Math.max(...current.map((p) => Number(p.id) || 0)) + 1
          : 1
      const cellId =
        current.reduce(
          (max, photo, index) => Math.max(max, photo.cellId ?? index),
          -1,
        ) + 1
      const newPhoto: PhotoNode = {
        ...newPhotoData,
        id: nextId,
        cellId,
      }
      const updated = [...current, newPhoto]
      persistPhotos(updated)
      set({
        photos: updated,
        activePhoto: newPhoto,
      })
      return newPhoto
    },
    addPhotos: (newPhotosData: Omit<PhotoNode, 'id'>[]) => {
      if (newPhotosData.length === 0) return []

      const current = get().photos
      const nextId =
        current.length > 0
          ? Math.max(...current.map((p) => Number(p.id) || 0)) + 1
          : 1
      const nextCellId =
        current.reduce(
          (max, photo, index) => Math.max(max, photo.cellId ?? index),
          -1,
        ) + 1
      const newPhotos = newPhotosData.map((photo, index) => ({
        ...photo,
        id: nextId + index,
        cellId: nextCellId + index,
      }))
      const updated = [...current, ...newPhotos]

      persistPhotos(updated)
      set({ photos: updated, activePhoto: newPhotos[newPhotos.length - 1] })
      return newPhotos
    },
    favoritePhotoIds: loadFavoritePhotoIds(),
    toggleFavoritePhoto: (id: number) => {
      const ids = get().favoritePhotoIds
      const next = ids.includes(id)
        ? ids.filter((favoriteId) => favoriteId !== id)
        : [...ids, id]
      persistFavoritePhotoIds(next)
      set({ favoritePhotoIds: next })
    },
    deletePhoto: (id: number) => {
      const current = get().photos
      const updated = current.filter((p) => p.id !== id)
      persistPhotos(updated)
      const favoritePhotoIds = get().favoritePhotoIds.filter(
        (favoriteId) => favoriteId !== id,
      )
      persistFavoritePhotoIds(favoritePhotoIds)
      set({
        photos: updated,
        favoritePhotoIds,
        activePhoto: updated[0] ?? undefined,
      })
    },
    deletePhotos: (ids: number[]) => {
      const idsToDelete = new Set(ids)
      const updated = get().photos.filter((photo) => !idsToDelete.has(photo.id))
      const favoritePhotoIds = get().favoritePhotoIds.filter(
        (favoriteId) => !idsToDelete.has(favoriteId),
      )
      persistPhotos(updated)
      persistFavoritePhotoIds(favoritePhotoIds)
      set({
        photos: updated,
        favoritePhotoIds,
        activePhoto: updated[0] ?? undefined,
      })
    },
    updatePhotoTags: (id: number, tags: string[]) => {
      const current = get().photos
      const updated = current.map((p) => (p.id === id ? { ...p, tags } : p))
      persistPhotos(updated)
      const active = get().activePhoto
      set({
        photos: updated,
        activePhoto: active?.id === id ? { ...active, tags } : active,
      })
    },
    updatePhotoDetails: (id, details) => {
      const updated = get().photos.map((photo) =>
        photo.id === id ? { ...photo, ...details } : photo,
      )
      persistPhotos(updated)
      const active = get().activePhoto
      set({
        photos: updated,
        activePhoto: active?.id === id ? { ...active, ...details } : active,
      })
    },

    searchQuery: '',
    setSearchQuery: (searchQuery: string) => set({ searchQuery }),
    activeFilterTag: undefined,
    setActiveFilterTag: (activeFilterTag?: string) => set({ activeFilterTag }),

    uploadModalOpen: false,
    setUploadModalOpen: (uploadModalOpen: boolean) => set({ uploadModalOpen }),
    pendingUploadFile: undefined,
    setPendingUploadFile: (pendingUploadFile?: File) =>
      set({ pendingUploadFile }),
    pendingUploadBatch: undefined,
    setPendingUploadBatch: (pendingUploadBatch?: File[]) =>
      set({ pendingUploadBatch }),

    editTagsModalOpen: false,
    setEditTagsModalOpen: (editTagsModalOpen: boolean) =>
      set({ editTagsModalOpen }),
  }
}
