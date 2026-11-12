# Step 6 — full campaign systems

The remaster now runs all twenty recovered wave rosters. The eight enemy types, four player weapons, five defense types and three support items use the values in [the recovered balance tables](reference/BALANCE-TABLES.md). Wave composition totals 665 enemies, 1,145 potential supplies and 31,950 kill points. The balance JSON and cleaned Flash build are unchanged.

## Combat and economy

The fixed 25 ms simulation and original world/display mapping remain in place. Spawn spacing remains 1,500 ms. Riflemen and BTRs apply direct lane damage; bazooka infantry, tanks and rocket vehicles launch delayed projectiles. A living emplacement in that lane takes the attack before the base. Projectile targets are captured when fired; a projectile does not acquire a newly arrived target at impact.

Cannon remains semi-automatic. The machine gun fires while held, using its own rate and ten-round magazine. Bazooka and Rocket capture targets within the recovered 60-unit radius and damage them on arrival. Magazine reloads retain the quantized per-round durations. Weapon switching preserves an encounter's magazine/reload state, preventing free ammo from repeated selection. Empty magazines clear held input; press again after reloading.

The workshop opens during preparation or pause. Weapons are bought once and can be reselected. Five independently selected positions accept Maxim, Mortar, light cannon, field cannon or heavy cannon. Their original HP, range, damage, rate, purchase and sale values are used. Replacing a defense requires selling it and placing another. Repair costs follow each defense's maximum HP. Base repair costs 3, restores 80 HP and retains the original minimum reserve of 5.

Support purchases increase stock. During combat, select an item then click the battlefield:

- Mine stays at the clicked point and deals 100 damage to the first overlapping enemy.
- Air strike crosses the selected row at 20 simulation units per update and repeatedly damages enemies within 80 units during the 150-unit bombing strip.
- Atomic strike immediately deals 100 damage to all spawned living enemies, leaving the queue intact.

Stock counts and selection state update immediately after deployment. Pause freezes projectiles, defenses, aircraft, mines, spawns and reloads. Victory waits for enemies, death poses and in-flight projectiles to finish; a destroyed base cannot also win.

## Checkpoints and intentional compatibility decisions

Preparation transactions save the resulting money, health, ownership, active weapon, support stock and surviving defenses atomically. They become the restart checkpoint. During a wave, rewards, spending and deployments remain encounter state until victory. Quit, reload or retry restores the preparation checkpoint as a whole. This avoids the original mismatch between separately saved money and older inventory.

Surviving defense names/HP are now retained across victories and browser reloads. Older version-1 remaster saves lacking defenses remain valid and load with empty positions. A save cannot restore more than five positions, unknown defense types, invalid HP or an unowned active weapon. The existing unreadable-save preservation and session-only fallback remain intact.

Repair checks both the original reserve guard and the actual price, preventing negative balances on expensive defenses. Area target lists are unique, fixing the original duplicate-primary damage anomaly. Projectile paths use stable parabolic interpolation with recovered horizontal step sizes and arrival tolerance, avoiding the original vertical/leftward curve singularities. These are deliberate corrections rather than balance-data changes.

The final victory produces a wave-21 completion checkpoint. Continue shows “All 20 waves secured” and the final total (kill score plus remaining supplies), with a new-campaign option. No nonexistent wave 21 is started. Achievements and their dedicated presentation remain for the following polish stage.

## Rendering

The first-wave painted assets remain integrated. Bazooka infantry have a distinct launcher. Light/heavy APCs, tanks and rocket carriers use code-drawn layered silhouettes with different armament, health bars, damaged tint, smoke and death states. Non-Maxim emplacements have their own silhouettes. Projectiles, mines, aircraft and blast effects are rendered from simulation state. These added vehicle/emplacement visuals are a first art pass; they have not received the detailed painted treatment of the first-wave assets.

## Verification

`npm test`: **45 passing tests**. New checks cover all twenty exact rosters and reward totals; legal weapon ownership/purchases; each magazine's reload; held-fire thresholds; weapon-switch ammo preservation; captured area targets and delayed impact; all defenses' damage, repairs and sale; enemy projectiles; each support effect; atomic preparation saves, retry and legacy compatibility. Existing first-wave, viewport, save and asset-integrity checks continue to pass.

`node scripts/verify-campaign.mjs`: a deterministic model integration controller starts at wave 1 with zero money and the free Cannon. It targets enemies only after they enter the visible world, observes rate/ammo/reload rules, buys weapons with earned supplies, repairs and purchases heavy defenses. All twenty waves clear without injected damage, rewards, ammo or health. The checked seed sequence ends with 31,950 points and 627 supplies: 32,577 total. This is a simulation verification, not a claim of a human browser playthrough.

Browser verification used the normal campaign page plus a temporary, clearly labeled memory-only fixture for wave 14 and campaign completion. The fixture never accessed browser campaign storage and was removed afterward. Observed checks:

- All three shop tabs open, with correct costs and unaffordable actions disabled.
- Base repair changed HP 600 → 680 and supplies 300 → 297.
- Heavy-cannon placement charged 50 and populated position 1 at 150 HP.
- Mine purchase charged 10 and changed stock 1 → 2.
- Defeat/retry restored the fixture's paid preparation equipment and balances.
- Atomic support consumed stock, cleared selection, disabled the depleted control and damaged the currently spawned roster.
- Mixed late-wave vehicles, smoke and death states rendered without console warnings/errors.
- The completion checkpoint displayed wave 20/20, “All 20 waves secured” and total 32,577, without a start-wave action.

[Workshop screenshot](campaign-shop-preview.png) and [late-wave screenshot](campaign-wave-preview.png) are fixture captures, labeled memory-only in the page. Native fullscreen behavior remains from the earlier viewport stage; it was not retested on a physical display in this pass. Final listening, extended human playtesting, achievements and visual consistency work remain in the next stages.
