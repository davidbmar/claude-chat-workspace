# Sprint 20

Goal
- F-020 New (High): Generalize into configurable "tool-chat" module — server reads TOOL_NAME, TOOL_ICON, TOOL_DESCRIPTION, SYSTEM_PROMPT env vars; injects them into the page so one Docker image powers multiple catalog tools
- B-054 Medium: User bubble block-level markdown — apply full markdown renderer to user messages (not just inline)
- B-055 Low: Mobile header wraps at 375px — truncate title or icon-only New Chat button at narrow widths
- B-056 Low: Mobile input bottom clip — fix safe-area padding on textarea at 375px

Constraints
- One agent only — changes in server.js AND public/index.html
- Agent A owns everything

## agentA-generalize

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
