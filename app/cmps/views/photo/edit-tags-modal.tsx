import { useShallowState } from '@/store'
import { AVAILABLE_TAG_OPTIONS } from '@/vf/utils/photos'
import { Plus, Tag, X } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog'
import { Input } from '../../ui/input'

export const EditTagsModal = () => {
  const { open, setOpen, activePhoto, updatePhotoTags } = useShallowState(
    (state) => ({
      open: state.editTagsModalOpen,
      setOpen: state.setEditTagsModalOpen,
      activePhoto: state.activePhoto,
      updatePhotoTags: state.updatePhotoTags,
    }),
  )

  const [currentTags, setCurrentTags] = useState<string[]>(
    activePhoto?.tags ?? [],
  )
  const [newTagInput, setNewTagInput] = useState('')

  // Sync state when modal opens
  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen && activePhoto) {
      setCurrentTags([...activePhoto.tags])
      setNewTagInput('')
    }
    setOpen(nextOpen)
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setCurrentTags(currentTags.filter((t) => t !== tagToRemove))
  }

  const handleAddTag = (tagToAdd: string) => {
    const trimmed = tagToAdd.trim()
    if (!trimmed) return
    if (!currentTags.includes(trimmed)) {
      setCurrentTags([...currentTags, trimmed])
    }
    setNewTagInput('')
  }

  const handleSave = () => {
    if (activePhoto) {
      updatePhotoTags(activePhoto.id, currentTags)
    }
    setOpen(false)
  }

  if (!activePhoto) return null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='border-border/80 bg-background/95 backdrop-blur-xl sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 font-bold text-xl'>
            <Tag className='size-5 text-indigo-400' />
            Edit Photo Tags
          </DialogTitle>
          <DialogDescription className='text-muted-foreground text-sm'>
            Update the clustering tags for &ldquo;{activePhoto.title}&rdquo; to
            group it with related galaxy nodes.
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col gap-4 py-3'>
          {/* Active Tags */}
          <div className='flex flex-col gap-2'>
            <span className='font-semibold text-muted-foreground text-xs uppercase tracking-wider'>
              Current Tags ({currentTags.length})
            </span>
            <div className='flex min-h-10 flex-wrap gap-2 rounded-lg border border-border/60 bg-muted/20 p-2'>
              {currentTags.length === 0 ? (
                <span className='px-2 py-1 text-muted-foreground/60 text-xs italic'>
                  No tags assigned yet.
                </span>
              ) : (
                currentTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant='secondary'
                    className='flex items-center gap-1.5 border border-indigo-500/30 bg-indigo-500/15 px-3 py-1 text-indigo-200 text-xs'
                  >
                    {tag}
                    <button
                      type='button'
                      onClick={() => handleRemoveTag(tag)}
                      className='cursor-pointer rounded-full p-0.5 transition-colors hover:bg-indigo-500/30'
                    >
                      <X className='size-3' />
                    </button>
                  </Badge>
                ))
              )}
            </div>
          </div>

          {/* Add Custom Tag */}
          <div className='flex gap-2'>
            <Input
              placeholder='Enter custom tag...'
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddTag(newTagInput)
                }
              }}
              className='h-9 text-sm'
            />
            <Button
              type='button'
              size='sm'
              variant='outline'
              onClick={() => handleAddTag(newTagInput)}
              disabled={!newTagInput.trim()}
              className='cursor-pointer'
            >
              <Plus className='mr-1 size-4' />
              Add
            </Button>
          </div>

          {/* Suggested Quick Tags */}
          <div className='flex flex-col gap-1.5'>
            <span className='text-muted-foreground text-xs'>
              Quick Suggestions:
            </span>
            <div className='flex flex-wrap gap-1.5'>
              {AVAILABLE_TAG_OPTIONS.filter(
                (t) => !currentTags.includes(t),
              ).map((suggestedTag) => (
                <button
                  key={suggestedTag}
                  type='button'
                  onClick={() => handleAddTag(suggestedTag)}
                  className='cursor-pointer rounded-md border border-border/60 px-2.5 py-1 text-muted-foreground text-xs transition-all hover:border-indigo-400/60 hover:bg-indigo-500/10 hover:text-foreground'
                >
                  + {suggestedTag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className='gap-2 sm:gap-0'>
          <Button
            type='button'
            variant='ghost'
            onClick={() => setOpen(false)}
            className='cursor-pointer'
          >
            Cancel
          </Button>
          <Button
            type='button'
            onClick={handleSave}
            className='cursor-pointer bg-indigo-600 font-medium text-white hover:bg-indigo-500'
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
