# Crazy Battle — gameplay preservation specification

Reference audit: 11 November 2026. This document records the recovered game and current cleaned baseline, before visual remaster work. No combat or balance changes were made during this audit.

## Evidence and scope

- **Code-confirmed:** recovered ActionScript and embedded XML. These are the primary reference for rules and numbers.
- **Runtime-confirmed:** earlier browser checks of startup, tutorial, combat, kill rewards, victory, save restoration, resizing, and fullscreen. These checks cover early waves, not a complete campaign playthrough.
- **Needs verification:** suspicious code, event-order dependencies, later-game edge cases, and animation-specific behavior. These are recorded explicitly below; they are not silently treated as intended design.

The original outer SWF is archived at `original/crazy-battle.swf`. Its embedded game is `original/game.swf`. The playable cleaned baseline is `standalone/build/crazy-battle.swf`. Hashes and SWF metadata are recorded in [audit-summary.json](reference/audit-summary.json).

The current HTML player stretches the native 640×480 stage to a maximum 960×540 and fills fullscreen. This is a presentation adaptation, not a native widescreen battlefield. The future remaster must preserve logical ranges, spawn pressure, and input while making a deliberate native 16:9 composition.

## Game loop and progression

The player defends a left-side base against enemies entering from the right. The helicopter follows the aiming cursor vertically; the player fires its weapon, places purchased defenses, uses consumables, and pays to repair defenses/base.

Flow: main menu → New Game or Continue → tutorial/preparation → active wave → victory/preparation → next wave. Pause supports resume, restart, and quit. Defeat offers restart; completing wave 20 triggers campaign completion/results.

New campaign starts at wave 1 with 800/800 base health, zero money, zero score, zero consumables, and the `Cannon` weapon granted free. Its listed price of 3 is not charged at new game. There is no separate helicopter-health system or helicopter upgrade tree in the recovered model; the helicopter's weapon selection is the upgrade system. Treat new progression features as future scope.

On victory, Main increments `currentLevel`, saves progression, and switches to menu music. Thus the HUD can already show the next wave number on the victory screen. Wave 20 advances the counter to 21, which triggers `GAME_COMPLETE`.

Sources: `Main.as`, `game/Game.as`, `game/objects/InfoObject.as`, `menu/Menu.as`, `ui/UI.as` under `decompiled/game/scripts`.

## Simulation, geometry, and controls

| System | Recovered behavior |
| --- | --- |
| Timeline animation | SWF declares 30 fps. |
| Gameplay simulation | Repeating 25 ms Timer: nominally 40 updates/sec, separate from timeline animation. |
| Native stage | 640×480 internal coordinates; `NO_SCALE`, top-left alignment. |
| Defense slots | Five nodes at grid x=40, y=120; node y offsets 2, 57, 112, 167, 222. |
| Enemy entry | x=680, y=120 + random×253. |
| Spawn interval | One enemy every 1,500 ms while unpaused, until the queued wave is empty. |
| Aim/fire | Mouse position aims. Left press fires; machine gun continues while held. Release clears held-fire state. |
| Rocket weapons | Click selects enemies in the cursor's radius before creating a projectile. |
| Shop panels | Disabled during active combat; enabled while paused/preparing. |
| Consumable use | Click owned item to arm it, then click battlefield to deploy; selection clears afterward. |
| Defenses | Choose affordable type, then click empty base slot. Select a placed defense for repair/sale controls. |
| Base repair | Green repair control in base-health HUD. |
| Fullscreen | Current HTML button or F; Escape exits. This is an added shell feature, not an original combat binding. |

The helicopter enters from offscreen at 7 internal pixels/update until x reaches roughly 130. When cursor y is strictly between 100 and 350, helicopter y becomes cursor y−100. It tilts by one degree/update toward vertical travel, clamped to ±10°. It is not freely steered horizontally.

