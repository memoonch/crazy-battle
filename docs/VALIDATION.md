# Original behavior — anomaly and validation register

Audit date: 11 November 2026. Code findings are not automatically approved changes. Browser smoke tests from the earlier cleanup/display work are identified separately; no full campaign completion is claimed.

## Confirmed browser baseline

| Check | Evidence/status |
| --- | --- |
| Original wrapper loads | Earlier browser test: preloader → Continue → main menu. |
| Cleaned standalone starts | Earlier cleanup test: direct menu, no FOG banners/preloader. |
| New Game / tutorial / combat | Earlier cleanup test passed. |
| Kill rewards | Earlier display test: rifle kill added 10 score and 1 money. |
| Enemy waves, helicopter, base damage | Observed in earlier early-wave browser tests. |
| Victory / progression | Earlier cleanup test reached later early waves. |
| Reload / Continue | Earlier cleanup test restored wave 2, 100 points, 10 money. |
| Widescreen | Earlier measured outer display 960×540 with stage remaining 640×480. |
| Fullscreen and exit | Earlier measured borderless 1680×1050 frame; menu input, mouse aim/fire, Escape exit checked. |
| Complete campaign / every purchase | Not runtime-verified. Balance/logic recovered from code. |

## Findings requiring explicit treatment in the rebuild

| ID | Source behavior / risk | Recommended treatment to evaluate | Verification |
| --- | --- | --- | --- |
| R01 | Money saves on each HUD refresh; weapons/stock/checkpoint only on full save. Purchases can lose inventory across reload while retaining spending. | Atomic campaign snapshot on transaction/checkpoint; versioned saves. | Buy weapon/consumable, reload before victory, compare stock/money. |
| R02 | Placed defenses absent from save schema; restart/quit dispose them. | Define whether continuation restores defenses; keep original behavior as reference. | Place damaged defense; reload/restart/advance wave separately. |
| R03 | Repair guard is money>5, but cost can be 7/12/15; money setter clamps negative to zero. | Require actual repair cost before allowing purchase. | Repair each expensive defense with 6 money. |
| R04 | Base repair costs 3 but requires at least 5 money. | Display exact cost and intentional threshold. | Compare money 3/4/5 at damaged base. |
| R05 | Area-defense target collection includes primary enemy then loops over all enemies including primary. | Deduplicate target IDs unless double damage is intended. | Isolated target hit by Mortar/CannonBig, measure HP. |
| R06 | Milestone medals trigger currentLevel 5/10/20, after ordinary prior-wave victories. | Award after completing stated wave count. | Complete waves 4/5, 9/10, 19/20. |
| R07 | Defender compares HP snapshots; combo counters reset on award and use independent timer. | Track damage taken and explicit kill timestamps. | First wave, repaired wave, two/five simultaneous kills, pause between kills. |
| R08 | Game checks wave-clear before base-dead; simultaneous outcomes may favor victory. | Define tie-breaking rule. | Kill last enemy on same update as lethal base damage. |
| R09 | Victory increments to 21 and triggers campaign completion while victory handlers also run. | One explicit terminal campaign state. | Complete wave 20, then Continue/reload/Next. |
| R10 | Hit tests/localToGlobal are tied to native geometry; machine-gun hitTestPoint receives local cursor coordinates. | Use consistent world coordinates, independent hit shapes. | Offset/scaled stage, fullscreen, moving targets, all five slots. |
| R11 | Cannon target array, projectile fallback condition, turret target-removal loops contain suspicious conditions/index handling. | Target lifecycle and projectile tests before literal port. | Misses, killed projectile target, empty lists, multiple dead targets. |
| R12 | Mouse-up is attached to battlefield, not a global pointer capture. | Clear firing on release outside, blur, pause, visibility loss. | Hold fire, leave canvas, release, return. |
| R13 | Simulation pauses but independent timeline/combo timers can continue. | Explicit pause policy for gameplay/audio/effects. | Pause during rocket travel, reload, combo, death sequence. |
| R14 | Sound flag is inverted; audio also runs in embedded frame scripts. | Explicit master/music/SFX settings and event-based playback. | Toggle mute across scenes and pause/resume; check loop cleanup. |
| R15 | Skin-class sound properties are not assigned from XML in inspected constructors. | Inventory actual event/timeline usage before replacing sounds. | Listen to each enemy, weapon, turret and effect. |
| R16 | Weapon ownership activation loop can overwrite SOLD state when iterating other owned weapons; equality affordability branch differs from refresh. | Ownership and affordability as independent model fields. | Own multiple weapons; exact-price balances; save/continue/switch. |
| R17 | Mine removes itself inside a forward loop without consistent index correction; overlapping items may update a tick later. | Stable entity-removal queue. | Multiple adjacent mines triggered on same update. |
| R18 | Reload fills by quantized per-round timer; held fire clears on empty. | Preserve initial feel; decide whether auto-resume is desirable later. | Empty each weapon while held and after releasing. |
| R19 | Original data has 665 enemies but no explicit extra wave bonus; apparent reward differences must not be invented. | Compare total rewards with generated wave table. | Complete representative waves with spending disabled for the test. |

These recommendations are candidate implementation decisions, not changes made to the baseline.

## Acceptance checks for the future playable slice

1. New campaign matches starting state: wave 1, HP 800, money 0, score 0, starter weapon, no consumables.
2. Wave 1 spawns 10 rifle soldiers at 1.5-second intervals; pause does not consume the queue.
3. A 10-HP rifle soldier dies to one 10-damage starter hit, awards 1 money and 10 score exactly once.
4. Enemy attack interval and travel pace match a timed baseline recording, rather than interpreting XML rates as milliseconds.
5. Magazine empties, reloads, and resumes according to the agreed rule; missed shots still consume ammo.
6. All five defense slots work and targets choose defense/base correctly.
7. Shop affordability, placement charge, repair charge, and sale reward match the reference or approved bug fix.
8. Mine, airstrike, and Atom stock decrement once; effects match documented targeting semantics.
9. Victory advances once; defeat cannot produce both victory and defeat; final wave terminates cleanly.
10. Save/reload, restart, quit, and Continue follow the explicitly chosen checkpoint policy.
11. Aiming aligns with visible targets at native 960×540, narrow-window scaling, and fullscreen.
12. No FOG/external-score/network dependency returns in the remaster.

Step 1 provides the reference specification and complete static inventory. Exhaustive playtesting of later waves and all these edge cases belongs to implementation validation; it has not been represented as already completed.
