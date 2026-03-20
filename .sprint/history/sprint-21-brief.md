# Sprint 21

Goal
- B-057 High: Mobile header subtitle wraps to 3 lines at 375px — hide subtitle ("Chat with Claude") at ≤480px breakpoint so icon + truncated title fit in one compact row
- B-053 Low: History entry accessible name lacks timestamp — add timestamp to aria-label so two "Hello" conversations are distinguishable by screen reader
- F-020 follow-up: Test /api/config with custom TOOL_NAME/TOOL_COLOR env vars to confirm the frontend applies them correctly; add a brief automated self-test in server.js startup log

Constraints
- One agent only — changes in public/index.html only (CSS section) for B-057; server.js startup log for F-020 follow-up
- Agent A owns everything
- Non-interactive — no confirmation prompts

## agentA-mobile-polish

Objective
Fix the mobile subtitle overflow bug and the screen-reader timestamp gap. Keep changes minimal and targeted.

Tasks

1. B-057 Mobile subtitle visibility:
   In the CSS, at the ≤480px breakpoint, add:
   ```css
   .app-subtitle { display: none; }
   ```
   The selector may differ — inspect the subtitle element's class and target it precisely.
   After the fix, at 375px the header should show: hamburger icon | 💬 icon | truncated title | model selector | + button — all on one row with no subtitle.

2. B-053 History entry aria-label:
   Find where history entries are rendered (the code that sets `title` or `aria-label` on `.history-entry` elements).
   Change from: `aria-label="${title}"`
   To: `aria-label="${title} — ${relativeTime}"`
   where relativeTime is already computed for display (reuse the same value).

3. F-020 follow-up — startup log:
   In server.js, after the `app.listen(PORT, ...)` callback, add a single console.log line:
   ```js
   console.log(`[config] toolName=${TOOL_NAME} toolIcon=${TOOL_ICON} toolColor=${TOOL_COLOR} systemPrompt=${process.env.SYSTEM_PROMPT ? 'SET' : 'not set'}`);
   ```
   This lets operators confirm env vars are loaded correctly on startup.

Acceptance Criteria
- At 375px viewport: header is single row, subtitle not visible
- At 1280px viewport: subtitle "Chat with Claude" still visible
- History entries with same title are distinguishable by screen reader (aria-label includes timestamp)
- docker compose up --build logs show [config] line on startup

Merge Verification
- node --check public/index.html 2>/dev/null || node -e "require('fs').readFileSync('public/index.html','utf8'); console.log('HTML readable')"
- node --check server.js
- docker compose down && docker compose up --build -d && sleep 4 && curl -s http://localhost:8080/api/health
- curl -s http://localhost:8080/api/config

Merge Order
1. agentA-mobile-polish
