# Player-facing release notes

The main menu displays the version and a clickable What's new popup above the version. Their single source is `remaster/src/release-notes.js`.

For each future user-facing game update, add a concise new release entry at the front of `RELEASES`, increment the minor version (1.0 → 1.1 → 1.2), and preserve earlier entries. Group changes from the same user request into one release. Do not bump for internal-only refactors, tests, documentation, or standalone marketing exports. Follow an explicit user-requested version instead when given.

Keep descriptions short, accurate, and written for players. The popup shows only the latest release, with at most four short highlights. `GAME_VERSION` derives from the newest entry; do not duplicate version strings in the UI. Keep the menu copyright as `© freeonlinegames.com`.
