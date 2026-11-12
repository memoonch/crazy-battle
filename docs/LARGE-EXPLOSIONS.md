# Large battlefield explosions — first step

Rocket, bazooka, mine, air-support and atomic impacts now carry presentation type metadata. Their effects use larger irregular flame lobes, hot cores, ground shockwaves, thrown debris and rising charcoal smoke. Sizes vary by source: rocket 88, bazooka 72, mine 65, air-support 110 and atomic 165 logical pixels for the effect envelope; these are visual sizes, not damage radii.

Fire fades over about 650 ms. Smoke lasts 1.6 seconds, or 2 seconds for atomic support. The renderer retains a separate bounded list of at most 18 blast clouds, so smoke can outlive the existing 250/600 ms combat effect without changing combat cleanup, wave completion, damage, ammunition or rewards. Clouds reset with a new encounter and follow simulation time, freezing during pause; the simulation also freezes on a result screen, so any remaining smoke freezes with it.

Reduced motion reduces size, glow and travel and removes extra debris/initial flash. HUD and controls remain separate from the world effects. Original sound recordings remain unchanged.

Validation: 93 tests pass. New checks cover different weapon sizes, fire-to-smoke staging, extinction and reduced-motion envelopes. Browser inspection checked the early atomic fireball and a frozen 900 ms smoke phase after its original combat effect had expired. Screenshots: `large-explosion-preview.png` and `lingering-smoke-preview.png`. No new stress benchmark or cross-browser certification was performed in this step.

Next step: weapon-specific muzzle fire, barrel smoke, rocket exhaust and moving smoke trails.
