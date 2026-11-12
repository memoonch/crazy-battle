# Weapon sound — combat feel step 4

Procedural audio now distinguishes the cannon's heavy report, machine gun's shorter crack, bazooka's low launch and rocket's longer launch noise. Combat shot events pass the active weapon through to the audio manager; effects-volume preview uses the campaign weapon. Armor and infantry have separate hit layers, and destroyed armor adds a low body sound. Impact layering is throttled to one cue per 35 ms to keep mass support hits from flooding the existing 24-voice limit. Explosions have a longer bass tail and debris noise. Reload start has a mechanical follow-through; completion adds a short ready tone.

All sound still passes through the existing Effects and Master gains, master speaker mute and limiter. No extra sound panel, assets, gameplay delays or damage changes were introduced.

Validation: 87 tests pass. New tests verify distinct profiles, safe fallback, impact throttling and different reload cues. Browser measurement rotated all four weapon profiles alongside explosions, armor hits, defenses and reload completion: active pre-compressor peak 0.2123 / RMS 0.01537, muted peak and RMS zero, unmute restored output. No clipping in this sampled mix. See `weapon-audio-report.json`. This is objective signal verification, not a headphone/speaker listening assessment.

The four requested combat-feel implementation steps are now done. A human play/listening session can guide further tuning. Cross-browser testing and release packaging remain deferred as requested.
