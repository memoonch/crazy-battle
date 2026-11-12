# Command post and defense-line redesign

The tall wall with vertically stacked sandbag shelves is replaced by a compact camouflaged command bunker, a timber-lined ground trench, five individual earth-floor artillery pits, small numbered position plates/status lights, and a supply cache. Each gun sits inside its pit. The near sandbag lip is drawn over its feet or wheels, adding contact and depth. An empty or destroyed position remains an empty pit rather than a floating platform.

The new painted kit is saved as [outpost-fortifications.png](../remaster/assets/art/outpost-fortifications.png). It was created with the built-in image-generation tool. [Exact prompt and provenance](../remaster/assets/art/outpost-redesign-prompt.json) are retained, along with audited alpha bounds and the image hash. The old tower is preserved as a reference, but is no longer drawn.

All five existing lane centers remain at design y = 240 + slot × 48. Pit artwork stays within x = 61…143, outside the battlefield input region starting at x = 145. Bunker and trench layers also stay behind the combat region. Weapon stats, targeting, defense health, placement, repair/sale, saves and enemy behavior are unchanged. Low base health tints the bunker and emits smoke from its roof.

The workshop sits to the right of the gun line. Its background shading leaves the base readable, and the selected pit's amber outline renders above the shading. Selection continues to use the existing five-position controls.

Verification: 52 passing tests, JavaScript syntax checks and image integrity/alpha/frame-bound checks. A temporary memory-only browser fixture showed all five defense types in the new pits, empty/destroyed positions during a wave, and the normal defense workshop. No console warnings or errors were observed. The fixture did not write campaign saves and is removed after review. [Preparation preview](outpost-redesign-preparation.png) · [Battle preview](outpost-redesign-preview.png).
