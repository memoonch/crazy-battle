# Vehicle ground contact

Corrected all six vehicle variants after the APC appeared to float while moving.

- Trimmed transparent padding below tyres and tracks. The heavy tank crop also included pixels from the next atlas row; these are now excluded.
- Kept original sprite scale and anchored rendering to the physical ground contact line. Source PNG pixels are unchanged.
- Rebuilt alpha hit masks for the corrected crops so painted targeting follows the artwork.
- Replaced broad floating shadows with individual tyre/track contact shadows and moved dust to the rear contact point.
- Removed whole-body vertical bounce, which lifted tyres off the ground.
- Kept rotating hub textures and calculated rotation from the outer tyre radius rather than the smaller hub radius.

Movement speed, damage, fire rate, and economy are unchanged.

Validation: all 106 tests passed. Checked the six-vehicle convoy in the browser, including movement and ground contact; no browser console errors were observed. Preview: `grounded-vehicle-preview.png`.

Crop metadata and hit masks can be regenerated with `node scripts/ground-vehicles.cjs`; the audit is saved in `vehicle-grounding-audit.json`.
