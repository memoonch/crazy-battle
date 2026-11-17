# Website build — v1.0

Upload everything inside `web-build` together. Launch `index.html` through an HTTP/HTTPS website, not by double-clicking it. No Node server, build tools, external CDN, or Flash player is required on the website.

```
index.html
logo.png
banner.png        # 197 × 150 website thumbnail
game/
  game.js        # bundled, minified game
  game.css       # minified styles
  data/          # game balance and design tokens
  assets/        # runtime artwork, audio, preloader and audio attribution
```

The ZIP contains these items directly, without an extra enclosing folder. Keep the `game` directory structure intact. Relative URLs support deployment at the domain root or in a subdirectory. Serve `.js` as JavaScript, `.json` as JSON, `.webp` as image/webp, and `.ogg` as audio/ogg using the host's normal static-file configuration. If embedding in an iframe, allow fullscreen and use a 960 × 540 frame or another landscape size. The game fills the available viewport and supports the F fullscreen shortcut.

## Rebuild

Install the locked development dependencies with pnpm, then run `node scripts/build-web.cjs` (or `npm run build`). The script replaces only the generated `web-build` folder. Build tools are not included in the upload.

The build includes only referenced runtime assets and the two marketing images. Sprite artwork uses lossless WebP, with every visible pixel and alpha value checked against the PNG originals. Atlas dimensions, hit masks, gameplay data, and original audio are preserved. The favicon is reduced to 256 × 256. Code and CSS are minified; preview navigation, diagnostics, test fixtures, original SWF files, asset source variants and development tools are excluded. The Settings audio-credit link remains in the upload.

## Validation

147 automated tests pass. The generated bundle was checked in an isolated Chrome browser from `/games/helicopter-last-stand/`: menu, story, start, tutorial dismissal, firing/reload input, pause/resume, resizing and fullscreen entry/exit. All runtime requests succeeded without browser warnings or errors; both new Ogg result cues decoded successfully. Menu and gameplay screenshots are saved alongside this document. The development browser's campaign save was not used.

The build stays at v1.0. Generating this package does not declare the game launched.
