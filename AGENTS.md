# Player-facing release notes

The main menu displays the version and a clickable What's new popup above the version. Their single source is `remaster/src/release-notes.js`.

The game is currently in pre-launch development. Keep the version at **1.0** and update the existing 1.0 highlights as features are added or polished. Do not create 1.1 or later entries during this initial build. Start new versions only after the user confirms the initial build has launched or explicitly requests a new release version.

After launch, add concise new release entries at the front of `RELEASES` for player-facing releases and preserve earlier entries. Group changes into releases rather than bumping the version for every development edit. Do not bump for internal-only refactors, tests, documentation, or standalone marketing exports.

Keep descriptions short, accurate, and written for players. The popup shows only the latest release, with at most four short highlights. `GAME_VERSION` derives from the newest entry; do not duplicate version strings in the UI. Keep the menu copyright as `© freeonlinegames.com`.
