# Vehicle movement refinement

## Restored inner-hub rotation

Follow-up: removing rotation was too broad. Actual texture rotation is restored for all six vehicle types using corrected inner-hub centers and smaller crop bounds audited against enlarged atlas regions. Outer tire/track silhouettes remain untouched. The previous rocket-carrier centers were offset roughly half a road-wheel spacing; other variants also needed center corrections. Tests now verify rotating crops stay exactly inside the audited hub patches at multiple movement phases. All 92 tests pass. The six-type browser convoy was inspected again; current preview: `vehicle-hub-rotation-preview.png`. This supersedes the correction below where it says rotation was removed.

## Tire distortion correction

The initial rotating texture patches could pull neighboring tire/track details into the wheel area. These texture redraws have been removed. Tracked vehicles keep their original road-wheel pixels, with motion in the lower tread highlights. Armored cars keep their painted tire silhouettes and use only low-opacity rolling highlights inside the small hub region. Suspension and dust remain. All six variants were inspected again in the browser convoy. A regression test prevents rotating tire texture redraws; 92 tests pass. Current proof: `vehicle-tire-fix-preview.png`. The implementation notes below describe the initial pass and are superseded by this correction where texture rotation is mentioned.

Replaced the uniform fast, time-based vehicle bob with distance-driven movement. Armored cars rotate wheel-hub texture sampled from their existing painted atlas. Tanks and rocket carriers also have moving highlights along the lower track belt. Tracks use a smaller, heavier suspension response than wheeled vehicles. Soft dust travels behind moving vehicles; the contact shadow stays anchored to the ground.

Rotation follows traveled world distance, so it does not spin while a vehicle is stationary or paused. Wheel orientation is retained when an enemy stops to attack. Reduced motion disables wheel/track animation, dust and suspension movement; destroyed vehicles use the existing destruction treatment. No new raster assets, movement speeds, targeting rules or combat changes were introduced. Suspension displacement is bounded below the existing 0.45-pixel targeting allowance.

Validation: 91 tests pass. New tests cover all six variants, atlas crop bounds, distance-driven phase, stable stop orientation, stationary/dead/reduced-motion states and bounded bob. Browser inspection used a synthetic six-type convoy in the separate QA save and confirmed movement and stopping. The preview can be reproduced with `scripts/create-browser-qa.cjs` and “Preview moving vehicles.” Screenshot: `vehicle-motion-preview.png`. This is procedural running-gear animation over the existing single-pose artwork, rather than newly painted multi-frame vehicle sprites. Cross-browser and device testing remain deferred.
