# Photo Galaxy product checklist

This list tracks work that directly supports the photo gallery. Mark an item complete when it is implemented and verified.

## Gallery experience

- [ ] Add an export and import flow for a photo collection backup.
- [ ] Add keyboard navigation between focused photos and expose all canvas actions to assistive technology.
- [ ] Add clear image-loading and broken-image states in the galaxy and detail view.
- [ ] Offer date-based clustering alongside tag-based clustering.
- [ ] Add optional photo detail routes so a selected memory can be shared directly.

## Reliability and performance

- [x] Persist uploaded photos and favorites in browser storage.
- [x] Resize uploaded images before storing them and report storage quota errors.
- [x] Populate the WebGL photo texture field with the active gallery images.
- [ ] Add a storage migration path when the local photo schema changes.
- [ ] Profile large galleries on lower-memory mobile devices and tune texture limits.
- [ ] Add graceful fallback guidance when WebGL 2 is unavailable.
- [ ] Dispose WebGL textures, buffers, and event listeners when the app unmounts.

## Project upkeep

- [ ] Add a continuous integration workflow for formatting, type checking, builds, and browser coverage.
- [ ] Audit image, font, and shader credits before public distribution.
- [ ] Keep metadata, sitemap, and product docs aligned with the deployed gallery URL.
