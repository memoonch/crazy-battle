# Core combat slice — step 4

Completed 11 November 2026. Play at [the modern preview](http://127.0.0.1:8765/remaster/) with `node server.cjs` running. This is a playable **first wave**, with temporary graphics and synthesized audio. The full campaign and upgrades are not implemented in this stage.

## Player flow

1. New Campaign / Continue → preparation → Start Wave.
2. Click a rifle soldier to fire the starter Cannon. Holding does not autofire: Cannon is semi-automatic.
3. Each hit kills one 10-HP rifle soldier, awards 10 score and 1 supply. Misses still spend ammo.
4. After six shots, the magazine automatically refills; firing is blocked until all six rounds return.
5. Use Pause or P (Escape also pauses outside fullscreen). Resume continues the same encounter; Restart discards the current run and restores its checkpoint.
6. Defend the base until all ten enemies are eliminated. Victory saves the wave-2 checkpoint atomically. Defeat leaves the previous checkpoint intact.
7. Return to Outpost after victory, or Replay Wave 1 from the original starting state. Replay starts a new campaign and retains the previous campaign as the existing one-record backup. Wave 2 combat and purchases remain gated until the campaign stage.

The preview footer states this scope. No hidden combat/test APIs, auto-aim, test rewards, or progression cheats are exposed.

## Simulation implementation

`remaster/src/combat.js` is DOM-free. It contains the simulation, seeded random generator, fixed-step accumulator, and original-world/display coordinate conversion. It consumes a copied checkpoint and the recovered JSON balance data.

| Rule | Implementation |
| --- | --- |
| Simulation rate | Fixed 25 ms / nominal 40 Hz; independent of render FPS. |
| Wave | Original first-wave composition: 10 SoldatAK enemies. |
| Spawn | One every 1,500 ms at original x=680 and y=120+random×253. |
| Movement | Original speed 2 units/update; stop comparison uses distance 200+random×50 each movement update. |
| Enemy attack | Original damage 5; counter threshold 100 updates, with strict greater-than comparison. First attack is ready after stopping. |
| Base | 800 starting HP, clamped to zero. No helicopter HP or new repair economy. |
| Player | Original Cannon: damage 10, magazine 6, rate threshold 10. |
| Reload | Quantized per-round refill: 175 ms × 6 = 1,050 ms under uninterrupted simulation. No firing during partial refill. |
| Rewards | Per kill: maximum enemy HP (10) as score, XML cost (1) as money. No additional victory bonus. |
| Victory | All queued/spawned enemies eliminated, then temporary death visuals finish. |
| Defeat | Base HP zero. Terminal state prevents simultaneous victory/defeat. |

Original logical coordinates remain 640×480. Positions are mapped into the native 960×540 composition, with separate x/y positional mapping to use the wider field; individual character artwork is still drawn at uniform proportions. Original travel speeds, distances, spawn timing and damage are not multiplied by screen dimensions.

Position mapping: native x = 145+(original x−100)×815/540; native y = 240+(original y−122)×48/55. The five temporary base positions were aligned with this layout. Character hit regions are explicit world rectangles, separate from canvas pixels and sprite texture bounds. Overlapping targets resolve to the front-most (highest-y) living soldier.

`main.js` advances the fixed-step model before rendering. Per-frame elapsed time is capped at 100 ms; the reusable clock itself bounds catch-up to 250 ms. Hidden pages and lost focus pause combat instead of accumulating combat time. Scenic fullscreen extensions remain outside the logical battlefield.

## Input and state safety

- Pointer-down presses are queued until a simulation update, so a quick down/up between rendered frames still fires once.
- Release clears held state without deleting an already queued valid press. Cancellation, lost focus and scene changes clear pending input.
- Held input cannot turn Cannon into an automatic weapon. Clicks inside the rate/reload lock do not consume extra ammo.
- Pause freezes spawn time, enemy position/attacks, reload, corpse/effect lifetimes, helicopter following and elapsed simulation time.
- Settings opened during combat return to Pause, never silently resume combat. Escape works from the focused settings slider as well as the canvas.
- Quit discards the in-progress run without overwriting its checkpoint. Restart reconstructs the simulation from its copied starting checkpoint.
- Only victory commits updated health, score, money and next wave in one validated save record. No partial in-wave money-only writes are introduced.

The existing versioned save format and Flash save isolation remain unchanged. Session-only storage fallback reports that condition instead of incorrectly claiming a persistent victory save.

## Presentation and temporary content

Canvas now draws rifle soldiers with procedural run/attack/death poses, helicopter entry/following/tilt, short bullet traces and hit/miss impact marks. Native HTML HUD values update without rebuilding the controls every simulation tick. It shows kills/total, points, money, base HP, ammo and Ready/Reloading state.

Pause, victory and defeat have functional dialogs with focus management and explicit actions. The first-wave preparation teaches click-to-fire and automatic reload. Synthetic shot, base-hit, reload-complete, victory and defeat tones use the existing effects/master gain buses.

**Temporary decisions:** soldier hit rectangle is ±12 original x units and 38 original units high; death fade is 350 ms; traces/impact durations and sounds are placeholders. These are documented first-slice choices, not final extracted Flash animation/hitbox parity. Step 5 should validate final art silhouettes/hit feedback against these logical regions without changing rewards or damage timing accidentally.

**Deliberate bug handling:** base death takes priority over an otherwise clear board, preventing contradictory terminal outcomes. The original code's ambiguous clear-before-dead ordering is not reproduced. Other campaign/economy anomalies in VALIDATION.md remain future implementation decisions.

## Verification

Run `node --test --test-isolation=none remaster/tests/*.test.js`. All **25 tests pass** (10 foundation tests, 15 new combat tests).

Combat tests cover spawn intervals/counts; exact single-kill rewards; ammo spent on misses; semi-automatic/rate behavior; complete reload timing; full pause freeze; a complete perfect first wave and persistence of its next checkpoint; death-animation victory delay; unopposed defeat; exclusive terminal state; clean retry; identical seeded simulation at 30/60/144 rendering FPS; coordinate round-trip; bounded catch-up; and rejection of unimplemented wave/weapon content.

Browser checks observed:

- Start Wave opens live combat; soldiers enter, stop, and attack the base.
- A Cannon hit updates to 10 points, 1 supply, 5/6 ammo and one elimination; another hit updates to 20/2.
- Base damage reaches defeat and shows the result/retry screen.
- The browser also reached the post-victory preparation checkpoint at wave 2 / 100 points / 10 supplies / full base health.
- An isolated `localhost` playtest (separate browser origin/storage from the main `127.0.0.1` campaign) verified Pause freezing at 0.00 simulation seconds across checks, Resume, empty-magazine Reloading state, and return to 6/6 Ready.
- Restart from a damaged base restored 800 HP, 6 ammo, zero kills, ten queued enemies and 0.00 simulation seconds.
- Opening settings from Pause and escaping from the focused slider returned to Pause without advancing time.
- Startup and combat checks produced no warning/error console entries at inspection.

The main campaign save was not reset by the isolated playtest. Subjective sound balance, all browser/device combinations, the remaining seven enemy types, extra weapons, upgrades and later waves are not claimed as complete.

## Step 5 handoff

Replace the temporary first-wave presentation with the approved art direction: layered painted battlefield and five-slot base, finished rifle soldier states, finished helicopter/starter weapon, HUD styling, impacts, audio and polished tutorial/results. Keep the model and its tests stable. Add one Maxim emplacement only as the planned placement/targeting/repair visual proof, rather than expanding the whole campaign during the art pass.
