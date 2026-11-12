# Enemy attack readability

Tanks and rocket carriers show a restrained amber arc around their muzzle during the final approximately 400 ms of their existing firing counter. This cue does not add a delay or alter AI. It disappears when moving or dead. It remains available with reduced motion because it conveys firing readiness without flashing.

Heavy shots add a 220 ms gun-assembly recovery. Tank recoil peaks at 2.2 logical pixels; rocket-launcher recoil is lighter at 1.1 pixels. The upper gun region is drawn separately from the cached vehicle image, leaving the running gear grounded. Barrel-tip placement applies the same recoil offset. Reduced motion disables this movement. A presentation timestamp records when an actual enemy shot occurs, preventing fake recoil when a vehicle first stops.

Incoming artillery shells now have a short smoke wake and a small heated glint; hostile rockets retain their longer exhaust trail. Existing particle limits still apply, and reduced motion suppresses emitted trails. Base/defense hits create localized image-based sparks and dust at the hit position. The subtle base damage wash works with screen shake turned off too.

Damage, attack intervals, projectile impact timing, ammunition, rewards and original audio are unchanged. Added combat fields/effects are presentation metadata only; impact effects do not participate in wave-completion conditions.

Validation: 104 tests pass, including the cue window, real-shot-only recovery, pause determinism, source immutability, reduced-motion behavior and muzzle/recoil agreement. The deterministic 20-wave campaign still ends at 31,950 points plus 627 supplies (32,577 total). Browser QA checked aiming cues, hostile projectile flight/recovery and a normal BTR base hit in separate test storage. The preview helper's obsolete HUD method name was corrected to `updateHud` before these checks were rerun. Reproducible controls remain in `release-qa-runner.js`, generated through `scripts/create-browser-qa.cjs`.

Screenshots: `enemy-aim-cue-preview.png`, `incoming-shell-preview.png`, `base-impact-preview.png`. No new stress benchmark or cross-browser certification was performed; those phases remain deferred.
