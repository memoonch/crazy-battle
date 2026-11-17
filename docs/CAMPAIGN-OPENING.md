# Helicopter: Last Stand — campaign opening

The opening is one static landscape image with three side-by-side scenes: a crowded evacuation, advancing enemy armor, and an outpost defended by a helicopter and machine gun crews. Darker, muted painted game art replaces the earlier slides. Brief two-sentence captions beneath each scene explain the evacuation, enemy advance and defense. Artwork and captions reveal from left to right at 0.85-second intervals; reduced motion shows them immediately. All three remain visible after revealing.

One button, Defend the outpost, begins the guided first wave directly. There is no timer, Next, Skip story, or second briefing button. Existing campaigns and completed tutorials remain compatible.

Training freezes simulation: open position 1, place one free machine gun, select and place one free mine, then open the weapons tray for an explanation. No weapon purchase is required. Hold the line starts the wave. Skip tutorial completes onboarding without granting unused items. Gold arrows identify the targets; reduced motion keeps them static.

Free credits are single-use and restricted to wave 1. Completion saves the free defense. Mines follow normal in-wave placement behavior and do not survive retries. Focus loss can pause and resume training.

Artwork: remaster/assets/art/campaign-triptych-v2.png. Generated with the built-in image_gen tool using forest-battlefield.png as a style reference. The old version is retained but no longer loaded or displayed.

## Final image prompt

Create one single landscape 16:9 video-game campaign briefing illustration, divided into exactly THREE equal vertical sections SIDE BY SIDE, all three visible at once. This is a NEW image; supplied forest battlefield image is STYLE/PALETTE REFERENCE ONLY. Match its practical hand-painted 2D military strategy game art: readable simplified forms, brushy pine forest, earthy olive military palette, sprite-like believable humans and vehicles, rough material texture. Make a darker, crowded, grounded war-game loading screen, not a children's storybook, not glossy AI concept art, no photorealism. Overall overcast dusk, muted colors, dusty charcoal shadows, smoke, restrained amber highlights; keep silhouettes and action legible. LEFT THIRD: a compact alpine forest village at evacuation time, crowded dirt street with timber homes, civilians carrying bags, two crowded olive transport trucks, soldiers directing families toward the road; plenty of practical clutter, crates and baggage; the town is still intact. MIDDLE THIRD: enemy armored column advancing through a pine valley, several tanks and machine-gun jeeps with troops, churned dirt, dust, distant fires and dark smoke, tense dense military composition. RIGHT THIRD: a concrete forest outpost and sandbag machine gun emplacements preparing to defend, busy soldiers with ammo crates, barbed wire, olive utility helicopter with landing skids and an underslung gun banking above the bunker, against smoke and dark pines; defend the civilian escape road. Three narrative moments, one coherent game briefing screen. Separate thirds with narrow rough dark seams, not large decorative borders. Compose every third as its own tall scene, not three horizontal rows. Important objects within upper 75 percent; lower 25 percent darker and less busy to allow game UI captions and one button. No text, no letters, no numbers, no UI buttons, no logos, no watermarks, no HUD. Avoid magical glow, polished cinematic lens effects, giant close-up portraits, symmetrical stock-art arrangements. Landscape aspect ratio 16:9.

## Validation

Tests cover the static single-button screen, tutorial progression, free credits and save compatibility. Browser verification covers all three scenes together and the direct transition into training.



## Commander cue polish — v1.0 development

Each instruction enters with a short card slide and fade, followed by two gentle border/portrait pulses and a staggered text reveal. Cues settle after about three seconds so the player can act without a continuously moving panel. Reduced-motion preferences display all content immediately. Existing target arrows remain independent.

## Adaptive task placement — v1.0 development

Commander cards use the current target bounds and choose a nearby clear position. Placement excludes the HUD, progress indicator, active upgrade panel, defense positions, helicopter interaction area, mine-placement rectangle and target arrow. The final weapon explanation is compact enough to fit above the tray at 960 × 540. Layout updates during training to follow fullscreen and viewport changes. Geometry tests cover every lesson, and browser checks confirmed no protected UI intersections for mine placement and the final weapon explanation.
