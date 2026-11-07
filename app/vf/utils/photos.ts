export interface PhotoNode {
  id: number
  title: string
  caption?: string
  imageUrl: string
  tags: string[]
  location?: string
  date: string
  x?: number
  y?: number
  cellId?: number
}

export const PHOTO_GALAXY_STORAGE_KEY = 'photo_galaxy_user_nodes_v1'
export const PHOTO_GALAXY_FAVORITES_KEY = 'photo_galaxy_favorites_v1'

export const SEED_PHOTOS: PhotoNode[] = [
  {
    id: 1,
    title: 'Alpine Sunset Glow',
    caption:
      'Golden hour casting dramatic shadows across the snow-capped Swiss peaks.',
    imageUrl:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop',
    tags: ['Nature', 'Mountains', 'Travel'],
    location: 'Zermatt, Switzerland',
    date: '2024-08-14',
  },
  {
    id: 2,
    title: 'Tokyo Neon Nights',
    caption:
      'Electric rain reflections through the vibrant alleys of Shinjuku.',
    imageUrl:
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop',
    tags: ['Urban', 'Travel', 'Architecture'],
    location: 'Tokyo, Japan',
    date: '2024-05-22',
  },
  {
    id: 3,
    title: 'Golden Gate in Morning Fog',
    caption:
      'Karl the Fog rolling beneath the iconic international orange spans.',
    imageUrl:
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&auto=format&fit=crop',
    tags: ['Architecture', 'Urban', 'Travel'],
    location: 'San Francisco, USA',
    date: '2024-06-10',
  },
  {
    id: 4,
    title: 'Family Beach Picnic',
    caption:
      'Laughter, salty breeze, and warm sand at sunset with the whole family.',
    imageUrl:
      'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&auto=format&fit=crop',
    tags: ['Family', 'Travel', 'Ocean'],
    location: 'Maui, Hawaii',
    date: '2024-07-04',
  },
  {
    id: 5,
    title: 'Milky Way over the Caldera',
    caption:
      'Crystalline desert night sky revealing the dense galactic center.',
    imageUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop',
    tags: ['Nature', 'Travel'],
    location: 'Atacama Desert, Chile',
    date: '2023-11-18',
  },
  {
    id: 6,
    title: 'Arashiyama Bamboo Sanctuary',
    caption: 'Tall green stalks swaying with wind chimes in ancient Sagano.',
    imageUrl:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop',
    tags: ['Nature', 'Travel'],
    location: 'Kyoto, Japan',
    date: '2024-04-12',
  },
  {
    id: 7,
    title: 'Santorini Caldera Terraces',
    caption:
      'Sun-drenched whitewashed villas perched high above the azure Aegean.',
    imageUrl:
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop',
    tags: ['Architecture', 'Travel', 'Ocean'],
    location: 'Santorini, Greece',
    date: '2023-09-05',
  },
  {
    id: 8,
    title: 'Family Winter Cabin Fireside',
    caption: 'Cozy wool blankets and hot chocolate after a powder day.',
    imageUrl:
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop',
    tags: ['Family', 'Mountains'],
    location: 'Aspen, Colorado',
    date: '2023-12-24',
  },
  {
    id: 9,
    title: 'Moraine Lake Glacial Turquoise',
    caption: 'Pristine mountain mirror framed by the Valley of the Ten Peaks.',
    imageUrl:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop',
    tags: ['Nature', 'Mountains'],
    location: 'Banff National Park, Canada',
    date: '2024-08-02',
  },
  {
    id: 10,
    title: 'Parisian Autumn Boulevard',
    caption:
      'Golden leaves carpeting the Haussmann avenues under soft overcast light.',
    imageUrl:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop',
    tags: ['Travel', 'Urban', 'Architecture'],
    location: 'Paris, France',
    date: '2023-10-15',
  },
  {
    id: 11,
    title: 'Aurora Borealis Curtain',
    caption: 'Emerald waves of light dancing across the Arctic fjord sky.',
    imageUrl:
      'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&auto=format&fit=crop',
    tags: ['Nature', 'Travel'],
    location: 'Tromsø, Norway',
    date: '2024-01-20',
  },
  {
    id: 12,
    title: 'Venetian Grand Canal Mist',
    caption: 'Gondolas moored by historic palazzos in early twilight silence.',
    imageUrl:
      'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=800&auto=format&fit=crop',
    tags: ['Travel', 'Architecture', 'Ocean'],
    location: 'Venice, Italy',
    date: '2024-03-30',
  },
  {
    id: 13,
    title: 'Sahara Sand Dunes at Dusk',
    caption: 'Endless wind-sculpted ridges stretching into the desert horizon.',
    imageUrl:
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop',
    tags: ['Nature', 'Travel'],
    location: 'Merzouga, Morocco',
    date: '2023-11-04',
  },
  {
    id: 14,
    title: 'Family Summer Hike in Redwoods',
    caption:
      'Walking together among giants hundreds of feet above the coastal fog.',
    imageUrl:
      'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&auto=format&fit=crop',
    tags: ['Family', 'Nature'],
    location: 'Muir Woods, California',
    date: '2024-06-28',
  },
  {
    id: 15,
    title: 'Seoul Cyberpunk Skyline',
    caption:
      'Dizzying layers of highway overpasses and glass towers under rain.',
    imageUrl:
      'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800&auto=format&fit=crop',
    tags: ['Urban', 'Architecture'],
    location: 'Seoul, South Korea',
    date: '2024-09-08',
  },
  {
    id: 16,
    title: 'Amalfi Coast Cliffside Village',
    caption:
      'Pastel houses clinging to rugged limestone cliffs above the Tyrrhenian Sea.',
    imageUrl:
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&auto=format&fit=crop',
    tags: ['Travel', 'Ocean', 'Architecture'],
    location: 'Positano, Italy',
    date: '2024-07-19',
  },
  {
    id: 17,
    title: 'Autumn Mist in the Black Forest',
    caption:
      'Golden beech trees rising through morning fog along quiet hiking trails.',
    imageUrl:
      'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop',
    tags: ['Nature', 'Mountains'],
    location: 'Baden-Württemberg, Germany',
    date: '2023-10-29',
  },
  {
    id: 18,
    title: 'Sunset Sail in the Bay',
    caption:
      'Unfurling the canvas as the sun dips beneath the Pacific horizon.',
    imageUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop',
    tags: ['Family', 'Ocean', 'Travel'],
    location: 'Monterey, California',
    date: '2024-08-25',
  },
]

