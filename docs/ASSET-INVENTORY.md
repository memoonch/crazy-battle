# Crazy Battle — asset inventory and art handoff

Audit date: 11 November 2026. Counts are for the embedded game (`original/game.swf`), excluding the outer FOG wrapper. The archived originals remain unchanged.

## Inventory summary

| Resource | Count | Location / use |
| --- | --- | --- |
| Recovered ActionScript files | 267 | `decompiled/game/scripts`; logic, timeline scripts, asset wrappers, old integrations. |
| Exported vector shapes | 874 | `decompiled/game/shapes`; SVG parts, not 874 complete game objects. |
| Bitmap images | 17 | `decompiled/game/images`; 15 PNG, 2 JPEG. |
| Sound exports | 39 | `decompiled/game/sounds`; MP3, including 2 named menu/game music classes. |
| Font exports | 7 | `decompiled/game/fonts`; exports include duplicate families/subsets. |
| Text exports | 76 | `decompiled/game/texts`; timeline text content, not all localized runtime strings. |
| Balance resources | 5 | `decompiled/game/binaryData`; XML content wrapped as binary assets. |
| Symbol mappings | 202 | Original SymbolClass mappings; includes nonvisual classes and audio/data/font symbols. |
| Sprite timelines | 436 | Parsed DefineSprite tags, including nested unnamed animation clips. |
| Reference previews | 30 | [Preview index](ASSET-PREVIEWS.md); first frames only. |

Detailed files:

- [asset-inventory.csv](reference/asset-inventory.csv): every exported image/shape/sound/font/text/data file, character ID, mapped class if present, size, PNG dimensions/SVG viewBox, SHA-256. JPEG dimensions are not extracted by this script.
- [symbol-inventory.csv](reference/symbol-inventory.csv): class → character ID, SWF definition tag, timeline frame count and frame labels. Classes reference complete compositions that may use many separate shape parts.
- [timeline-inventory.json](reference/timeline-inventory.json): all 436 timelines with frame labels, plus top-level timing and tag counts. Timeline length is not the duration of each nested animation.
- [balance.json](reference/balance.json), [raw XML](reference/balance), [balance tables](reference/BALANCE-TABLES.md), and [wave-inventory.csv](reference/wave-inventory.csv).
- [audit-summary.json](reference/audit-summary.json): file counts, SWF version/timing, source/build hashes.

## Art families to preserve and replace

| Family | Existing symbols | Required visual coverage |
| --- | --- | --- |
| Environment/base | Background (988), ContentBarrage (892), Node and HUD scenery | Dirt battlefield, forest/sky layer, left fortification, five emplacement positions. Separate visual bounds from gameplay ranges. |
| Player helicopter | UnitHeli (889), nested helicopter/weapon/rotor clips | Entry, vertical following/tilt, rotor, weapon attachment and firing. No helicopter damage model found. |
| Infantry | UnitSoldatAK (440), UnitSoldatBazooka (1387) | Run, shoot, multiple death variants; distinct rifle/bazooka silhouettes. |
| BTR vehicles | UnitBTRLite (1349), UnitBTR (926) | Stay/move/shoot, normal/damaged/burning variants, death. |
| Tanks | UnitTankLite (1043), UnitTank (634) | Same vehicle-state coverage; light/heavy differentiation. |
| Rocket vehicles | UnitRocketLite (1178), UnitRocket (556) | Same vehicle-state coverage; long-range heavy/light differentiation. |
| Defenses | UnitMaxim (819), UnitMortar (1142), UnitCannonSmall (1243), UnitCannonNormal (1087), UnitCannonBig (1262) | Full/damaged/burning idle and shooting; death; five distinct roles. |
| Consumables | UnitOMPMine (1381), UnitOMPAvia (639), UnitOMPAtom (1289) | Placed mine/trigger, aircraft bombing pass, large blast; stock icons and targeting preview. |
| Projectiles/effects | ContentSmallBullet (949), ContentLargeBullet (1313), ContentMediumBullet; ContentBulletSFX (1190), ContentLargeSFX (689), ContentSmallSFX (1189), ContentSmokeSFX (992) | Projectile silhouettes, muzzle/impact flashes, explosions, smoke; animation timings tracked separately from new visual style. |
| Commander/medals | Tutorial/main-menu commander artwork; ContentAchivement* classes | Tutorial portrait, result illustration, six achievement badges. These are UI characters, not an additional combat unit type. |

