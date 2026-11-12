# Crazy Battle — standalone cleanup

Enemy readability follow-up: both soldier types are about 15% larger with matching painted targeting coverage. Enemies have tighter silhouette contrast, stronger contact shadows, clearer damage bars and brief hit feedback. [Visibility changes and checks](docs/ENEMY-VISIBILITY.md): 72 passing tests and the same twenty-wave economy total.

Control follow-up: disabled shops explain when to pause; support and repair controls expose state-aware tooltips. The HUD speaker now mutes/unmutes every audio channel and remembers that choice, preserving existing volume levels. Settings stays in the menus. [Control behavior and checks](docs/CONTROL-CLARITY.md): 70 passing tests.

Targeting follow-up: painted helmet and armor edges now accept shots alongside the original body targets, including uppermost-lane vehicles. Rendering and aiming share sprite geometry. Damage/rates/rewards remain unchanged. [Targeting checks and behavior](docs/TARGETING-ACCURACY.md): 65 passing tests and the same twenty-wave integration total.

## Presentation and honors (step 7)

The base now uses a compact command bunker and five grounded gun pits connected by a timber-lined trench. The workshop leaves the defense line visible while selecting positions. [Outpost redesign notes](docs/OUTPOST-REDESIGN.md) · [preview](docs/outpost-redesign-preparation.png).

Weapon and support shop cards and HUD controls now use individual painted equipment assets. Bazooka infantry has a dedicated eight-pose animation atlas. Mines and support aircraft also use the painted sprites in battle. The follow-up passes 52 tests. [Implementation and browser checks](docs/EQUIPMENT-ART.md) · [assets and prompts](remaster/assets/art/README.md) · [weapon shop preview](docs/equipment-weapons-preview.png) · [support shop preview](docs/equipment-support-preview.png).

