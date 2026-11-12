# Original game audio restored

The remaster now uses the original exported MP3 recordings for music and all non-helicopter sound effects. Only the new synthesized rotor loop remains. Synthesized wind, drones, weapon noises, UI tones and result melodies were removed.

38 files were copied byte-for-byte from `decompiled/game/sounds` into `remaster/assets/audio`; `1368_sndChop_sndChop.mp3` was deliberately excluded. The manifest retains the original symbol names. Some exported recordings are available in the manifest without an active gameplay assignment.

| Remaster use | Original symbols |
| --- | --- |
| Menu music / battle music | menuMusic / fonMusic |
| Cannon / machine gun | sndCann1 / sndMax2 |
| Bazooka / rocket | sndRmet / sndRoket |
| Automatic defenses | sndMax, sndMax2, sndMinomet, sndCann1–3 |
| Enemy gunfire | sndAvt1–3, sndGun1–3, sndCann1–3, sndMinomet |
| Explosions / atomic support | sndExp1–3 / sndNuc |
| Air-support approach | sndSvistBomb1–2 |
| Armor / infantry impact | sndImpMet1–3 / sndImpMurd1–2 |
| Infantry death | sndVopl1–3 |
| Reload start | sndVistrelPreload |
| Reload completion / mine placement | sndImpMet3, reused quietly |
| UI click | sndRik1, reused quietly |
| Achievement and result cue | sndGong, reused |

Original usage evidence includes `game/objects/SoundObject.as` (both music loops), `SFXObject.as` (explosions/ricochets), `EnemyObject.as` (death voices), `UnitOMPAtom.as`, `helBz_75.as`, `helPulemetEm_65.as`, defense timeline scripts and `ui/UI.as` (gong). UI/reload-completion/result assignments above are remaster adaptations using original recordings, not claims of identical original cue placement.

Music switches between the two original loops with a short crossfade. Pausing/opening settings retains the current music rather than restarting it. All recordings and the new rotor share the existing master mute, volume buses and limiter. There is no procedural fallback for missing original files; load failures are reported in the console.

Validation: 89 tests pass, including original-file hash equality, helicopter exclusion, event routing, music selection, impact throttling and master mute. Browser checks decoded all 38 files with zero errors. Menu and battle mix peaks before the limiter were 0.3269 and 0.4166 respectively; neither measured mix clipped. Both muted outputs were zero, and unmute restored output. Raw measurements are in `original-audio-menu-report.json` and `original-audio-battle-report.json`. Measurements verify signal behavior; subjective listening balance remains a human check. Normal campaign storage was not used for QA.
