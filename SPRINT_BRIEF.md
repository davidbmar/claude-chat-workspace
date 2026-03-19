# Sprint 3

Goal
- Fix the bold+italic combined markdown rendering bug (B-004) so ***text*** renders as bold+italic
- Make the copy button always visible instead of hover-only (F-004)
- Add a server-side endpoint to retrieve conversation history (needed for future history sidebar)

Constraints
- No two agents may modify the same files
- Agent A owns: public/index.html
- Agent B owns: server.js

Merge Order
1. agentA-frontend-fixes
2. agentB-history-api

Merge Verification
- echo "No automated tests yet — verify manually with: docker compose up"

## agentA-frontend-fixes

Objective
- Fix the triple-asterisk markdown rendering bug and make the copy button always visible

Tasks
- Open public/index.html and read it fully before making changes
- Fix B-004: In the appendFormattedLine() function, update the regex split pattern to also handle ***text*** (bold+italic combined). The current pattern is `(\*\*[^*]+\*\*|\*[^*\n]+\*)`. Change it to handle three cases in order: (1) `***text***` → wrap in both <strong> and <em>, (2) `**text**` → wrap in <strong>, (3) `*text*` → wrap in <em>. The new regex should be `(\*{3}[^*]+\*{3}|\*\*[^*]+\*\*|\*[^*\n]+\*)`. Add a new branch at the top of the if/else chain: if p starts with *** and ends with *** and length > 6, create a <strong> containing an <em> with the inner text (strip 3 chars from each end).
- Fix F-004: Make the copy button always visible by removing `opacity: 0` from the `.copy-btn` CSS rule and removing `.bubble-wrap:hover .copy-btn { opacity: 1; }`. Instead, always show the copy button. Keep the hover styles for color change but remove the opacity hide/show.
- Commit with: fix: triple-asterisk markdown rendering and always-visible copy button (B-004, F-004)

Acceptance Criteria
- ***bold italic*** text renders as bold+italic (strong>em) not raw asterisks
- **bold** text still renders correctly as <strong>
- *italic* text still renders correctly as <em>
- Copy button is visible on all Claude bubbles without needing to hover
- All changes committed to public/index.html only

## agentB-history-api

Objective
- Add a server-side API endpoint to retrieve stored conversation history by ID

Tasks
- Open server.js and read it fully before making changes
- Add GET /api/conversations/:id endpoint: if the conversationId exists in the conversations Map, return { messages: history } as JSON where history is the array of {role, content} objects. If not found, return 404 { error: 'not found' }.
- Add GET /api/conversations endpoint: return a list of all active conversation IDs as { ids: [...] } — useful for the frontend to enumerate sessions.
- Add DELETE /api/conversations/:id endpoint: removes the conversation from the Map and returns { ok: true }. If not found, returns 404.
- Commit with: feat: add conversation history API endpoints (GET/DELETE /api/conversations)

Acceptance Criteria
- GET /api/conversations/:id returns the full message history for a known conversationId
- GET /api/conversations returns all active conversation IDs
- DELETE /api/conversations/:id removes the conversation
- Unknown IDs return 404
- All changes committed to server.js only