Exact states are in the symbol/timeline inventories. Vehicle labels include `stay`, `move`, `stayBr`, `moveBr`, `stayFire`, `moveFire`, `die`, `shoot`, `shootBr`, `shootFire`. Defense labels include `full`, `break`, `fire`, `die`, `shootFull`, `shootBr`, `shootFr`.

Infantry has seven death labels per unit, though current code randomly selects six. Vehicle timelines are typically 99 frames; defense timelines 70. Those counts include label-spaced state containers and nested animation; they are not a request for 99/70 unique flat sprites per unit.

## UI replacement inventory

| Area | Required elements | Reference symbols/classes |
| --- | --- | --- |
| Main menu | Title, New Game, Continue, sound/settings entry | ContentScreenMainMenu (265), ButtonNewGame, ButtonLoad, ButtonSoundOffOn |
| Gameplay HUD | Wave number/total, score, money, menu, sound, base HP, repair | ContentScreenUIGame (647), ViewProcess, ViewBarrageHealth, ViewWeaponCross |
| Purchases | Defense, consumable, helicopter-weapon panels; affordable/disabled/owned states | ContentViewInventory, ContentViewOMP, ContentViewWeapon; ButtonSkin*, ButtonInventory, ButtonOMP, ButtonWeapon |
| Deployment | Five slots, placement ghost, selected-defense health/repair/sell, selected consumable, ammo/reload display | Node, ViewHealth, ViewBoughtOMP, ViewWeaponCross |
| Teaching | First tutorial and subsequent preparation tips | ContentScreenHelp (465), ButtonStartLevel, FogTrans string table |
| Pause | Resume, restart, quit | ContentScreenPause (699) |
| Results | Victory/next, defeat/restart, final score/return | ContentScreenLevelVictory (945), ContentScreenLevelFailed (846), ContentScreenCredits (269) |
| Achievements | Six medal types and progress/view panel | ContentScreenAchivements (1356), ContentAchivement* |

Bottom-panel labels can be misleading: source wiring maps the first opener to defense inventory, second to consumables, third to player weapons. The concept should use explicit role labels and icons rather than blindly copying old text.

## Audio inventory

- Music: `menuMusic`, `fonMusic`.
- Helicopter: `sndChop` loop.
- Combat families: `sndGun*`, `sndCann*`, `sndAvt*`, `sndMax*`, `sndTank*`, `sndRoket`, `sndMinomet`, `sndDisel*`.
- Impacts/effects: `sndRik*`, `sndImpMet*`, `sndImpMurd*`, `sndExp*`, `sndNuc`, `sndSvistBomb*`, `sndVopl*`, `sndGong`.

These names classify the exported references; they do not prove that every file is used at runtime. Frame scripts must be considered alongside ActionScript object code. Listen and assign an explicit event map during audio production. Raw XML sound identifiers such as `soundCracker` are not a reliable runtime file mapping.

## Fonts and text

Exported font names: Steamer, Arial, Aachen BT, Cooper Std Black (including a Font1 wrapper), and Century Gothic (two exports). There are seven files, not seven unique type families. Runtime labels are also assigned through `FogTrans.as`, which is a local string lookup despite its historical name. Its use does not imply an active FOG service.

New art direction should choose readable UI typography and a deliberate title font; avoid retaining the original tiny outlined/slanted body text. Existing font/audio/art exports are reference materials; provenance/licensing for redistributed or replacement assets must be tracked before release.

## Excluded from the remaster's player-facing art work

FOG preloader/logo, promotional footer, coin exchange/buy-coins controls, external portal links, and online leaderboard screens. Original files retain these for reference; the cleaned build hides/disconnects them and replaces remote API code with inert compatibility classes. Their presence in the archive does not make them new production requirements.

## Suggested first concept composition

One native 960×540 battlefield showing the fortified left base and five slots, helicopter, rifle enemy, a representative BTR silhouette, one defense, compact top HUD, bottom loadout, and a small contextual teaching prompt. Represent the complete visual hierarchy without adding mechanics or deciding balance fixes in the concept stage.

Create the modern look from consistent families and state requirements above. Do not upscale the entire old screen as the final art pipeline; separate backgrounds, characters, effects, hit regions, and UI. The preview images show old asset structure, not the proposed premium style.

## Reproduce the audit

With binaryData and symbolClass exports present, run `node scripts/inventory-original.cjs`. It reads the preserved files and regenerates tables, CSVs, XML copies, JSON, hashes, and the preview index when preview files exist. It does not change SWFs or gameplay.

Previews were exported with JPEXS FFDec 26.4.0 using explicit `characterId:1` frame selection for the 30 IDs listed in ASSET-PREVIEWS.md. They are static references; complete production animation extraction has not been claimed.
