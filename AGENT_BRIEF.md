agentA-generalize — Sprint 20

Previous Sprint Summary
─────────────────────────────────────────
# claude-chat-workspace Project Status — March 20, 2026 (Sprint 9: Sprint 9)

## Sprint 9 Summary

- B-009 Critical: Fix mobile sidebar — add close button + click-outside overlay so user is never trapped with sidebar open
- B-010 High: Replace raw JSON API errors with human-readable messages
- B-011 High: Add CSS for rendered markdown tables (borders, padding, header styling)
- B-012 High: Fix stale history 404 UX — keep entry in sidebar, show explicit Remove button
- B-015 Medium: Fix history delete button layout — replace float:right with flexbox

---

## What Changed

### agentA-css-and-layout

Completed assigned tasks.

**Commits:**
- (no commits)

**Files:** no changes

### agentB-js-error-ux

Completed assigned tasks.

**Commits:**
- (no commits)

**Files:** no changes


---

## Merge Results

| # | Branch | Deliverable | Phase | Conflicts | Files Changed |
|---|--------|-------------|-------|-----------|---------------|
| 1 | agentA-css-and-layout | Completed tasks | 1 | Clean | 0 |
| 2 | agentB-js-error-ux | Completed tasks | 1 | Clean | 0 |

---

## Sprint Metrics

| Metric | Value |
|--------|-------|
| Agents | 2 |
| Test files | 0 |
| Security audit | 0 vulnerabilities |
| Git diff |  9 files changed, 442 insertions(+), 116 deletions(-) |

---

## Backlog Snapshot

**Open:** 8 bug(s), 4 feature request(s)

### Completed This Sprint
- B-004
- B-006

---

## Next Steps

- Review sprint output and plan next sprint
─────────────────────────────────────────

Sprint-Level Context

Goal
- F-020 New (High): Generalize into configurable "tool-chat" module — server reads TOOL_NAME, TOOL_ICON, TOOL_DESCRIPTION, SYSTEM_PROMPT env vars; injects them into the page so one Docker image powers multiple catalog tools
- B-054 Medium: User bubble block-level markdown — apply full markdown renderer to user messages (not just inline)
- B-055 Low: Mobile header wraps at 375px — truncate title or icon-only New Chat button at narrow widths
- B-056 Low: Mobile input bottom clip — fix safe-area padding on textarea at 375px

Constraints
- One agent only — changes in server.js AND public/index.html
- Agent A owns everything


Objective
Turn claude-chat-workspace into a generic configurable "tool-chat" module. Any tool in the portal catalog can use this same Docker image with different env vars to create a specialized chat experience. Also fix remaining mobile/UX bugs.

Tasks

1. F-020 Configurable tool-chat module:

   **server.js changes:**
   - Read these env vars (with sensible defaults):
     ```
     TOOL_NAME        (default: "Claude Chat")
     TOOL_ICON        (default: "💬")
     TOOL_DESCRIPTION (default: "Chat with Claude")
     SYSTEM_PROMPT    (default: "" — no system prompt)
     TOOL_COLOR       (default: "#7c3aed" — purple)
     ```
   - Add a `GET /api/config` endpoint that returns these as JSON:
     ```json
     { "toolName": "...", "toolIcon": "...", "toolDescription": "...", "toolColor": "..." }
     ```
     (Do NOT expose SYSTEM_PROMPT to the client — it stays server-side only)
   - In the `POST /api/chat` handler, inject SYSTEM_PROMPT as the `system` parameter in the Anthropic API call when it is set:
     ```js
     const params = { model, messages: history, max_tokens: 8096, stream: true };
     if (process.env.SYSTEM_PROMPT) params.system = process.env.SYSTEM_PROMPT;
     ```

   **public/index.html changes:**
   - On DOMContentLoaded, fetch `/api/config` and apply:
     - Set `document.title` to `toolName`
     - Replace hardcoded "Claude Chat" header text with `toolIcon + " " + toolName`
     - Replace hardcoded subtitle/description with `toolDescription` if present
     - Apply `toolColor` as CSS custom property `--tool-color` for the accent color (send button, user bubble background, etc.)
   - Replace all hardcoded "Claude Chat" strings in the HTML with a template placeholder that gets replaced on config load
   - The UI should be visually neutral until config loads (show "..." or use defaults)

2. B-054 User bubble full markdown:
   In the user message rendering path, replace `appendInlineSegmentsSingleLine(bubble, text)` with the full `renderTextInto(bubble, text)` function (or equivalent) that handles block-level elements. The same function used for Claude bubbles. This makes user messages render headings, code blocks, lists, etc. consistently.

3. B-055 Mobile header wrap:
   In the CSS, at ≤480px breakpoint, add:
   ```css
   #new-chat-btn span { display: none; }  /* hide "+ New Chat" text, keep icon */
   .app-title { font-size: 0.85rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 120px; }
   ```

4. B-056 Mobile input bottom clip:
   Add `padding-bottom: env(safe-area-inset-bottom, 8px)` to the input container CSS so it respects device safe areas on mobile.

Acceptance Criteria
- Run with `TOOL_NAME="App Builder" TOOL_ICON="🔨" TOOL_COLOR="#e53e3e" SYSTEM_PROMPT="You are an expert software architect..."` — page title, header, and accent color all reflect the custom config
- Run with default env (no vars set) — app looks and works exactly as before (backwards compatible)
- `/api/config` returns JSON with tool metadata
- User message with `# heading\n**bold**\n\`\`\`python\ncode\n\`\`\`` renders formatted, not raw
- Mobile 375px — header stays single row, input visible without clipping

## Merge Order
1. agentA-generalize

## Merge Verification
- node -e "require('fs').readFileSync('public/index.html','utf8'); console.log('HTML readable')"
- node -e "require('fs').readFileSync('server.js','utf8'); console.log('server.js readable')"
- docker compose up --build -d && sleep 5 && curl -s http://localhost:8080/api/health && curl -s http://localhost:8080/api/config
- npm audit --audit-level=high
