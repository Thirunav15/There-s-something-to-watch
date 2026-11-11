import { useShallowState } from '@/store'
import { VOROFORCE_MODE } from '@/vf/consts'
import type { PhotoNode } from '@/vf/utils/photos'
import { Calendar, Heart, MapPin, Search, X } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { Badge } from '../../ui/badge'
import { Input } from '../../ui/input'

export const PhotoSearchFilter = () => {
  const {
    photos,
    searchQuery,
    setSearchQuery,
    activeFilterTag,
    setActiveFilterTag,
    setActivePhoto,
    setFavoritesOpen,
    favoriteCount,
    voroforce,
    setMode,
  } = useShallowState((state) => ({
    photos: state.photos,
    searchQuery: state.searchQuery,
    setSearchQuery: state.setSearchQuery,
    activeFilterTag: state.activeFilterTag,
    setActiveFilterTag: state.setActiveFilterTag,
    setActivePhoto: state.setActivePhoto,
    setFavoritesOpen: state.setFavoritesOpen,
    favoriteCount: state.favoritePhotoIds.length,
    voroforce: state.voroforce,
    setMode: state.setMode,
  }))

  const [searchOpen, setSearchOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const tagOptions = useMemo(
    () => Array.from(new Set(photos.flatMap((photo) => photo.tags))).sort(),
    [photos],
  )

  // Filtered photos based on search query and active filter tag
  const filteredPhotos = useMemo(() => {
    let result = photos

    if (activeFilterTag && activeFilterTag !== 'All') {
      result = result.filter((p) =>
        p.tags?.some((t) => t.toLowerCase() === activeFilterTag.toLowerCase()),
      )
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.location?.toLowerCase().includes(q) ||
          p.caption?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q)),
      )
    }

    return result
  }, [photos, searchQuery, activeFilterTag])

  const handleSelectPhoto = (photo: PhotoNode) => {
    setActivePhoto(photo)
    setSearchOpen(false)

    // Trigger smooth-glide animation in Voroforce
    if (voroforce?.controls) {
      // Find the cell index corresponding to this photo
      const cellIndex =
        photo.cellId !== undefined
          ? photo.cellId
          : photos.findIndex((p) => p.id === photo.id)

      if (cellIndex >= 0) {
        voroforce.controls.navigateToCell(cellIndex)
      }

      setMode(VOROFORCE_MODE.select)
    }
  }

  const handleTagClick = (tag: string) => {
    const nextTag = activeFilterTag === tag ? undefined : tag
    setActiveFilterTag(nextTag)

    // When selecting a cluster tag, glide camera to the first photo of that cluster
    if (nextTag && nextTag !== 'All') {
      const match = photos.find((p) =>
        p.tags?.some((t) => t.toLowerCase() === nextTag.toLowerCase()),
      )
      if (match && voroforce?.controls) {
        const cellIndex =
          match.cellId !== undefined
            ? match.cellId
            : photos.findIndex((p) => p.id === match.id)
        if (cellIndex >= 0) {
          voroforce.controls.navigateToCell(cellIndex)
        }
      }
    }
  }

  return (
    <div
      ref={containerRef}
      style={{ display: photos.length === 0 ? 'none' : undefined }}
      className={`font-gallery pointer-events-none fixed top-4 right-4 z-40 flex flex-col items-end gap-3 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:top-6 sm:right-6 ${searchOpen ? 'w-[calc(100vw-2rem)] max-w-sm md:w-96' : 'w-12'}`}
    >
      {!searchOpen ? (
        <button
          type='button'
          aria-label='Open photo search'
          aria-expanded='false'
          onClick={() => {
            setSearchOpen(true)
          }}
          className='pointer-events-auto flex size-12 items-center justify-center rounded-full border border-white/10 bg-[#181818]/90 text-foreground shadow-lg backdrop-blur-xl transition-colors duration-300 hover:border-white/25 hover:bg-[#272727] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70'
        >
          <Search className='size-5' />
        </button>
      ) : (
        <>
          {/* Search Input Box */}
          <div className='pointer-events-auto flex w-full items-center rounded-2xl border border-white/10 bg-[#181818]/95 shadow-xl backdrop-blur-xl transition-colors duration-300 focus-within:border-white/30 focus-within:ring-2 focus-within:ring-white/10'>
            <Search className='ml-4 size-4 shrink-0 text-muted-foreground' />
            <Input
              autoFocus
              type='text'
              placeholder='Search photos by title, tag, or location...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='h-12 min-w-0 border-0 bg-transparent px-3 text-sm placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:ring-offset-0'
            />
            {favoriteCount > 0 && (
              <button
                type='button'
                title='Favorite photos'
                aria-label={`Open ${favoriteCount} favorite photos`}
                onClick={() => setFavoritesOpen(true)}
                className='shrink-0 cursor-pointer rounded-full p-2 text-rose-400 transition-colors hover:text-rose-300'
              >
                <Heart className='size-4 fill-current' />
              </button>
            )}
            {searchQuery && (
              <button
                type='button'
                aria-label='Clear search'
                onClick={() => setSearchQuery('')}
                className='shrink-0 cursor-pointer rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground'
              >
                <X className='size-3.5' />
              </button>
            )}
            <button
              type='button'
              aria-label='Close photo search'
              aria-expanded='true'
              onClick={() => {
                setSearchOpen(false)
              }}
              className='mr-1 shrink-0 cursor-pointer rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground'
            >
              <X className='size-4' />
            </button>
          </div>

          {/* Filter Tag Pills */}
          <div className='no-scrollbar pointer-events-auto flex w-full items-center gap-2 overflow-x-auto px-0.5 py-1'>
        <button
          type='button'
          onClick={() => handleTagClick('All')}
          className={`cursor-pointer whitespace-nowrap rounded-full border px-3 py-1 font-medium text-xs transition-all ${
            !activeFilterTag || activeFilterTag === 'All'
              ? 'border-white bg-white text-black shadow-sm'
              : 'border-white/10 bg-[#181818]/85 text-muted-foreground backdrop-blur-md hover:border-white/25 hover:text-foreground'
          }`}
        >
          All ({photos.length})
        </button>
        {tagOptions.map((tag) => {
          const isSelected = activeFilterTag === tag
          const count = photos.filter((p) =>
            p.tags?.some((t) => t.toLowerCase() === tag.toLowerCase()),
          ).length
          if (count === 0) return null
          return (
            <button
              key={tag}
              type='button'
              onClick={() => handleTagClick(tag)}
              className={`cursor-pointer whitespace-nowrap rounded-full border px-3 py-1 font-medium text-xs transition-all ${
                isSelected
                  ? 'border-white bg-white text-black shadow-sm'
                  : 'border-white/10 bg-[#181818]/85 text-muted-foreground backdrop-blur-md hover:border-white/25 hover:text-foreground'
              }`}
            >
              {tag} ({count})
            </button>
          )
        })}
          </div>
        </>
      )}

      {/* Live Search Results Dropdown */}
      {searchOpen && searchQuery.trim().length > 0 && (
        <div className='pointer-events-auto flex max-h-72 flex-col gap-1 overflow-y-auto rounded-2xl border border-white/10 bg-[#181818]/95 p-2 shadow-xl backdrop-blur-2xl'>
          <div className='flex items-center justify-between px-2.5 py-1 font-semibold text-[11px] text-muted-foreground uppercase tracking-wider'>
            <span>
              {filteredPhotos.length}{' '}
              {filteredPhotos.length === 1 ? 'photo found' : 'photos found'}
            </span>
            {searchQuery && (
              <button
                type='button'
                aria-label='Clear search'
                onClick={() => setSearchQuery('')}
                className='cursor-pointer text-[10px] lowercase hover:underline'
              >
                clear
              </button>
            )}
          </div>

          {filteredPhotos.length === 0 ? (
            <div className='px-4 py-6 text-center text-muted-foreground text-sm'>
              No photos found matching &ldquo;{searchQuery}&rdquo;
            </div>
          ) : (
            filteredPhotos.map((photo) => (
              <button
                key={photo.id}
                type='button'
                onClick={() => handleSelectPhoto(photo)}
                className='group flex cursor-pointer items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-white/10'
              >
                <div className='relative size-11 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/40'>
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-110'
                  />
                </div>
                <div className='flex min-w-0 flex-1 flex-col'>
                  <span className='truncate font-semibold text-foreground text-sm transition-colors group-hover:text-indigo-300'>
                    {photo.title}
                  </span>
                  <div className='flex items-center gap-2 truncate text-muted-foreground text-xs'>
                    {photo.location && (
                      <span className='flex items-center gap-1 truncate'>
                        <MapPin className='size-3 shrink-0 text-rose-400' />
                        {photo.location}
                      </span>
                    )}
                    {photo.date && (
                      <span className='flex shrink-0 items-center gap-1'>
                        <Calendar className='size-3 shrink-0 text-indigo-400' />
                        {photo.date}
                      </span>
                    )}
                  </div>
                  <div className='mt-1 flex gap-1 overflow-hidden'>
                    {photo.tags?.slice(0, 2).map((tag) => (
                      <Badge
                        key={tag}
                        variant='secondary'
                        className='border border-white/10 bg-white/5 px-1.5 py-0 font-normal text-[10px] leading-tight'
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
