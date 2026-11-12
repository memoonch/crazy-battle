# Release QA — 12 November 2026

Status: campaign and sampled controls pass; fullscreen visual coverage remains unresolved in the embedded browser capture. This is not a blanket release approval.

## Verified

- 80 automated tests pass, including save conflicts, sprite caching, targeting, achievements, purchases, support and checkpoint behavior.
- A browser automation controller completed all 20 waves through the production scenes, combat and renderer: 665 eliminations, 31,950 points, 510 remaining supplies. It used normal input queues, ammunition, reloads, purchases and rewards. This was an automated campaign, not a manual human playthrough.
- Reload restored the completed campaign and showed the final result without starting wave 21.
- Manual browser samples verified a base repair (600 to 680 HP for 3 supplies), weapon purchases/equipping, heavy cannon placement and sale, and checkpoint restoration after reload.
- Bought all three support types and deployed each on the battlefield. Stock decreased correctly. Atomic support earned Double strike and Overwhelming force. Restart restored preparation health, balance and support stock. Defeat showed the loss screen; Retry restored its 5-HP checkpoint.
- Pause stopped combat and reopened shops. Compact 768-pixel browser layout retained the game proportions; the QA toolbar made this test page taller than production.
- Audio analyser measured active peak 0.1884, muted peak 0, and nonzero restored output. No clipping occurred in that measured mix. This checks the signal path, not subjective sound quality.
- A second deterministic Node campaign completed with 31,950 points and 627 supplies; different controller choices and shuffles explain the different balance.

## Fixes made

1. Save settings from an older tab could roll back newer campaign progress. Settings now merge into the latest stored record. Stale campaign checkpoints preserve the newer stored campaign and show a reload/session-only warning. Explicit new campaigns preserve the latest campaign as backup. This protects against stale state; it does not provide a transactional cross-process lock.
2. Repeated canvas filters and shadows slowed crowded scenes. Enemy edge and damage effects now use a bounded sprite cache without changing targeting or combat rules.

## Performance sample

Embedded Chromium, DPR 1, game canvas 960 × 540; 180 measured frame intervals per case following warmup.

| Scene | Mean render CPU | 95th percentile CPU | Median frame interval | Intervals over 33 ms |
| --- | ---: | ---: | ---: | ---: |
| 10 enemies | 1.38 ms | 3.1 ms | 16.7 ms | 0 |
| 40 enemies plus effects | 1.77 ms | 3.8 ms | 16.7 ms | 0 |
| 40 enemies, reduced motion | 1.51 ms | 2.5 ms | 16.7 ms | 0 |

These synthetic renderer samples are approximately 60 fps on this machine, not a guarantee for every device. Earlier crowded captures were approximately 30 fps, but viewport sizes differed, so no controlled speedup ratio is claimed. Raw campaign, timing and audio data are in `release-qa-report.json`.

## Remaining visual check

Fullscreen entered and exited with F, and the canvas DOM bounds/backing size reported 1280 × 900. The embedded browser screenshot nevertheless displayed black space beyond a smaller rendered region. Its cause was not established. Native fullscreen coverage and Escape handling need a normal-browser check before release. Subjective audio listening and physical-device testing also remain outside this pass.

## Reproduce

Run `node scripts/create-browser-qa.cjs`, start `node server.cjs`, then open `/remaster/tests/browser-fixture.html`. This generated page uses `crazy-battle.release-qa.v1`, separate from the normal campaign save. Its explicit fixtures grant test resources; the automated 20-wave run starts a fresh campaign and does not grant extra combat resources. Generated fixture HTML/JS are temporary; the generator and runner remain available.