export const AVAILABLE_TAG_OPTIONS = [
  'Travel',
  'Nature',
  'Family',
  'Architecture',
  'Urban',
  'Mountains',
  'Ocean',
]

/** Load this browser's gallery, excluding the old built-in demo records. */
export const loadStoredPhotos = (): PhotoNode[] => {
  try {
    const raw = localStorage.getItem(PHOTO_GALAXY_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as PhotoNode[]
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (photo): photo is PhotoNode =>
            typeof photo?.id === 'number' &&
            typeof photo?.title === 'string' &&
            typeof photo?.imageUrl === 'string' &&
            !photo.imageUrl.startsWith('blob:') &&
            Array.isArray(photo?.tags) &&
            typeof photo?.date === 'string' &&
            !SEED_PHOTOS.some(
              (seed) =>
                seed.title === photo.title && seed.imageUrl === photo.imageUrl,
            ),
        )
      }
    }
  } catch (err) {
    console.warn('Could not read stored photos from localStorage:', err)
  }
  return []
}

/**
 * Persists photos into localStorage.
 */
export const persistPhotos = (photos: PhotoNode[]): void => {
  try {
    localStorage.setItem(PHOTO_GALAXY_STORAGE_KEY, JSON.stringify(photos))
  } catch (err) {
    console.warn('Could not write photos to localStorage:', err)
    throw new Error(
      'Your browser storage is full. Remove a photo or use a smaller image, then try again.',
    )
  }
}

