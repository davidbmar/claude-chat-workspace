# Sprint 12

Goal
- B-019 Medium: Wire up scroll-to-bottom button — add JS scroll listener on #thread and click handler (the DOM/CSS already exist from Sprint 11, just needs ~10 lines of JS)
- B-020 Low: Fix New Chat confirmation — only fire if thread has real user messages (.msg.user), not just error bubbles
- B-021 Low: Fix dead Cmd+Enter else-if — collapse into single unified condition in keydown handler
- B-022 Low: Shorten mobile input placeholder — use short placeholder at ≤600px via JS or CSS attr trick
- F-019 New: Add word count alongside char count in the response stats label (already have words from SSE done event)

Constraints
- One agent only — all changes are in public/index.html JS section, no CSS conflict risk
- Agent A owns everything

## agentA-js-fixes

Objective
Fix remaining JavaScript issues in public/index.html — all small, targeted changes.

Tasks

1. B-019 Scroll-to-bottom button JS: Find `#scroll-btn` in the DOM. Add:
   - A scroll event listener on `#thread`: when `thread.scrollHeight - thread.scrollTop - thread.clientHeight > 100`, add class `visible` to `#scroll-btn`; otherwise remove it.
   - A click handler on `#scroll-btn` that calls `thread.scrollTop = thread.scrollHeight` and removes `visible`.
   - Also call the visibility check inside `scrollToBottom()` so the button hides after auto-scroll.

2. B-020 New Chat confirmation guard: In the `newChatBtn` click handler, change `thread.querySelector('.msg')` to `thread.querySelector('.msg.user')` so the confirm only fires when there are actual user messages, not just error bubbles.

3. B-021 Collapse Cmd+Enter dead code: In the keydown handler, change:
   ```js
   if (e.key === 'Enter' && !e.shiftKey) { ... }
   else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { ... }
   ```
   To a single condition:
   ```js
   if (e.key === 'Enter' && !e.shiftKey && !(e.metaKey || e.ctrlKey)) { ... }
   // Cmd+Enter and Ctrl+Enter handled separately above or as:
   if ((e.key === 'Enter') && !e.shiftKey) { send(); e.preventDefault(); }
   ```
   Simplest correct form: `if (e.key === 'Enter' && !e.shiftKey) { send(); e.preventDefault(); }` — this already handles Cmd+Enter since metaKey+Enter has shiftKey=false.

4. B-022 Mobile placeholder: Use JS on DOMContentLoaded to set `msgInput.placeholder = window.innerWidth <= 600 ? 'Message Claude...' : 'Message Claude (Enter to send, Shift+Enter for newline)'`. Also add a resize listener to update it.

5. F-019 Word count in stats: The SSE `done` event already sends `{ chars, words }`. Find where the "N chars" label is built after streaming and change it to "N chars · N words".

Acceptance Criteria
- Scrolling up in a long thread shows ↓ button; clicking it scrolls to bottom and button hides
- New Chat confirm does NOT appear when only an error bubble is in the thread
- Cmd+Enter still sends (regression check)
- Mobile shows "Message Claude..." placeholder at 400px
- Response stats show "247 chars · 43 words" format

## Merge Order
1. agentA-js-fixes

## Merge Verification
- node -e "require('fs').readFileSync('public/index.html','utf8'); console.log('HTML readable')"
- docker compose up --build -d && sleep 5 && curl -s http://localhost:8080/api/health
- npm audit --audit-level=high
