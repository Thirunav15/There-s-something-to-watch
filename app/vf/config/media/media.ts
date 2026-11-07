export const photoGalaxyMediaVersionConfig = {
  cols: 1,
  rows: 1,
  virtualCols: 8,
  virtualRows: 6,
  tileWidth: 240,
  tileHeight: 320,
  width: 1920,
  height: 1920,
  layers: 200,
  virtualLayers: 10,
  layerIndexStart: 0,
  layerSrcFormat: '',
  type: 'uncompressed-single',
}

const mediaConfig = {
  enabled: true,
  baseUrl: '',
  preload: false,
  compressionFormat: 'dds',
  versions: [photoGalaxyMediaVersionConfig],
}

export default mediaConfig

export const uncompressedSingleMediaVersionConfig =
  photoGalaxyMediaVersionConfig

export const mediaConfigWithUncompressedSingleVersion = mediaConfig
