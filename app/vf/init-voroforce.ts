import voroforce from '√/index'

import { store } from '../store'
import { initVoroforceIntegrations } from './integrations'
import type { VoroforceCell, VoroforceInstance } from './types'
import { getVoroforceConfig, getVoroforceConfigUniforms } from './utils'

export const initVoroforce = ({
  // biome-ignore lint/style/noNonNullAssertion: exists
  container = document.getElementById('voroforce')!,
  force,
}: {
  container?: HTMLElement
  force?: boolean
} = {}) => {
  const state = store.getState()
  if (state.voroforce) return // already initialized
  if (!force && !state.preset) return

  const config = getVoroforceConfig(state)
  const vfInstance = voroforce(container, config) as VoroforceInstance
  store.setState({
    container,
    voroforce: vfInstance,
    config,
    configUniforms: getVoroforceConfigUniforms(config, state.mode, state.theme),
  })
  initVoroforceIntegrations()

  // Load photos into the WebGL texture array
  const loadAllPhotos = (photos = store.getState().photos) => {
    if (!photos?.length) return
    const texture = vfInstance.display.scene.virtualMediaGridTextures?.[0]
    const textureCapacity = texture
      ? texture.layerCapacity * texture.length
      : photos.length
    for (let index = 0; index < textureCapacity; index++) {
      const photo = photos[index % photos.length]
      if (photo) void vfInstance.loadPhotoTexture?.(photo, index)
    }
  }

  loadAllPhotos()

  // Assign cluster IDs to cells based on photo tags for clustering
  const assignClusterIds = () => {
    const photos = store.getState().photos
    if (!vfInstance.cells || !photos) return
    const tagMap = new Map<string, number>()
    let nextClusterId = 1
    photos.forEach((p) => {
      const tag = p.tags?.[0] || 'Default'
      if (!tagMap.has(tag)) {
        tagMap.set(tag, nextClusterId++)
      }
    })

    vfInstance.cells.forEach((cell: VoroforceCell, idx: number) => {
      // This gallery uses one virtual texture atlas (media version 3).
      cell.mediaVersion = 3
      cell.targetMediaVersion = 3
      const photo = photos[idx % photos.length]
      if (photo) {
        const tag = photo.tags?.[0] || 'Default'
        cell.clusterId = tagMap.get(tag) || 0
      }
    })
  }

  assignClusterIds()

  // Listen for photos change to stream new uploads into WebGL textures
  store.subscribe(
    (s) => s.photos,
    (photos) => {
      loadAllPhotos(photos)
      assignClusterIds()
    },
  )
}
