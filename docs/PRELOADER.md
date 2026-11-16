# Lightweight battlefield preloader

The loading screen reuses the forest battlefield and the rifle soldier's four run poses. A small JPEG background and transparent PNG sprite strip total 59,959 bytes (about 60 KB). The shared transparent game logo adds 253,100 bytes and is reused by the main menu. No animation library, video or additional full-resolution game texture is needed.

The soldier faces right and runs along the amber loading bar. Bar position and percentage follow completed game assets; they do not use a fake timer or minimum delay. Loading stops at 100% and immediately opens the menu once initialization completes. Failed loading stops the runner and exposes Try again. Retry resets progress, and stale callbacks from an aborted attempt cannot affect the new one. Reduced-motion preferences disable animation.

Assets:

- `remaster/assets/preloader/forest-loading.jpg`: 640 × 360, JPEG quality 72, 41,367 bytes.
- `remaster/assets/preloader/soldier-run.png`: 256 × 64, four equal transparent 64 × 64 cells, 18,592 bytes.

Regenerate with `scripts/create-preloader-assets.ps1` using existing project artwork. CSS applies the dark background treatment. `remaster/src/preloader.js` controls progress, failure, retry and completion. Browser QA includes a held 57% preview with the live run animation.
