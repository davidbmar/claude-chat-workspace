# Sprint 11

Goal
- F-013 Low: Add "New Chat" confirmation when conversation is in progress — prevent accidental loss
- B-017 Low: Fix mobile model selector label — show short labels (Haiku/Sonnet/Opus) at narrow widths
- B-018 Low: Remove Copy button from error bubbles — only show on real Claude responses
- F-017 New: Add keyboard shortcut Cmd+Enter (or Ctrl+Enter) as alternative send (some users expect this)
- F-018 New: Add "scroll to bottom" button that appears when user scrolls up mid-stream

Constraints
- No two agents may modify the same files
- Agent A owns: public/index.html HTML structure + CSS (model selector labels, scroll button CSS)
- Agent B owns: public/index.html JS (new chat confirmation, copy button guard, keyboard shortcut, scroll button logic)

## agentA-ui-polish

Objective
CSS and HTML polish in public/index.html

Tasks
1. B-017 Mobile model selector short labels: In the `<select id="model-selector">` options, add a `data-short` label approach OR simply shorten the option text values to use abbreviated labels on small screens. Simplest approach: change option text to use a format like "Haiku — fast" → keep as-is on desktop, but add a media query that sets `font-size: 0` on the select and uses `::after` pseudo... actually the simplest fix is: just increase `max-width` of the model selector in the mobile media query from `100px` to `130px` so "Sonnet — bala..." is readable, OR rename option values to shorter text: `Haiku`, `Sonnet`, `Opus` (3 words max each).

2. F-018 Scroll-to-bottom button: Add a `#scroll-btn` button (`↓`) that is `position: fixed`, bottom-right of the thread area, hidden by default. Show it when the thread is scrolled more than 100px from the bottom (`thread.scrollTop < thread.scrollHeight - thread.clientHeight - 100`). Clicking it scrolls to bottom. CSS: `position: fixed; bottom: 80px; right: 20px; z-index: 50; border-radius: 50%; width: 36px; height: 36px; background: var(--accent); border: none; color: white; cursor: pointer; display: none; font-size: 18px`.

Acceptance Criteria
- Model selector on mobile shows enough text to distinguish between models
- Scroll-to-bottom button appears when scrolled up and scrolls to bottom on click

## agentB-ux-interactions

Objective
JavaScript UX improvements in public/index.html

Tasks
1. F-013 New Chat confirmation: In the `newChatBtn` click handler, before clearing the thread, check if there are any `.msg` elements in `#thread`. If yes, show a `confirm()` dialog: "Start a new chat? Your current conversation is saved in history." Only proceed if confirmed (or thread is already empty).

2. B-018 Copy button guard: In `addMsg('claude', ...)`, after creating the copy button, check whether the bubble has `isError` context. Add a flag — the simplest approach: when showing an error message (in the catch block or 404 handler), add a CSS class like `error-bubble` to the bubble element. In `addMsg`, check for this class and skip appending the copy button if present. OR: pass a second argument `{isError: true}` to `addMsg` for error cases.

3. F-017 Cmd+Enter to send: In the `textarea` keydown handler, add a check for `(e.metaKey || e.ctrlKey) && e.key === 'Enter'` — trigger send (same as plain Enter). This should work alongside the existing Enter-to-send and Shift+Enter-for-newline logic.

Acceptance Criteria
- Clicking New Chat when messages exist shows confirm dialog; canceling leaves conversation intact
- Error bubbles (stale 404 message, API error message) have no Copy button
- Cmd+Enter and Ctrl+Enter both send the message

## Merge Order
1. agentA-ui-polish
2. agentB-ux-interactions

## Merge Verification
- node -e "require('fs').readFileSync('public/index.html','utf8'); console.log('HTML readable')"
- docker compose up --build -d && sleep 5 && curl -s http://localhost:8080/api/health
- npm audit --audit-level=high
