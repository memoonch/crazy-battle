# Painted equipment and bazooka infantry

Weapon and Support shop cards now show painted PNG cutouts instead of the shared gun, plane, mine and atom line icons. The live HUD uses the same assets, including the selected weapon. Names, prices, ownership, stock, disabled states and accessible button labels remain live UI text.

The equipment helper crops each source PNG using its audited alpha bounds inside an SVG viewport. Aspect ratios are preserved, and adjacent atlas cells cannot appear in a thumbnail. These SVG viewports contain raster images, not replacement vector symbols. Defense cards already used painted assets and retain them.

Bazooka infantry now uses `bazooka-soldier-atlas-v3.png`: four run frames, aim, recoil, falling and prone. The rifle atlas and the flat launcher rectangle are no longer used for that enemy. The full launcher is part of every applicable pose. Feet anchor to the existing world position, and sprite height matches the rifle soldier. Enemy movement, hit bounds, health, attack timing and projectile damage are unchanged. Mines and support aircraft also use the new painted cutouts during deployment.

Assets were created with the built-in image-generation tool and saved in [the art directory](../remaster/assets/art/README.md). It links the exact initial prompts, spacing correction and final alpha-extraction prompt. Two rejected bazooka drafts are excluded from the runtime manifest. The final atlas has real transparency and at least 25 pixels of empty margin inside every cell. The asset loader derives its progress total from the manifest rather than a fixed count.

Validation: **52 tests pass** with `node --test --test-isolation=none remaster/tests/*.test.js`. Integrity checks cover all ten runtime images, alpha, frame bounds and launcher/death-pose gutters. JavaScript syntax and whitespace checks pass.

Browser checks used a temporary memory-only fixture and did not write the active campaign save. All four weapon illustrations and all three support illustrations rendered in their shop cards and HUD slots. Buying the machine gun changed supplies 250 → 225, ownership to Equipped, ammunition to 10/10 and the HUD illustration to the machine gun. Live wave-2 rendering showed the dedicated bazooka soldier alongside riflemen with transparent edges; console inspection returned no warnings or errors. Fixture captures: [weapons](equipment-weapons-preview.png), [support](equipment-support-preview.png), [infantry](equipment-bazooka-preview.png). The fixture is removed after verification.
