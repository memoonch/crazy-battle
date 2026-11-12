# Enemy reactions — combat feel step 2

Infantry now lean briefly on impact; vehicles have a smaller armor reaction. Death poses settle slightly, with a ground dust ring and short debris spray. Vehicle corpses use darkened paint, a short blast glow and smoke. These effects reuse the existing 350 ms corpse lifetime and do not delay wave completion or change damage, movement or rewards.

All envelopes use simulation time. Reduced motion disables the lean/settling movement and additional blast glow, and reduces debris travel. Rendering remains separate from the hit-test geometry; live lean is at most 0.035 radians for infantry and 0.012 for vehicles.

Validation: 82 tests pass, including pause determinism, target immutability, bounded death progress and reduced-motion behavior. Browser preview used normal cannon shots to destroy a vehicle, then paused the simulation for inspection. The separate QA-only freeze control is reproducible through `scripts/create-browser-qa.cjs`. Screenshot: `enemy-reaction-preview.png`.

Next step: broader battle intensity effects (explosions, terrain dust and restrained camera shake), followed by weapon sound differentiation. Browser compatibility and release packaging remain deferred as requested.
