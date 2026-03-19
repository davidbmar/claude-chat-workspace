# Sprint 6

Goal
- Complete markdown rendering: ordered lists (F-008) and horizontal rules (F-009)
- Fix copy button overlap on narrow bubbles (B-005)
- Make layout responsive for mobile screens (F-010)
- Add server stats endpoint and conversation count endpoint

Constraints
- No two agents may modify the same files
- Agent A owns: public/index.html
- Agent B owns: server.js

Merge Order
1. agentA-frontend-polish
2. agentB-server-stats

Merge Verification
- echo "No automated tests yet — verify manually with: docker compose up"

## agentA-frontend-polish

Objective
- Complete the markdown renderer and make the UI responsive on mobile

Tasks
- Open public/index.html and read it fully before making changes
- Fix B-005: Increase padding-right on `.msg.claude .bubble` from whatever it currently is to at least 56px, so the always-visible copy button never overlaps text.
- Add F-008 (ordered lists): In the renderTextInto() function, add support for numbered lists. Detect contiguous lines matching `/^\d+\. /` (e.g., "1. First", "2. Second"). Group them into an `<ol>` element with `<li>` children. Apply inline formatting (bold/italic/code) to each list item. A blank line or non-list line ends the list.
- Add F-009 (horizontal rules): In renderTextInto(), detect lines that are exactly `---` or `***` (after trim) and replace them with an `<hr>` element. Add CSS for `hr { border: none; border-top: 1px solid var(--border); margin: 8px 0; }`.
- Add F-010 (mobile responsive): Add CSS media query `@media (max-width: 600px)` that: hides the sidebar (`#sidebar { display: none; }`), makes the chat area use full width, and adjusts the header to wrap on small screens. Also add a hamburger button `☰` that toggles the sidebar on mobile (toggling a `.sidebar-open` class on `#sidebar` that sets `display: flex` and position: fixed + full-height overlay). The hamburger button should appear in the header only on mobile (hide with CSS on desktop).
- Commit with: feat: ordered lists, horizontal rules, mobile responsive layout, copy button fix (F-008, F-009, F-010, B-005)

Acceptance Criteria
- Copy button no longer overlaps text (padding-right >= 56px)
- Numbered lists render as <ol><li> elements
- --- and *** on their own line render as <hr>
- On screens <= 600px the sidebar is hidden and a hamburger button appears
- Hamburger button toggles sidebar on mobile
- Desktop layout is unchanged

## agentB-server-stats

Objective
- Add a stats endpoint to the server

Tasks
- Open server.js and read it fully before making changes
- Track server start time: add `const startTime = new Date();` near the top of the file (after client initialization).
- Add GET /api/stats endpoint: returns a JSON object with: `{ uptime: Math.floor((Date.now() - startTime) / 1000), conversationCount: conversations.size, messageCount: totalMessages, version: "1.0.0" }` where `totalMessages` is computed by summing the length of all history arrays in the conversations Map.
- Add a request counter: increment a counter on every request (in the logging middleware if it exists, or add one). Include `requestCount` in the stats endpoint response.
- Commit with: feat: add /api/stats endpoint with uptime, conversation count, and request count

Acceptance Criteria
- GET /api/stats returns uptime in seconds, conversationCount, messageCount, requestCount, version
- uptime increases over time
- conversationCount reflects active conversations in the Map
