# Battle intensity — combat feel step 3

Explosions now layer a ground pressure ring, dust/smoke puffs, warm fire glow and short sparks. Missed shots kick up terrain dust. Blast duration metadata keeps large support effects consistently sized as they fade, instead of abruptly changing size when TTL crosses a threshold.

Explosion camera shake is confined to the canvas battlefield, leaving DOM menus/HUD and cursor aiming stable. The maximum offset is 1.4 logical pixels horizontally and 0.84 vertically; simultaneous blasts use the strongest envelope rather than adding together. Shake expires after 140 ms, follows simulation time, and is disabled by Screen shake Off or Reduced motion. Reduced motion also removes sparks and limits dust travel and glow.

Combat effect lifetimes, damage, radius, ammunition, rewards and progression are unchanged. The only added combat data is presentation duration on blast effects.

Validation: 84 tests passed, including pause determinism, capped overlapping shake, both disable settings, and consistent support-effect size through expiry. Browser inspection used an actual Atomic support deployment in the separate QA save, frozen 100 ms after deployment. Screenshot: `battle-intensity-preview.png`. No cross-browser certification or new performance benchmark was performed in this step; those remain deferred.

Next: distinct weapon sounds, heavier impacts and improved reload cues.