[Play the polished remaster](http://localhost:8765/remaster/). Refresh after finishing your current wave to load the new artwork and screens. Six painted vehicle variants and four painted artillery defenses replace the first-pass silhouettes. The command menu, Field Manual, compact illustrated shop, pause controls, wave briefing and results have been refined. Medals tracks six campaign achievements with earned/locked states and live unlock feedback.

See [Step 7 notes and browser checks](docs/PRESENTATION.md), [gameplay preview](docs/phase7-battle-preview.png), and [asset prompts](remaster/assets/art/phase7-prompts.json). The built-in image-generation tool produced the two new sprite atlases, saved under `remaster/assets/art/`. All 51 tests pass using `node --test --test-isolation=none remaster/tests/*.test.js`; the twenty-wave integration run retains the same score and economy. Step 8 is extended browser playtesting, performance and release QA.

## Full campaign systems (step 6)

[Play the campaign remaster](http://127.0.0.1:8765/remaster/). All 20 waves, eight enemy types, four weapons, five defenses and three support items are implemented. Shop while preparing or paused; hold to fire the machine gun. Select owned support and click the battlefield to deploy. Repair the base from its health control while preparing or paused.

Preparation purchases save immediately. Wave victory saves progress, surviving defenses, weapon ownership/selection and support stock together. Retry restores the wave checkpoint. Older remaster saves remain compatible. Wave 20 leads to campaign completion and the final score plus remaining supplies.

See [campaign implementation, compatibility decisions and checks](docs/CAMPAIGN.md). All 45 tests pass with `npm test`. `node scripts/verify-campaign.mjs` clears all 20 waves through normal model purchases and combat using a deterministic targeting controller. Later vehicles and emplacements currently use code-drawn silhouettes; further art refinement, menus and achievements follow in Step 7.

## Polished first wave (step 5)

[Play the painted remaster](http://127.0.0.1:8765/remaster/). New forest scenery, transparent character sprites, animated riflemen, helicopter, outpost and commander art replace the placeholders. The HUD, combat effects and procedural audio are integrated. Earn 5 supplies, pause, then open Defenses to place a Maxim in one of five positions; damaged guns can be repaired or sold while paused.

See [Step 5 implementation and verification](docs/POLISHED-WAVE.md), [gameplay screenshot](docs/polished-wave-preview.png), and [generated assets and prompts](remaster/assets/art/README.md). All 34 tests pass. The playable slice still covers wave 1; the remaining campaign, weapons and upgrades are Step 6.

## Core combat baseline (step 4)

Click enemies to fire the six-shot Cannon; reload is automatic. P pauses. Wave 1 includes enemy attacks, base damage, victory/defeat, retry and atomic victory checkpoints. Step 5 replaces the temporary graphics/audio and adds the Maxim proof described above.

See [core combat implementation and checks](docs/CORE-COMBAT.md). Run `node --test --test-isolation=none remaster/tests/*.test.js`: all 25 tests pass. Step 5 is the polished first-wave graphics/effects pass.

## Modern browser foundation (step 3)

Open [the remaster preview](http://127.0.0.1:8765/remaster/) with `node server.cjs` running. The step-3 foundation added native widescreen rendering, menus/settings, pointer mapping, local checkpoints and fullscreen with an embedded-browser fallback. Step 4 adds the playable first wave described above. The Flash baseline remains at the default page.

See [foundation architecture and verification](docs/FOUNDATION.md). Run `node --test --test-isolation=none remaster/tests/foundation.test.js` for the 10 foundation tests. No dependency installation is required.

## Proposed art direction (step 2)

Review the [visual guide](http://127.0.0.1:8765/docs/art-direction/index.html), [style guide](docs/art-direction/STYLE-GUIDE.md), [selected gameplay concept](docs/art-direction/gameplay-concept-v2.png), and [design tokens](docs/art-direction/design-tokens.json). This is a visual proposal, not an implemented remaster. Generation prompts and the earlier concept are retained beside the selected image.

## Remaster reference (step 1)

- [Gameplay specification](docs/GAMEPLAY-SPEC.md): recovered rules, timing, combat, progression, economy, saves, and evidence limits.
- [Asset inventory](docs/ASSET-INVENTORY.md) and [30 original asset previews](docs/ASSET-PREVIEWS.md).
- [Exact balance and all 20 waves](docs/reference/BALANCE-TABLES.md), plus machine-readable XML/JSON/CSV under `docs/reference`.
- [Validation and original quirks](docs/VALIDATION.md): observed browser checks, suspected bugs, and future acceptance checks.

Regenerate the static inventory with `node scripts/inventory-original.cjs`. Step 1 preserves the game/build unchanged; a complete 20-wave runtime playthrough is not claimed.

## Run the cleaned game

Run `node server.cjs` from this directory, then open http://127.0.0.1:8765/.
The local player uses bundled Ruffle 0.7.1; no Flash plugin or CDN is required.
The game displays at 960 × 540 (shrinking responsively on narrower windows). Its internal stage stays at 640 × 480, with CSS scaling preserving gameplay coordinates and mouse input. The original 4:3 artwork is stretched to fill 16:9 without cropping or letterboxing. The Fullscreen button or F key fills the entire display; Escape exits. External SWF networking and outbound links are disabled in the player.

Display verification: measured 960 × 540 in a 1200 × 800 browser viewport, and a borderless 1680 × 1050 fullscreen frame. Menu input, shooting (10 points and 1 money), and Escape exit were verified after scaling.

The default page now runs `standalone/build/crazy-battle.swf`, with direct startup and no outer FOG wrapper. Removed active FOG currency synchronization, coin exchange, score submission, portal links, banners, and remote leaderboard implementations. Normal earned game money and upgrades remain; saves use a separate local SharedObject named `crazy-battle-standalone-v1`. This does not import or overwrite the original game's saves.

`standalone/scripts` contains the modified ActionScript classes. The untouched recovered files remain under `decompiled` for reference. Original timeline assets and local translation class names are retained; the FOG API and Playtomic classes in the cleaned SWF are inert compatibility shells, with no network code.

## Rebuild

Run `pwsh -File scripts/build-clean.ps1` with Java and the downloaded `tools/ffdec/ffdec.jar` available. This regenerates patches from the preserved recovered sources and imports the modified classes into the extracted game SWF. It preserves the original embedded artwork, fonts, sounds, and timelines.

## Recovered files

- `original/crazy-battle.swf`: untouched copy of the supplied SWF.
- `original/game.swf`: embedded game extracted from the outer FOG wrapper.
- `decompiled/scripts`: 60 outer wrapper ActionScript files.
- `decompiled/game/scripts`: 267 embedded game ActionScript files.
- `decompiled/game/shapes`: 874 SVG shapes.
- `decompiled/game/images`: 17 bitmap images.
- `decompiled/game/sounds`: 39 sound files.
- `decompiled/game/fonts`: 7 font files.
- `decompiled/game/texts`: 76 text exports.

Decompiled and patched with JPEXS FFDec 26.4.0. These are recovered sources/assets, not the original authoring project.

## Browser verification

The cleaned SWF was tested in the built-in browser: direct main menu without FOG preloader or banners, new game, tutorial, live gameplay, enemy waves, currency rewards, and level victory. Reload → Continue restored level 2, 100 points, and 10 money. Gameplay continued into level 3. All compiled scripts were exported again and audited: no remaining wrapper references (`Preloader.main`/`Preloader.FogAPI`), URLRequest, ExternalInterface, navigateToURL, or leaderboard calls. Full campaign completion and every upgrade purchase have not been tested.

The player always runs the cleaned standalone version, including old links with `?mode=original` or `?mode=game`, so the FOG promotional footer cannot reappear through those links. Untouched original SWFs remain archived under `original`.

Tool sources: https://github.com/jindrapetrik/jpexs-decompiler and https://ruffle.rs/.
