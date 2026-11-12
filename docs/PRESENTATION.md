# Step 7 — presentation and campaign honors

## Implemented presentation

Six painted vehicle sprites replace the code-drawn APC, tank and rocket-carrier silhouettes. Each light/heavy variant has distinct armor and armament. Four painted artillery sprites replace the mortar and cannon silhouettes. All are transparent cutouts generated with the built-in image-generation tool and copied into the workspace. [Exact prompts and provenance](../remaster/assets/art/phase7-prompts.json), alpha bounds, dimensions and SHA-256 hashes are retained beside the images. The first-wave artwork remains unchanged.

Vehicle aspect ratios are preserved. Their existing simulation positions and hit bounds remain independent of sprite dimensions. Movement bob, recoil flashes, damage tint, smoke, health indicators and death fades are cosmetic. Atlas cells are partitioned with integer boundaries, including the 1024-pixel image split into three rows. The loader now fetches seven local PNG assets and three local JSON resources.

The main menu adds a commander illustration and direct access to the Field Manual and Medals. The manual explains aiming, held fire, reloads, defenses, support deployment, repairs, pause/fullscreen and checkpoint behavior. It returns to the scene it opened from and keeps an encounter paused. Wave briefings now list the incoming roster. The workshop uses a two-column illustrated catalog; placed defenses retain repair/sale controls. Pause utilities are compact, and victory results include newly earned honors. The final victory title reads “Campaign secured.”

Panels fade in briefly. The in-game Reduced motion setting disables these transitions, alongside the existing reduced battlefield motion. An authored two-note audio cue accompanies an achievement; existing volume buses and voice limits remain in effect. No extra external audio or networking was added.

## Achievement rules

The recovered identifiers are preserved. These explicit rules replace the original ambiguous combo resets and early medal triggers:

| Honor | Rule |
| --- | --- |
| Double strike | Two kills in a rolling interval shorter than 300 simulation ms. |
| Overwhelming force | Five kills in that same rolling interval. Same-tick area kills count. |
| Defender | Complete a wave with zero damage events to the base. Defense damage does not disqualify it; repairing base damage cannot restore eligibility. |
| Bronze service | Complete wave 5. |
| Silver service | Complete wave 10. |
| Gold service | Complete wave 20. |

Each honor is awarded once per campaign. Combo clocks freeze with the simulation, including while using the manual, shop or settings. Pending honors appear immediately in Medals and in unlock notifications. Victory saves them in the same checkpoint as inventory and progress. Retry, quit or reload before victory discards that wave's pending honors. Achievements grant no money, damage or score bonuses.

## Verification

`node --test --test-isolation=none remaster/tests/*.test.js`: **51 passing tests**. Six new achievement tests cover same-tick thresholds, the exact 300 ms boundary, five-kill window membership, one-time service medals, repair-resistant Defender eligibility, pause/retry and checkpoint persistence. Existing campaign and asset tests cover both new atlases, including real alpha, dimensions, hashes and cell bounds.

`node scripts/verify-campaign.mjs` still completes all twenty waves with 31,950 kill points and 627 remaining supplies (32,577 total) for its fixed seed/controller. This matches Step 6. There are no balance-data or economy changes in this stage. The direct Node test command was used because `npm` is unavailable in this shell.

Browser checks used a temporary memory-only fixture, without reading or writing the active campaign save:

- Main menu, Field Manual, earned/locked medal cards, wave-14 briefing and illustrated defense choices rendered correctly.
- All six medals and all five defense choices were visible in the revised layouts.
- Painted vehicles, artillery, damage smoke and death visuals rendered in a mixed late-wave battle.
- Opening the manual from pause and returning preserved the exact simulation diagnostic time/state.
- An Atomic strike triggered “Overwhelming force”; Medals changed from 3/6 to 4/6 with that honor marked earned.
- Reduced motion applied the viewport class and returned to pause after saving settings.
- A simulated normal first-wave victory rendered the reward totals, saved next-wave message and “NEW HONORS · Defender” result.
- Console inspection returned no warnings or errors during these checks.

Fixture captures: [painted battle](phase7-battle-preview.png), [workshop](phase7-workshop-preview.png), [medals](phase7-medals-preview.png). They are labeled memory-only. The temporary fixture files were removed after verification. The user's already-running game was preserved rather than reloaded mid-wave.

Step 8 remains the extended human browser playthrough, device/fullscreen checks, performance profiling, accessibility review, visual consistency checks and listening pass. The brief scripted checks here do not replace that release QA.
