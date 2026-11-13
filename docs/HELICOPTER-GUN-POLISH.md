# Helicopter gun polish

The chin mount now uses a short fixed support below the nose and draws behind the fuselage/skids. Launch effects also draw behind the aircraft, preventing upward or rearward flashes and tracers from covering the cockpit. The four existing weapon assets remain distinct, with the previous 50% muzzle-flash reduction retained.

Gun recoil is independent of the body response: Cannon 1.1, machine gun 0.65, Bazooka 1.4, Rocket 1.6 design pixels, decaying with the existing 65 ms trace lifetime. Reduced motion disables this recoil. The rendered barrel and muzzle endpoint share this displacement. During the short launch flash the gun holds the actual shot target, then resumes cursor tracking, avoiding a cursor flick pulling the muzzle away from its shot.

Validation:
- 108 automated tests passed, including recoil recovery, reduced motion, shot-target locking, weapon variants, muzzle endpoints, and projectile presentation without simulation mutation.
- Browser visual fixture used production Combat.fire and Renderer for all four weapons across eight aim directions, with ready/firing/settling controls.
- Each weapon also fired in the actual battlefield renderer through the isolated QA campaign, paused at launch for inspection. This was a controlled visual check, not a new full campaign playthrough.
- No browser console errors observed.
- Screenshot: helicopter-gun-directions.png.

Reproduction: node scripts/create-browser-qa.cjs, then open /remaster/tests/browser-fixture.html and use the four Check helicopter buttons. The dedicated direction gallery is /remaster/tests/helicopter-visual-qa.html.

Combat damage, ammo consumption, reload times, and simulation trajectories are unchanged.

## Integrated chin housing and limited traverse

Replaced the exposed support joint with a body-colored chin fairing and moved the pivot within 2.3 design pixels of the original attachment. Weapon source regions now exclude handheld grips and tall display mounts. Breeches sit farther inside the fairing, with smaller barrel assemblies. The traverse is limited relative to the helicopter to -18° through 105°: forward/up slightly, down, and only 15° behind vertical. It cannot turn toward the trench. Player launch flashes follow this limited barrel angle. Combat targets and damage rules remain unchanged.

Checked all four variants in the browser direction gallery, with no console errors. Screenshot: helicopter-integrated-mount.png. Updated suite: 109 tests pass.