Enemies are sorted by y for depth. A moving enemy subtracts its configured speed from x until it reaches its stopping threshold. The comparison uses `distance + random×50` every update, so the stopping point is nondeterministic. A shooting enemy selects the defense in its y-associated slot, or the base if that slot has no living defense.

Timers and counters use strict `>` rate comparisons. Do not interpret XML `rate` as milliseconds or as frames at 30 fps. Under uninterrupted nominal updates, repeat intervals generally require rate+1 simulation ticks. First attacks and event order can differ; preserve with explicit timing tests in the rebuild.

Sources: `game/Game.as` (init, createUnit, mouse handlers, updateHuman, updateEnemys); `game/objects/EnemyObject.as`; `ui/UI.as` (pauseHandler); `ui/views/ViewBoughtOMP.as`.

## Enemy roster, waves, and rewards

There are eight enemy types: rifle soldier, bazooka soldier, light/heavy BTR, light/heavy tank, and light/heavy rocket vehicle. All original values are in [BALANCE-TABLES.md](reference/BALANCE-TABLES.md), with the full 20-wave composition and a machine-readable [balance.json](reference/balance.json).

- 20 waves contain **665 enemies** in total.
- Wave 1: 10 rifle soldiers. Wave 2: 10 rifle + 5 bazooka soldiers.
- Light BTR first appears in wave 3; light tank in 6; light rocket vehicle in 8; heavy BTR in 10; heavy tank in 12; heavy rocket vehicle in 14.
- Wave arrays are shuffled when InfoObject initializes. Restarting a wave in the same instance reuses that shuffled composition/order; reloading the game may reshuffle it.
- Every defeated enemy awards money equal to its XML `cost`, and points equal to its maximum health.
- Potential campaign rewards: **1,145 money and 31,950 kill points**, before spending. There is no extra explicit wave-completion money bonus in the inspected code.
- Final displayed total is **kill score + remaining money**. Spending therefore trades immediate survival/power against the final total.

Rifle soldiers and both BTR variants apply direct damage to their target. Tanks, bazooka soldiers, and rocket vehicles create projectiles. Enemy target selection uses `int((enemy.y−grid.y)/53)`; slot placement uses a different 55-unit pitch. Preserve the gameplay lanes deliberately rather than deriving them from new artwork bounds.

Vehicles have normal (>80% HP), damaged (30–80%), burning (0–30%), and death visuals. Soldiers use Run, Shoot, and randomly selected death sequences. Although seven soldier death labels exist, EnemyObject selects only `d1` through `d6`.

Wave victory waits for both the enemy count to reach zero and the death-animation layer to empty. Base health at zero causes defeat, subject to update-order edge cases listed later.

## Player weapons and projectiles

| Weapon | Acquisition | Damage | Magazine | Radius | Rate threshold | XML reload |
| --- | --- | --- | --- | --- | --- | --- |
| Cannon | Free starter; data price 3 | 10 | 6 | 0 | 10 ticks | 1,000 ms |
| MashineGun | Buy for 25 | 10 | 10 | 0 | 4 ticks | 1,200 ms |
| Bazooka | Buy for 60 | 40 | 5 | 60 | 30 ticks | 1,400 ms |
| Rocket | Buy for 150 | 60 | 8 | 60 | 20 ticks | 1,600 ms |

Original identifiers/spelling are retained in reference data. Product-facing names may be improved in the visual stage.

Weapons are bought once and can be reselected. A new purchase becomes active. Loading selects the last weapon in the reconstructed owned array, not a separately saved active selection.

Cannon damages the clicked living enemy directly. Machine-gun held fire checks which enemy display bounds contain the cursor. Bazooka/Rocket gather targets within 60 internal units at click time, then apply damage when the projectile reaches its destination; this is not a fresh collision query at explosion time.

Every shot consumes one magazine round, including a miss. Empty magazine enters RELOAD and clears held-fire state. Ammo refills one round at a time, but firing resumes only when the entire magazine is full; a fresh press may be needed afterward. There is no manually triggered reload binding in the inspected input code.

