# Battlefield aftermath

Wreck visibility tuning: lingering body opacity is now 28% before its final fade, down from 80%. The initial death pose fades smoothly toward that value. Wreck paint is more desaturated and charred; lingering flames and smoke are quieter too. Browser-checked in `faded-wreck-preview.png`; all 104 tests pass. Lifetimes, targeting and combat rules remain unchanged.

Explosive impacts now leave textured scorch marks or shallow crater decals. Destroyed vehicles leave ash stains, small settled fragments and a darkened, slightly settled copy of their painted body, with brief fire and drifting smoke. This reuses the vehicle art; it is not a separate newly painted destroyed-vehicle model.

The renderer owns all aftermath records. They do not enter the enemy list, collision checks, save data, reward calculations or wave-completion conditions. Live units draw above the decorative wrecks. Existing 350 ms death poses lead into the lingering vehicle body without fading it away first.

- Up to 28 ground scars, lasting 30 combat seconds and fading during their last five seconds.
- Up to eight wrecks, lasting eight combat seconds and fading during their last two seconds. Fire fades over 2.2 seconds and smoke over six seconds.
- Oldest records are discarded when limits are reached. A new combat instance, including Retry or a new wave, starts clean.
- All timing follows simulation time, so pause freezes the aftermath. Reduced motion keeps smoke still and lowers flame intensity. Result screens freeze their combat clock and therefore freeze remaining visuals too.

Validation: 101 tests pass, including record limits, duplicate prevention, survival beyond expired combat effects, fade/expiry, off-field filtering, reset and source-state immutability. All art hashes/dimensions pass. Browser QA inspected the field after two actual Atomic deployments in an isolated fixture, after short-lived combat corpses and blast effects had expired. Screenshot: `battle-aftermath-preview.png`. No new stress benchmark or cross-browser certification was performed.

## Generated artwork

Final project asset: `remaster/assets/art/battlefield-scars-v1.png`. Generated with the built-in image tool; no CLI fallback. Four cropped alpha-aware frames are registered in the art manifest. Empty corner alpha is zero; sampled near-transparent coverage is approximately 80.4%. The original tool output remains preserved in its default generated-images location.

Prompt used:

> Use case stylized-concept. ONE production 2D game decal atlas, square PNG, strict uniform 2x2 grid, each cell an isolated ground scar. Truly transparent empty background with alpha zero, no white or gray background haze, no ground rectangle, no checkerboard, no text. Perspective: low oblique 3/4 view of level ground as in a side-view painted military battlefield. Each ground mark is a horizontal flattened ellipse about three times wider than tall, centered within its own cell with at least 15% empty transparent padding. Top left: small irregular blackened scorch mark, feathered charcoal ash, a few earth chips. Top right: shallow artillery shell crater in ochre brown dirt, broken raised earth rim, dark rough center, naturally irregular, not a deep black hole. Bottom left: larger bomb impact scar with shallow depression, broken dirt rim, radial soot streaks and scattered stones. Bottom right: broad burnt earth and charcoal ash stain under a destroyed vehicle, irregular soft edges, no vehicle itself. Rich hand-painted natural texture matching warm orange-brown earth and olive military game art. No smoke, no flames, no vertical objects, no background terrain tile, no cast shadow beyond each scar. Strict 2x2 layout, four separate horizontal ground decals, preserve genuine transparent alpha around all edges.
