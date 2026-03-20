# Sprint 13

Goal
- B-023 High: Render markdown inside table cells — call inline markdown renderer on each cell's content instead of using textContent
- B-025 Medium: Show response stats for history-loaded messages — compute char/word count client-side when rendering loaded conversations
- B-026 Low: Fix "1 words" pluralization — use singular "word" when count is 1
- B-027 Low: Style the "Remove from history" button on stale error cards to match dark theme
- B-028 Low: Replace native confirm() for New Chat with a custom in-app modal matching dark theme

Constraints
- One agent only — all changes in public/index.html (JS + CSS), no server.js changes needed
- Agent A owns everything

## agentA-ui-polish

Objective
Fix remaining UI polish issues in public/index.html — markdown in tables, stats for loaded history, pluralization, button styling, custom confirm modal.

Tasks

1. B-023 Markdown in table cells: Find the table rendering loop where `td.textContent = cells[c]` is called. Replace with a call to the existing inline markdown renderer (the same function used for bold/italic/code in regular text). Use `td.innerHTML` with the rendered result. Be careful to sanitize or only use the existing safe renderer — no raw user HTML.

2. B-025 Stats for loaded history: In the code that renders messages loaded from `GET /api/conversations/:id`, after appending a Claude bubble, compute stats client-side:
   - `const text = msg.content` (the stored message text)
   - `const chars = text.length`
   - `const words = text.trim().split(/\s+/).filter(Boolean).length`
   - Build and append the stats label div the same way live responses do

3. B-026 Pluralization fix: Find the stats label builder that appends `+ ' words'`. Change to:
   ```js
   const wc = parseInt(claudeBubble.dataset.wordcount, 10);
   statsText += ' · ' + wc + (wc === 1 ? ' word' : ' words');
   ```
   Apply same fix to the client-side stats computation added in task 2.

4. B-027 Remove button styling: Find where `removeBtn.style.cssText` is set on the stale-conversation error card. Add dark-theme styles:
   `background:#2e3347;color:#e2e8f0;border:1px solid #4a5568;border-radius:6px;`

5. B-028 Custom New Chat modal: Replace the `if (!confirm('Start a new chat? ...'))` call with a custom modal:
   - Create a `<div id="confirm-modal">` overlay with backdrop: `position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:200`
   - Inner card: dark background (#1e2235), rounded corners, padding, max-width 360px
   - Message text + two buttons: "Cancel" (secondary) and "New Chat" (primary, red/destructive color)
   - Show on New Chat click, resolve via button clicks, hide after
   - Keep existing logic (only show if `.msg.user` exists) intact

Acceptance Criteria
- Send a message with markdown table. Table cells containing **bold**, *italic*, `code` render formatted, not as raw asterisks/backticks
- Load a past conversation from sidebar — each Claude response shows "N chars · N word(s)" stats below it
- A one-word Claude response shows "N chars · 1 word" (not "1 words")
- Stale conversation error card shows a dark-themed "Remove from history" button
- Clicking New Chat mid-conversation shows a styled in-app modal (not browser native dialog); Cancel preserves conversation; confirm clears it

## Merge Order
1. agentA-ui-polish

## Merge Verification
- node -e "require('fs').readFileSync('public/index.html','utf8'); console.log('HTML readable')"
- docker compose up --build -d && sleep 5 && curl -s http://localhost:8080/api/health
- npm audit --audit-level=high
