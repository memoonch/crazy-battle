# Improvement 1 — targeting accuracy

The painted soldier helmets and taller vehicle armor extended beyond the fixed legacy body rectangles. Also, the input area's previous top edge at design y=185 excluded the uppermost armor of vehicles in the highest lane.

The PNG audit now generates 32 × 32 occupancy masks from real alpha values above 24 for living soldier poses and all six vehicles. These are metadata only; image pixels and hashes are unchanged. Shared sprite-layout functions supply both rendering and aiming geometry. Legacy body targets remain accepted; painted areas outside them add coverage. Empty outer corners, shadows, smoke and health bars do not create bonus targets. Mask cells provide a small, bounded edge tolerance rather than per-pixel precision.

Moving soldiers use the union of their run poses, and attacking soldiers use aim/recoil poses, so frame timing and reduced motion cannot make a visible limb suddenly untargetable. Vehicle coverage includes its sub-pixel cosmetic bob. The pointer region now begins at y=170, covering the tallest visible armor; HUD areas, the base strip and scenic extensions remain excluded.

Cannon and machine gun use this coverage directly. Area weapons retain the original cursor radius and captured-target behavior, with a directly clicked painted target also included once when its ground anchor falls outside that radius. Existing splash-target order is preserved. Damage, fire rate, magazines, reloads, rewards, enemy stats and wave composition are unchanged.

Validation: **65 passing tests**, including all eight enemy types, helmet/armor shots, transparent corners, animation-state coverage, area-weapon tall targets and pointer conversion at native, narrow, fullscreen and ultrawide sizes. The production scene constructors pass the actual art metadata into Combat. The twenty-wave integration controller also uses that metadata and retains 31,950 points plus 627 supplies, total 32,577.

In a temporary memory-only browser fixture, a click at the rifle soldier's helmet edge above the old body target killed the 10-HP soldier with one Cannon round, awarded exactly 10 points and 1 supply, and completed the one-enemy test. No console warnings or errors were observed. [Verification capture](targeting-check-preview.png). The fixture did not access the active campaign save and was removed afterward.

Next improvement: explain disabled shop/support controls and clarify the sound/settings action.
