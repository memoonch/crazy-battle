# Visual and sound review

Reviewed 12 November 2026 in the embedded Chromium browser using the separate QA save.

Weapon and support shop samples displayed the painted equipment with readable labels and prices. A live wave-6 fullscreen sample showed riflemen, bazooka infantry, APCs and tanks, the rebuilt outpost, helicopter and HUD without placeholder art in the sampled units. Settings fit the fullscreen display. This sample review does not certify every animation frame or every screen size.

Fixed the effects preview: it now plays the actual shot effect instead of another UI click. When master mute is enabled, it explains how to unmute through the battlefield speaker. At 0% Master or Effects volume it explains which sliders must be raised. Both messages were verified through actual UI actions. Speaker mute remains the sole dedicated mute control; no extra sound panel was added. Settings changes made for this check were discarded.

Repeated the objective sound check: active pre-compressor peak 0.1934, RMS 0.01367; muted peak and RMS zero; restored peak 0.00391. The measured mix did not clip. Raw measurements: `sound-review-report.json`. This is signal verification, not a subjective listening assessment; speaker/headphone sound balance still needs human listening.

All 80 automated tests passed following the change. Next phase: browser and screen-size compatibility testing, then release cleanup and packaging.
