# Mounted machine-gun jeep

Replaces both APC variants' presentation (internal enemy identifiers `BTR` and `BTRLite`) with a left-facing jeep, driver, and mounted machine-gun operator. Tanks and rocket carriers retain their artwork. Both jeep variants retain their own original combat stats. Balance data and combat rules are unchanged, including health, speed, damage, attack cadence, rewards, and wave counts. Legacy body targeting remains accepted; the alpha mask follows the new painted silhouette.

The standalone sprite is `remaster/assets/art/machine-gun-jeep-v1.png`. Its metadata and 32×32 alpha hit mask are reproducible with `node scripts/register-jeep.cjs`. Wheel centers, inner hub patches, outer tyre radii, ground anchor, and gun muzzle were audited against this sprite. Wheel rotation, dust, contact shadows, damage tint, and faded wreck rendering use the new artwork.

Validation: 106 automated tests pass. Browser checks covered the six-vehicle moving convoy and frozen firing alignment, including fullscreen. No browser console errors observed. Screenshot: `machine-gun-jeep-preview.png`.

Artwork generated with the built-in image generation tool, with transparency enabled. Final prompt:

> Use case: stylized-concept. Production 2D game sprite: one olive drab military jeep with a soldier operating a rear pedestal mounted machine gun, plus a driver. Jeep and long machine gun face LEFT. Three-quarter side view, front left visible, slightly elevated camera, near side facing viewer. Hand-painted detailed warm weathered olive metal, chunky black rubber tires, muted khaki soldiers, dark outlines, matching a premium illustrated forest battlefield game. Four-wheel open-top jeep, exactly TWO prominent near-side wheels, far wheels only subtly visible. All tyres firmly on same ground line. Machine gun barrel horizontal pointing left, exposed clear barrel tip at front upper-left. Single complete isolated vehicle centered, fully within frame with padding. Transparent background, no ground, no shadow, no dust, no muzzle flash, no text, no logo. Wide sprite composition. The silhouette must read clearly at 105 pixels wide.