Reload is quantized to 25 ms updates, using an integer per-round time. Approximate full-magazine durations under uninterrupted simulation are Cannon 1,050 ms, machine gun 1,250 ms, Bazooka 1,500 ms, Rocket 1,600 ms. Actual wall-clock timing depends on browser scheduling. The unused `_timeCurrentReload` field is not the effective reload timer.

Projectiles follow type-dependent straight/curved paths. Their target list is captured ahead of impact. Arrival uses distance<24; turret/player projectile x steps are 10 or 16 depending on type. Preserve impact behavior first; cosmetic trails and new effects must not change damage timing.

Sources: `game/objects/WeaponObject.as`, `BulletObject.as`; `game/Game.as` (mouseDownHandler, updateWeapon); `ui/views/ViewWeapons.as`.

## Defensive emplacements and repairs

| Defense | Buy | Sell | HP | Damage | Range | Area radius | Rate threshold |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Maxim | 5 | 1 | 35 | 10 | 320 | 0 | 200 ticks |
| Mortar | 10 | 3 | 45 | 20 | 350 | 30 | 240 ticks |
| CannonSmall | 20 | 4 | 65 | 30 | 420 | 0 | 300 ticks |
| CannonNormal | 30 | 5 | 120 | 40 | 450 | 0 | 340 ticks |
| CannonBig | 50 | 10 | 150 | 50 | 480 | 50 | 400 ticks |

One emplacement per slot, up to five. Choosing a shop item reserves no money; payment occurs on placement. There are no per-emplacement level upgrades: replacement means sale and purchase of another type.

Automatic targeting checks both range and vertical bands: ±50 for small/normal cannon and mortar; ±90 for Maxim and big cannon. Mortar/big cannon also collect nearby targets around the first selected enemy. The loop can include the primary enemy twice; see anomaly register before reproducing its damage literally.

Maxim applies direct damage. Other defenses launch projectiles. Damage/death states are driven by HP thresholds similar to enemy vehicles.

Base repair: if damaged and money>4, heal 10% of max HP (80) and subtract `round(800/250)` = 3 money. Turret repair: if damaged and money>5, heal maxHP/3 and subtract `round(maxHP/10)`; HP setters clamp to max. Integer coercion can affect exact healing. Turret costs are respectively 4, 5, 7, 12, 15 for the listed types. The affordability guard is not tied to this computed cost, a potential bug.

Sources: `game/Game.as` (clickHandlerGrid, updateTurret, saleTurret, treatBarrage, treatTurret); `game/objects/TurretObject.as`; `ui/views/ViewInventory.as`.

## Consumables

| Item | Price | Stock use | Recovered effect |
| --- | --- | --- | --- |
| Mine | 10 | One per placement | 100 damage to the first overlapping enemy; consumed on trigger. No area-damage loop. |
| Avia | 20 | One per deployment | Aircraft travels across selected y at 20 units/update. During a 150-unit bombing window after target x, each update applies 100 damage to enemies within 80 of that impact. Multiple hits are possible. |
| Atom | 50 | One per deployment | Immediate 100 damage to every currently spawned living enemy; does not affect queued enemies. Visual effect plays afterward. |

Shops permit purchases when money is at least the price. Stock is count-based; no separate cooldown is shown. Deployments require an active, unpaused battlefield press. Mines do not require the player to shoot them. These are finite purchased items, not regeneration-based abilities.

Sources: embedded `omps` XML; `ui/views/ViewOMP.as`, `ViewBoughtOMP.as`; `game/Game.as` (setupOMP*, updateOMP).

## Saves, pause, restart, and failure

The cleaned baseline uses local SharedObject `crazy-battle-standalone-v1`, separate from the original `lso`. Ruffle provides its browser persistence. FOG currency/cloud synchronization, exchange, external scores, and promotional links are removed.

| Saved | Not saved |
| --- | --- |
| Current/next wave, base HP checkpoint, kill score, money | Active enemies, spawn queue progress, in-flight bullets/effects |
| Owned weapon names, consumable stocks, achievement IDs | Placed defenses, their health/slots, active weapon selection, magazine/reload progress |
| `write` marker indicating an existing save | Sound setting, paused state, shuffle/RNG state |

