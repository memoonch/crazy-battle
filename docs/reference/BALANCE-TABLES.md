# Original balance reference

Generated from the five embedded XML resources by `node scripts/inventory-original.cjs`. Values are original internal units; they are not rescaled screen pixels.

## Player weapons

| name | cost | damage | magazine | radius | rate | timeReload |
| --- | --- | --- | --- | --- | --- | --- |
| Cannon | 3 | 10 | 6 | 0 | 10 | 1000 |
| MashineGun | 25 | 10 | 10 | 0 | 4 | 1200 |
| Bazooka | 60 | 40 | 5 | 60 | 30 | 1400 |
| Rocket | 150 | 60 | 8 | 60 | 20 | 1600 |

`Cannon` is granted free at new game despite its data cost of 3. `rate` is a simulation-tick threshold, not milliseconds. Reload values are milliseconds. See GAMEPLAY-SPEC.md for actual timing semantics.

## Defenses

| name | cost | costSale | health | damage | range | radius | rate |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Maxim | 5 | 1 | 35 | 10 | 320 | 0 | 200 |
| Mortar | 10 | 3 | 45 | 20 | 350 | 30 | 240 |
| CannonSmall | 20 | 4 | 65 | 30 | 420 | 0 | 300 |
| CannonNormal | 30 | 5 | 120 | 40 | 450 | 0 | 340 |
| CannonBig | 50 | 10 | 150 | 50 | 480 | 50 | 400 |

## Enemies

| name | health | damage | cost | speed | distance | rate |
| --- | --- | --- | --- | --- | --- | --- |
| BTR | 55 | 20 | 1 | 3 | 300 | 100 |
| BTRLite | 45 | 10 | 1 | 3 | 300 | 100 |
| Tank | 85 | 30 | 3 | 1 | 380 | 100 |
| TankLite | 65 | 25 | 2 | 1 | 320 | 100 |
| RocketBig | 105 | 40 | 4 | 1 | 500 | 100 |
| RocketLite | 85 | 20 | 3 | 1 | 400 | 100 |
| SoldatAK | 10 | 5 | 1 | 2 | 200 | 100 |
| SoldatBazooka | 10 | 20 | 1 | 2 | 230 | 100 |

Enemy `cost` is the money reward; score reward equals maximum health. Speed is internal pixels per simulation tick.

## Consumables

| name | cost | damage |
| --- | --- | --- |
| Atom | 50 | 100 |
| Avia | 20 | 100 |
| Mine | 10 | 100 |

## All 20 waves

| wave | SoldatAK | SoldatBazooka | BTRLite | BTR | TankLite | Tank | RocketLite | Rocket | total | money | points |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 10 | 10 | 100 |
| 2 | 10 | 5 | 0 | 0 | 0 | 0 | 0 | 0 | 15 | 15 | 150 |
| 3 | 10 | 10 | 5 | 0 | 0 | 0 | 0 | 0 | 25 | 25 | 425 |
| 4 | 10 | 10 | 5 | 0 | 0 | 0 | 0 | 0 | 25 | 25 | 425 |
| 5 | 10 | 10 | 10 | 0 | 0 | 0 | 0 | 0 | 30 | 30 | 650 |
| 6 | 10 | 10 | 10 | 0 | 5 | 0 | 0 | 0 | 35 | 40 | 975 |
| 7 | 10 | 10 | 5 | 0 | 5 | 0 | 0 | 0 | 30 | 35 | 750 |
| 8 | 10 | 10 | 5 | 0 | 5 | 0 | 5 | 0 | 35 | 50 | 1175 |
| 9 | 10 | 10 | 5 | 0 | 10 | 0 | 5 | 0 | 40 | 60 | 1500 |
| 10 | 5 | 5 | 5 | 5 | 5 | 0 | 5 | 0 | 30 | 45 | 1350 |
| 11 | 5 | 5 | 5 | 10 | 5 | 0 | 5 | 0 | 35 | 50 | 1625 |
| 12 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 0 | 35 | 60 | 1775 |
| 13 | 5 | 5 | 5 | 5 | 5 | 5 | 10 | 0 | 40 | 75 | 2200 |
| 14 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 40 | 80 | 2300 |
| 15 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 40 | 80 | 2300 |
| 16 | 0 | 0 | 10 | 10 | 5 | 5 | 5 | 5 | 40 | 80 | 2700 |
| 17 | 0 | 0 | 5 | 5 | 10 | 10 | 5 | 5 | 40 | 95 | 2950 |
| 18 | 0 | 0 | 5 | 5 | 5 | 5 | 10 | 10 | 40 | 105 | 3150 |
| 19 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 40 | 80 | 2300 |
| 20 | 0 | 0 | 5 | 5 | 5 | 5 | 10 | 10 | 40 | 105 | 3150 |

`Rocket` in the wave XML maps to enemy `RocketBig`. Money and points are calculated potential kill rewards, excluding spending; wave order is shuffled when InfoObject initializes. Total campaign enemies: 665. Total potential money: 1145. Total potential kill points: 31950.
