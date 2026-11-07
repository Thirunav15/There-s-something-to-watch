import { About } from './about'
import { Favorites } from './favorites'
import { EmptyGalleryState, PhotoDetailDrawer, PhotoPreview } from './photo'
import { HotkeysView } from './hotkeys'
import { LowFpsAlert } from './low-fps-alert'
import {
  AddPhotoModal,
  EditTagsModal,
  PhotoFloatingActionOverlay,
  PhotoSearchFilter,
} from './photo'
import { Settings } from './settings'

const PrimaryViews = () => (
  <>
    <PhotoSearchFilter />
    <EmptyGalleryState />
    <PhotoFloatingActionOverlay />
    <AddPhotoModal />
    <EditTagsModal />
    <Settings />
    <About />
    <Favorites />
    <PhotoPreview />
    <PhotoDetailDrawer />
    <LowFpsAlert />
    <HotkeysView />
  </>
)

export default PrimaryViews
