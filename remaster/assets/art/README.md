# First-wave painted assets

Generated with the built-in image-generation tool for step 5. Exact prompts and provenance are recorded in prompts.json. Files are individual runtime assets; the concept screenshot is not used as a gameplay background.

- [Exact generation prompts and source output paths](prompts.json)
- [Runtime dimensions, alpha bounds and hashes](manifest.json)
- `forest-battlefield.png`: opaque painted forest clearing.
- `rifle-soldier-atlas.png`: transparent 4 × 2 atlas: run × 4, aim, recoil, fall, prone.
- `outpost-base.png`: transparent tower and base structure.
- `helicopter-body.png`: transparent body; rotors are drawn by the renderer.
- `outpost-equipment.png`: transparent 2 × 2 atlas: sandbags, Maxim operator, commander portrait, crate.

Regenerate the metadata with `node scripts/audit-art.cjs` from the project root. The audit reads original PNG bytes and does not alter the assets. Animation, lighting effects and HUD layout are implemented in code.

Step 7 adds two transparent atlases generated with the built-in image-generation tool. [Exact prompts and source paths](phase7-prompts.json) are retained separately from the first-wave prompts:

- `vehicles-painted.png`: 2 columns × 3 rows, light/heavy APC, light/heavy tank, light/heavy rocket carrier, all facing left.
- `defenses-painted.png`: 2 columns × 2 rows, mortar, light cannon, field cannon, heavy cannon, all facing right.

Both files are 1536 × 1024 RGBA PNGs. Vehicle row boundaries are rounded to integer pixels by the audit, which records each cell's alpha bounds. The runtime scales the cropped sprites uniformly; damage tint, recoil, smoke and death fade remain procedural. Neither original source image is overwritten.

## Weapon, support and bazooka infantry completion

Created with the built-in image-generation tool:

- [weapons-equipment.png](weapons-equipment.png): Cannon, machine gun, Bazooka and Rocket, in a 2 × 2 atlas.
- [support-equipment.png](support-equipment.png): Mine, aircraft, atomic bomb and a spare crate, in a 2 × 2 atlas.
- [bazooka-soldier-atlas-v3.png](bazooka-soldier-atlas-v3.png): four running poses, aim, recoil, fall and prone, in a 4 × 2 atlas.

[Generation prompts](equipment-prompts.json) record the initial requests and source paths. [Bazooka final edit prompts](bazooka-final-edit-prompts.json) record spacing correction, alpha extraction and the selected final source. The initial soldier draft had insufficient cell spacing; the spacing edit had an opaque background. Both were rejected. Only the final transparent version is shipped in the workspace manifest.

Weapon/support artwork is used in the shop cards and live HUD. Cropped SVG viewports display the actual PNG cutouts at their natural aspect ratio; these are not vector icon substitutes. The painted mine and aircraft also render during deployment. The bazooka soldier uses its own atlas, with no rifleman overlay or placeholder launcher rectangle.

## Fortification redesign

[outpost-fortifications.png](outpost-fortifications.png) is a transparent 2 × 2 atlas: compact command bunker, empty earth-floor gun pit, timber-lined service trench, and supply cache. It was created with the built-in image-generation tool; [the exact prompt and source path](outpost-redesign-prompt.json) are retained. The renderer replaces the old tall tower with this modular layout and layers the pit's near sandbag lip over gun feet/wheels. The earlier tower image remains as a reference asset.