export const loadFavoritePhotoIds = (): number[] => {
  try {
    const value = JSON.parse(
      localStorage.getItem(PHOTO_GALAXY_FAVORITES_KEY) || '[]',
    )
    return Array.isArray(value)
      ? value.filter((id): id is number => Number.isInteger(id))
      : []
  } catch {
    return []
  }
}

export const persistFavoritePhotoIds = (ids: number[]): void => {
  localStorage.setItem(PHOTO_GALAXY_FAVORITES_KEY, JSON.stringify(ids))
}

/**
 * Clusters photos based on shared tags or date ranges.
 * Groups photos by primary tag and secondary date, sorting them so that
 * related photos are contiguous in the lattice spiral.
 */
export const clusterPhotosByTagOrDate = (
  photos: PhotoNode[],
  clusterBy: 'tag' | 'date' = 'tag',
): PhotoNode[] => {
  const cloned = [...photos]

  if (clusterBy === 'date') {
    // Cluster by chronological date ranges (Year - Month)
    return cloned.sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateB - dateA
    })
  }

  // Cluster by primary shared tags
  const tagGroups: Record<string, PhotoNode[]> = {}
  for (const photo of cloned) {
    const primaryTag = photo.tags[0] || 'Uncategorized'
    if (!tagGroups[primaryTag]) {
      tagGroups[primaryTag] = []
    }
    tagGroups[primaryTag].push(photo)
  }

  // Sort within each tag cluster by date
  const clustered: PhotoNode[] = []
  const sortedTags = Object.keys(tagGroups).sort()
  for (const tag of sortedTags) {
    tagGroups[tag].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
    clustered.push(...tagGroups[tag])
  }

  return clustered
}

/**
 * Prepares an offscreen canvas with an aspect-cover image for WebGL 2D Array Texture upload.
 */
export const createPhotoCanvas = (
  img: HTMLImageElement | ImageBitmap,
  targetWidth: number,
  targetHeight: number,
): HTMLCanvasElement => {
  const canvas = document.createElement('canvas')
  canvas.width = targetWidth
  canvas.height = targetHeight
  const ctx = canvas.getContext('2d')

  if (!ctx) return canvas

  const imgW = (img as HTMLImageElement).naturalWidth || img.width
  const imgH = (img as HTMLImageElement).naturalHeight || img.height

  // Aspect-cover crop calculation
  const targetAspect = targetWidth / targetHeight
  const imgAspect = imgW / imgH

  let renderW = targetWidth
  let renderH = targetHeight
  let offsetX = 0
  let offsetY = 0

  if (imgAspect > targetAspect) {
    // Image is wider than target
    renderW = targetHeight * imgAspect
    offsetX = (targetWidth - renderW) / 2
  } else {
    // Image is taller than target
    renderH = targetWidth / imgAspect
    offsetY = (targetHeight - renderH) / 2
  }

  if (ctx.fillRect) {
    ctx.fillStyle = '#111116'
    ctx.fillRect(0, 0, targetWidth, targetHeight)
  }
  if (ctx.drawImage) {
    ctx.drawImage(img, offsetX, offsetY, renderW, renderH)
  }

  return canvas
}

/**
 * Loads an image from URL or Object URL safely into an HTMLImageElement.
 */
export const loadImageElement = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load image at ${src}`))
    img.src = src
  })
}

/** Compresses an uploaded image for durable, space-efficient local storage. */
export const preparePhotoForStorage = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(objectUrl)
      const maxDimension = 1800
      const scale = Math.min(
        1,
        maxDimension / Math.max(image.width, image.height),
      )
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(image.width * scale))
      canvas.height = Math.max(1, Math.round(image.height * scale))
      const context = canvas.getContext('2d')
      if (!context) {
        reject(new Error('Could not prepare this image for storage.'))
        return
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', 0.82))
    }
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('This image could not be opened.'))
    }
    image.src = objectUrl
  })
