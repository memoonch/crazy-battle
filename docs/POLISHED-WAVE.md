# Step 5 — polished first-wave slice

The native browser remaster at `/remaster/` now uses painted runtime assets, a refined HUD, animated soldiers and helicopter, combat effects, procedural sound and a working Maxim defense. The cleaned Flash build remains available separately.

## Art and presentation

Five PNG assets were created with the built-in image-generation tool: forest battlefield, eight-pose rifle soldier atlas, transparent outpost, helicopter body and equipment atlas. The equipment atlas supplies sandbags, Maxim operator, commander portrait and crate. See [assets and exact prompts](../remaster/assets/art/README.md). Alpha bounds and SHA-256 hashes are recorded in the manifest; `node scripts/audit-art.cjs` regenerates metadata without modifying the images.

The renderer combines individual sprites and live HUD elements. It does not display a flattened concept screenshot. Soldiers use four running poses plus aim, recoil, fall and prone states. Helicopter rotors, firing flashes, tracers, impacts, dust, base smoke and damage tint are drawn at runtime. The logical battlefield remains clipped to the gameplay region when the scenery extends across a wider screen. The painted background uses cover scaling without black bars.

The HUD uses charcoal panels, amber actions, commander art and readable health/ammunition indicators. The workshop highlights the selected position and explains unaffordable purchases. Reduced motion limits decorative movement; combat timing remains unchanged. Sound is authored with WebAudio synthesis: shots, impacts, reload, interface cues, results, wind, rotor and a subtle tonal bed. Volume controls include master, music/ambience and effects; audio starts after user interaction.

## Maxim proof

Pause a running wave and select Defenses. Choose one of five positions. Placement costs 5 earned supplies, with 35 HP, 10 damage and 320 simulation-unit range. It fires automatically using the recovered rate value and takes attacks in its lane before the base. A destroyed gun stops defending. Sale returns 1 supply once. Repair costs 4 and restores roughly one third of its maximum HP, preserving the original guard requiring a balance above 5. All economy and combat operations run in the model, independently of rendering.

Defenses exist within the current encounter. Restarting or leaving it removes them. Full campaign inventory/checkpoint integration belongs to Step 6. This slice still uses the Cannon, rifle enemies and wave 1 only; the wave 2 checkpoint is a completion marker rather than a playable second wave.

## Verification

`node --test --test-isolation=none remaster/tests/*.test.js`: 34 passing tests. Coverage includes prior input/save/combat checks plus placement/payment guards, automatic fire/rewards, interception/destruction, repair, sale, paused timers and asset integrity/alpha bounds.

Browser checks observed local asset loading, painted menu/preparation, live rifle soldiers and helicopter, pause/resume, workshop positions and the disabled purchase explanation with zero supplies. A victory state displayed 10 kills, 100 score and 10 supplies. Paid placement/repair/sale and defense attack behavior were verified through model tests; a complete paid workshop cycle was not manually played through. Console inspection returned no warnings or errors. The [captured gameplay preview](polished-wave-preview.png) shows the integrated assets and HUD.

Native 960 × 540 rendering and fullscreen/fallback behavior were established in Step 3. This pass retains those controls; it does not claim a new physical-display fullscreen test. Audio synthesis loaded without browser errors; a listening review is still useful before final release.

Next: Step 6 adds the remaining waves, enemy types, weapons, support items, upgrades and campaign economy/persistence. Final menu polish and release testing follow afterward.