Full saves happen on new game and wave victory. Money changes separately trigger `saveMoney()` through the HUD, so money can persist even when the rest of the wave checkpoint has not advanced. Purchases/stock use and weapon acquisition are not immediately written as one atomic transaction. Reload after an in-wave purchase may restore older inventory with newer money.

Continue loads the checkpoint and reconstructs WeaponObject instances. Restart disposes active enemies, bullets, consumables/effects, and emplacements, restores saved inventory/progress/base health, and returns to preparation. Defeat initially reloads saved info/weapons; the explicit restart handler also restores base health. Exact event-order effects during final-wave completion or simultaneous death need a runtime regression test.

Pause skips simulation updates and spawning. Flash timeline animations and other independent timers are not uniformly stopped; a remaster should define an explicit pause contract.

Sources: `Main.as`; `game/objects/InfoObject.as`; `game/Game.as` (dispose/render/createUnit); `ui/views/ViewProcess.as`; current patches in `standalone/scripts`.

## Achievements, audio, and screens

Six achievement identifiers: two-kill combo, five-kill combo, Defender, bronze, silver, gold. Combo detection uses a separate 25 ms timer and checks kills within <300 ms. Award/reset logic is more complex than the visible “at once” text; test both thresholds before implementing intended behavior.

Medals trigger when currentLevel becomes 5, 10, 20. Since victory increments the level first, these correspond to completing 4, 9, 19 in the ordinary progression path, despite labels saying 5, 10, 20 waves. Defender compares stored start/end HP rather than damage events, so repairs and first-initialization state can affect it.

Audio inventory includes menu/game loops, rotor loop, shots, engine sounds, explosions, ricochets, impacts, cries, bomb whistle, and achievement gong. SoundObject's `soundOn=true` actually mutes globally. Some XML sound fields are not assigned by skin constructors; audible events also live in timeline frame scripts. A modern audio inventory must follow actual uses, not just XML sound strings.

Screens to replace: main menu, tutorial/help, gameplay HUD, preparation tip, pause, achievements, victory, defeat, final results, three purchase panels, health/repair/sale widgets. Online high scores and portal panels are excluded from the cleaned product. Preserve campaign identity/title and functional information while redesigning layout.

Sources: `AchivementsObject.as`, `SoundObject.as`, `SFXObject.as`, `FogTrans.as`, `ui/UI.as`, timeline labels in [timeline-inventory.json](reference/timeline-inventory.json).

## Remaster preservation contract

Preserve initially: enemy counts and roster; reward values; starting health/inventory; weapon acquisition and damage; five defense slots and roles; consumable roles; preparation/combat separation; base-defense loss condition; campaign progression; mouse aiming; local continuation; borderless fullscreen.

Rebuild presentation: native 16:9 composition without stretched character art; independent UI layout; readable font/icon system; consistent art/animation; particles/audio mix; compact tutorials and results. Scale world metrics together or explicitly transform coordinates so native 16:9 does not accidentally increase enemy travel time or weapon range.

Do not automatically reproduce suspicious behaviors. Use the [anomaly and validation register](VALIDATION.md) to decide whether they are compatibility requirements or bugs to fix. No such decisions or balance changes were made during step 1.

## Hand-off to step 2

Use the first-wave roster (rifle soldier, helicopter, starting weapon, base/five slots), full HUD, and one representative defensive emplacement for the concept. Keep the eight-enemy/five-defense silhouette requirements in mind. Native 960×540 is the composition target; the existing SWF remains the behavior comparison baseline.

Reference package: [asset inventory](ASSET-INVENTORY.md), [balance tables](reference/BALANCE-TABLES.md), [validation register](VALIDATION.md), and [data exports](reference/balance.json). Step 2 should produce a visual guide and gameplay concept before any full art production or engine replacement.
