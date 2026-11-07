# Photo Galaxy indexing

Photo Galaxy is a client-rendered, single-page photo gallery. The public entry page and its product metadata are indexable; browser-local photos and settings are private to each visitor and are never published as crawlable content.

## Current behavior

- `index.html` contains the page title, description, canonical URL, and social preview metadata.
- `public/robots.txt` and `public/sitemap.xml` describe the public app entry point.
- `scripts/generate-sitemap.js` regenerates the one-page sitemap. Set `SITE_URL` to the canonical deployment origin before running it.
- Photo titles, captions, locations, tags, and uploaded images remain in local browser storage. They are not server data and cannot appear in a shared sitemap.

## Before deployment

1. Replace the canonical and social URLs in `index.html` with the deployment URL and a real preview image.
2. Set `SITE_URL` and regenerate `public/sitemap.xml`.
3. Confirm that `robots.txt`, `sitemap.xml`, and the preview image are served from the site root.
4. Check the rendered page metadata after deployment. The WebGL canvas itself is client-rendered and requires JavaScript and WebGL 2.

Do not add personal gallery contents to server-side structured data or public indexing unless the product gains an explicit sharing feature with user consent.
