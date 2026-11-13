# Painted ammunition HUD

Replaces the generic CSS bullet with four weapon-specific transparent ammo sprites. Cannon uses a shell cartridge, machine gun uses a cartridge group, Bazooka uses a finned projectile, and Rocket uses a red-tipped rocket. Numbers, magazines, reloads and combat behavior remain unchanged. The decorative icon is hidden from assistive technology; the numeric ammo display remains available.

Asset: remaster/assets/art/ammo-equipment-v1.png. Registered source bounds and hash: node scripts/register-ammo.cjs. The SVG wrapper only crops the PNG atlas; it does not substitute vector art.

Validation: inspected all four weapons on the battlefield HUD in the browser, including fullscreen. Icons fit beside the live count without overlap. No console errors. 111 tests pass, including texture hashes, alpha, dimensions and cell bounds. Screenshot: painted-ammo-hud-preview.png.

Generated using the built-in image generation tool, transparency enabled. Final prompt:

> Use case: stylized-concept. Production 2D HUD ammo sprite atlas for hand-painted military battlefield game. Transparent background. Exactly four isolated ammunition icons arranged in a strict 2 by 2 equal grid, each centered within its own quadrant with generous transparent gutters. Top left: one chunky brass cannon cartridge with dark steel pointed projectile. Top right: three brass machine gun rifle cartridges close together. Bottom left: one olive drab bazooka grenade projectile with short stabilizer fins. Bottom right: one olive drab unguided rocket with red pointed nose and small tail fins. All projectiles upright pointing straight UP. Warm weathered brass and olive metal, dark outlines, realistic illustrated game texture with clear highlights. Simple crisp recognizable silhouettes readable at 16 to 24 pixels tall. No weapons, no crates, no text, no labels, no glow, no background, no shadows outside objects, no explosion. Each item fully contained in its quadrant.
