# Shooting feedback — first pass

- Player traces carry weapon/presentation metadata. Bullet lines have a warm outer stroke and bright core; bazooka and rocket launch flashes accompany their existing moving projectiles instead of an instant bullet line.
- Directional muzzle flashes follow the shot angle. A small visual helicopter kick decays over the existing 65 ms trace lifetime; machine-gun kick is lighter. Reduced motion disables kick and reduces glow size.
- Successful direct bullet hits show a brief impact cross at the shot location. Cursor hit feedback now requires a nearby impact instead of responding to a hit elsewhere on the field. Explosive rounds do not show a premature direct-hit cross at launch.
- Damage, aim geometry, fire rates, ammunition, reloads, rewards and progression remain unchanged.

Validation: all 80 tests passed after the change. Browser live-fire sample verified machine-gun ammunition consumption and kills, plus pause. A reproducible QA-only frozen shot (normal cannon fire followed immediately by pause) allowed visual inspection of the flash, tracer and impact. Screenshot: `shooting-feedback-preview.png`. This is a frozen presentation fixture, not a new gameplay pause mode. The QA save is separate from the normal campaign.

Next: enemy hit reactions and destruction, followed by battle effects and weapon sound differentiation.
