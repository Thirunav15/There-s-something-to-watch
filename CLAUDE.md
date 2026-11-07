# Repository guidance

Photo Galaxy is a client-side personal photo gallery. Preserve the dark, minimal visual language and make product changes around photo memories, metadata, tags, locations, and private browser storage.

## Commands

- `npm run dev` — Start Vite on port 3000.
- `npm run build` — Type-check and create the production bundle.
- `npm run preview` — Serve the production bundle locally.
- `npm run lint` / `npm run check` — Run Biome checks.
- `npm run test:unit` / `npm run test:e2e` — Run unit or Playwright coverage.

## Architecture

- `app/main.tsx` and `app/app.tsx` bootstrap the React interface and the visualization.
- `app/store/` holds UI, Voroforce, and photo collection state. Photo persistence and favorites live in `app/store/photo-data-slice.ts`.
- `app/cmps/` contains gallery controls, upload/edit flows, photo details, settings, and dialogs.
- `app/vf/` adapts the React app and photo records to the Voroforce renderer.
- `app/vf/utils/photos.ts` defines `PhotoNode`, sample content, local storage, upload preparation, and image canvas utilities.
- `voroforce/` is the WebGL renderer and force simulation. Keep product-specific photo state in `app/`, not in this reusable engine.
- `public/` contains static assets and deployment metadata.

## Data flow

1. The photo data slice loads the visitor's collection from browser storage, or starts with the sample gallery.
2. Search and tag controls select which photos are visible and focused.
3. The Voroforce integration maps cells to gallery photos and loads their image textures into WebGL.
4. The photo detail drawer reads the selected photo from the store. Add, edit, favorite, and delete actions persist to this browser only.

## Change guidance

- Keep photo records typed through storage, store, UI, and texture loading.
- Do not add a remote photo service or send gallery contents off-device without an explicit product requirement.
- Keep page title, description, sitemap, README, and visible product copy aligned with Photo Galaxy.
- Retain existing third-party source and shader attribution when editing engine code.
