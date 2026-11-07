import { describe, expect, it } from 'vitest'
import {
  type PhotoNode,
  SEED_PHOTOS,
  clusterPhotosByTagOrDate,
  createPhotoCanvas,
} from './photos'

describe('Photo Galaxy Utils', () => {
  it('has valid seed photos with required PhotoNode fields', () => {
    expect(SEED_PHOTOS.length).toBeGreaterThan(0)
    for (const photo of SEED_PHOTOS) {
      expect(photo.id).toBeDefined()
      expect(photo.title).toBeTruthy()
      expect(photo.imageUrl).toBeTruthy()
      expect(Array.isArray(photo.tags)).toBe(true)
      expect(photo.tags.length).toBeGreaterThan(0)
      expect(photo.date).toBeTruthy()
    }
  })

  it('clusters photo nodes by shared tag', () => {
    const testPhotos: PhotoNode[] = [
      {
        id: 1,
        title: 'B',
        imageUrl: 'url1',
        tags: ['Travel'],
        date: '2024-01-01',
      },
      {
        id: 2,
        title: 'A',
        imageUrl: 'url2',
        tags: ['Family'],
        date: '2024-02-01',
      },
      {
        id: 3,
        title: 'C',
        imageUrl: 'url3',
        tags: ['Travel'],
        date: '2024-03-01',
      },
    ]

    const clustered = clusterPhotosByTagOrDate(testPhotos, 'tag')
    expect(clustered.length).toBe(3)
    // Travel tags should be grouped together and Family grouped together
    const travelIndices = clustered
      .map((p, idx) => (p.tags.includes('Travel') ? idx : -1))
      .filter((idx) => idx !== -1)
    expect(Math.abs(travelIndices[0] - travelIndices[1])).toBe(1)
  })

  it('clusters photo nodes chronologically by date', () => {
    const testPhotos: PhotoNode[] = [
      {
        id: 1,
        title: 'Old',
        imageUrl: 'url1',
        tags: ['Travel'],
        date: '2022-01-01',
      },
      {
        id: 2,
        title: 'Newest',
        imageUrl: 'url2',
        tags: ['Family'],
        date: '2024-06-01',
      },
      {
        id: 3,
        title: 'Mid',
        imageUrl: 'url3',
        tags: ['Nature'],
        date: '2023-05-01',
      },
    ]

    const clustered = clusterPhotosByTagOrDate(testPhotos, 'date')
    expect(clustered[0].title).toBe('Newest')
    expect(clustered[1].title).toBe('Mid')
    expect(clustered[2].title).toBe('Old')
  })

  it('creates an aspect-cover canvas from an image', () => {
    const mockImage = {
      width: 800,
      height: 600,
      naturalWidth: 800,
      naturalHeight: 600,
    } as unknown as HTMLImageElement

    const canvas = createPhotoCanvas(mockImage, 240, 320)
    expect(canvas).toBeDefined()
    expect(canvas.width).toBe(240)
    expect(canvas.height).toBe(320)
  })
})

