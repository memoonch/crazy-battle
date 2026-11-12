# Control clarity and master mute

Disabled shop buttons explain “Pause to open the shop” during combat. Shops remain disabled until preparing or paused; the explanation does not enable the action. Completed/lost encounter controls explain when shops are available instead.

Mine, Air strike and Atomic strike tooltips include their name, effect, price and live available stock. The message distinguishes buying empty stock, waiting for combat, selecting a deployment, and cancelling an armed item. Repair tooltips distinguish full health, a lost base, needing to pause, insufficient supplies, and an available repair. The original reserve rule is stated accurately: have at least 5 supplies available, pay 3, restore up to 80 HP.

Tooltip wrappers accept hover and keyboard focus even around disabled buttons. Actual disabled actions stay disabled. Descriptions are linked with aria-describedby, remain within the game viewport, and update only when their message changes. Existing keyboard modal focus handling includes focusable explanation wrappers.

The single speaker in the top HUD now toggles all audio. It does not open Settings, add a separate gear, pause/resume, or replace the current scene. Muting zeros the master bus immediately, covering ambience, music, rotor, effects and UI cues. Unmuting restores the selected channel volumes. The icon, accessible label, pressed state and brief status message reflect the action. Settings remains available from the main and pause menus.

The independent muted preference persists alongside existing volumes and campaign state. Older settings without that field load as unmuted. Changing a volume while muted does not bypass master mute.

Validation: 70 passing tests cover hint states, support costs/stock, disabled wrappers, immediate master gain control, volume restoration, mute save/reload and legacy settings, alongside all existing combat checks. The twenty-wave integration still yields 31,950 points plus 627 supplies. In a temporary memory-only browser fixture, keyboard focus revealed the insufficient-funds repair message, disabled-shop explanation and support description; the speaker toggled muted/unmuted labels without opening a dialog. Console inspection found no warnings/errors. The temporary fixture is removed after review, and the active campaign save is untouched.

[Shop explanation preview](control-shop-hint-preview.png) · [Support explanation preview](control-support-hint-preview.png).
