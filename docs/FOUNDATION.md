# Remaster foundation — step 3

Completed 11 November 2026. Open [the modern preview](http://127.0.0.1:8765/remaster/) while `node server.cjs` is running. The [cleaned Flash comparison](http://127.0.0.1:8765/web/index.html) remains available and unchanged.

## Scope and visible behavior

This is a native browser foundation, independent of Flash/Ruffle. There are no build dependencies, external CDNs, remote APIs, or account services. It uses ES modules, Canvas 2D for temporary scenery, and HTML/CSS for UI. No combat, purchases, wave advancement, final game artwork, or soundtrack is implemented in this stage.

Implemented scenes:

- Loading/error/retry: loads the step-1 balance JSON and step-2 design tokens; failed requests offer a user-triggered retry.
- Main menu: New Campaign, Continue if a checkpoint exists, and Settings.
- New-campaign confirmation: protects an existing modern checkpoint from accidental replacement; one previous campaign is retained in the same save record.
- Preparation: initializes the original starting values, shows five positions, base health, score, money, selected weapon/ammo, stock counts and the first wave's enemy count. Start Wave, repairs, inventory and stock actions are deliberately disabled until their implementation stages.
- Settings: master/music/effects gains, reduced motion, Off/Low shake preference, test-effects tone, Apply/Cancel/Defaults.

The page outside the viewport identifies this as a foundation preview and exposes collapsed input/save diagnostics. Placeholder information is kept outside the eventual player-facing flow.

## Rendering and screen policy

The design plane is **960×540**. Canvas resolution tracks display size and device pixel ratio (capped at 2). Scenery and sprites use one uniform scale, preserving proportions. Normal presentation scales down on narrower panels and caps at 960×540.

For fullscreen or other aspect ratios, background scenery fills the whole display. The original logical design plane remains centered with a uniform scale. Decorative extensions do not count as active battlefield space, so a wider monitor cannot automatically increase range or alter spawn pressure. The HTML HUD anchors to display edges and scales uniformly. No black letterbox region is rendered.

Fullscreen uses the browser's native Fullscreen API when available. If an embedded host denies the request, the preview fills the entire available browser viewport instead. F toggles the mode; Escape exits the expanded fallback. Native Escape behavior is left to the browser. This fallback does not change browser permissions or settings.

**Observed limit:** this run's in-app browser rejected native fullscreen with “not granted.” The full-window fallback was verified at 1280×720, with no borders and an unchanged 960×540 logical plane. Physical-monitor native fullscreen was not verified for the new foundation in this run. The original Flash player had a prior successful native fullscreen check.

For the next stage, combat should use explicit logical coordinates and map them through the renderer. Do not use global screen pixels, CSS widths, or scenery extensions as simulation geometry.

## Input policy

Pointer coordinates subtract canvas position and scenic offsets, then divide by the uniform scale. Diagnostic values are in logical design coordinates. The temporary battlefield input region is x=145…960, y=145…455; step 4 must deliberately map the original combat geometry/ranges into this plane.

The pointer controller captures the active pointer, clears pressed state on release/cancel/lost capture, and clears it on blur/hidden page and scene changes. UI buttons have independent DOM input and focus. Modal settings/confirmation scenes trap keyboard focus; Escape backs out when it is not exiting fullscreen. F is ignored while editing an input/select.

In this stage aiming only displays a reticle. It does not shoot or award rewards.

## Save schema and isolation

The modern store uses localStorage key **`crazy-battle.remaster.v1`**. It never reads or writes Flash's SharedObject/Ruffle storage and never claims to import Flash progress.

The record includes version, revision, timestamp, current campaign, previous campaign backup and settings. A campaign checkpoint includes wave, base HP, score, money, owned/selected weapon, three consumable counts, achievement IDs and checkpoint type. Current stage initialization is wave 1 / 800 HP / 0 score / 0 money / Cannon / no stock.

Campaign and settings commits write one JSON record. Settings commits preserve campaign state; new campaign preserves the previous checkpoint. Returned checkpoint values are copies. Validation rejects negative/invalid economy values and inconsistent weapon ownership before persisting.

Malformed or unsupported-version data is preserved in place. If storage is unavailable, the preview remains usable with session-only state and reports that actual condition in its status. It does not silently overwrite an unreadable save. Future combat/save-model changes need an explicit version/migration policy; do not extend this schema casually if existing checkpoints would become invalid.

Only initialization and an explicit preparation checkpoint save exist now. There are no implemented purchases or combat rewards to save yet. An atomic in-wave transaction policy is part of later gameplay implementation, not a claimed feature here.

## Audio and motion

AudioContext is created/unlocked after user input. Master, music and effects gain buses are independent. A short synthesized effects click provides a test signal; there is no loaded soundtrack or weapon audio yet. Settings changes preview immediately; Cancel restores persisted gains. Reduced Motion stops the decorative rotor/bobbing motion. Shake preference is saved, but no shake effect is implemented yet.

When the page is hidden, animation work stops and audio suspends. Returning resets the frame delta to avoid a large time jump. The render loop caps elapsed frame delta; step 4 must add a fixed-step simulation accumulator (nominal 25 ms baseline), independent of presentation refresh.

## Module map

| File | Responsibility |
| --- | --- |
| `remaster/index.html` | Viewport, canvas/UI/loading roots, shell, diagnostics. |
| `remaster/styles.css` | Native UI, responsive scaling, modal/HUD states, fullscreen fallback. |
| `remaster/src/main.js` | Startup, loop, settings/audio/scene wiring, page lifecycle. |
| `remaster/src/assets.js` | Cancellable JSON loading, progress, reference-data validation. |
| `remaster/src/viewport.js` | Uniform display transform, pointer mapping, fullscreen/window mode. |
| `remaster/src/input.js` | Pointer lifecycle and stuck-input prevention. |
| `remaster/src/scenes.js` | Menu, preparation, settings and confirmation navigation. |
| `remaster/src/renderer.js` | Disposable procedural scenery, five-slot base, helicopter and reticle. |
| `remaster/src/save.js` | Validated versioned local persistence, backup and session fallback. |
| `remaster/src/audio.js` | Lazy audio context, gain buses and test click. |
| `remaster/tests/foundation.test.js` | State/persistence and coordinate invariants. |

The server now serves CSS/images/modules with appropriate MIME types and maps `/remaster/` to its index. The default `/` route remains the cleaned Flash player to preserve existing links. Original SWF files were not rebuilt or changed during this stage.

## Verification

Run `node --test --test-isolation=none remaster/tests/foundation.test.js` (or the equivalent package test script). All **10 tests pass**. Disabling test-process isolation accommodates this workspace's child-process restriction; test logic still runs under Node's test runner.

Automated coverage: original starting balance; checkpoint/settings round-trip; backup on replacement; defensive copies; malformed/future save preservation; failed-storage fallback; invalid economy rejection; pointer transforms at native/narrow/fullscreen/ultrawide/portrait dimensions; exclusion of scenic extensions from input; zero-size rejection.

Browser checks:

- JSON/CSS/modules loaded with no warning/error console entries during startup.
- New campaign initialized correct first-wave HUD and 10 incoming enemies.
- Reload enabled Continue and restored the checkpoint.
- Master 0%, Reduced Motion on, shake Off survived reload.
- Defaults followed by Cancel preserved saved settings; Defaults + Apply restored the initial preferences afterward.
- Native request denial produced the full-window fallback, filling 1280×720.
- Clicking display point (1067,400) in that 1280×720 view mapped to logical (800.3,300.0).
- Escape returned from expanded mode.
- Normal desktop measured 960×540 in a 1200×800 viewport.
- A narrower panel measured 640×360 with no document/HUD horizontal overflow.

Audio gain behavior is wired and its UI is exercised; subjective sound balance, real soundtrack playback, load-error interaction, and native physical-screen fullscreen still need broader browser testing. No complete-game or combat test is claimed.

## Step 4 handoff

Implement the first wave with temporary graphics: fixed-step simulation, seeded wave queue, enemy movement/attacks, starter Cannon input/ammo/reload, damage/rewards, helicopter following, pause and victory/defeat. Use the recovered spec and balance data as the reference. Keep simulation testable without the DOM, feed render state into Renderer, and do not rebuild the framework while adding combat.
