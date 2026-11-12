# Enemy visibility and slightly larger soldiers

Both infantry types are now drawn at a nominal 42.5 logical pixels high, up from 37 (about 15%). Run, aim, recoil and death poses scale uniformly around the existing feet anchor. Rendering and painted targeting coverage continue to share the same layout helper, so the newly visible helmet area is clickable. Vehicle sizes are unchanged.

Living enemies receive a tight dark alpha-following silhouette edge and a stronger two-layer ground-contact shadow. These are runtime canvas effects, not changes to the PNG artwork. Damage tint on vehicles is less dark, keeping armor readable against the terrain. Damaged vehicles retain their existing smoke/fire states and have a clearer bordered health indicator.

Successful damage records the current simulation time for a brief 100 ms body-brightness response and small hit marker. The marker does not add damage or timers. Pause freezes it with simulation time. Reduced motion reduces the brightness change from 1.48 to 1.12 and adds no camera movement or shake. Shadows, smoke, outlines and health bars do not enlarge targeting masks.

Damage, fire rates, health, movement speed, rewards, spawn timing and wave counts are unchanged. Infantry's visible size and matching painted targeting coverage intentionally increase together.

Verification: **72 passing tests**. New regression checks confirm that both enlarged infantry helmets accept normal Cannon hits above their former sprite height, with the same ammo use and rewards, and that damage feedback timestamps freeze during pause. The actual-art twenty-wave integration run still finishes with 31,950 points and 627 supplies (32,577 total). Existing source-image integrity checks pass.

A temporary memory-only browser fixture displayed both infantry types and all six vehicle variants together. It held a normal damage frame for inspection: a Cannon hit consumed one round and showed the vehicle flash, marker and damage bar. This visual fixture is not a normal wave roster and does not write campaign saves. No browser console warnings/errors were observed. It is removed afterward. [Visibility preview](enemy-visibility-preview.png) · [Held hit-feedback preview](enemy-hit-feedback-preview.png).
