# Sprint 10

Goal
- B-014 Medium: Fix mobile header — stop wrapping to two rows at narrow widths (target ≤56px header height at 400px)
- B-016 Medium: Fix copy in non-HTTPS context — add fallback for clipboard API failure with user feedback
- F-014 Low: Add relative timestamps to history sidebar entries (e.g. "2 hours ago", "yesterday")
- F-015 Low: Add click-outside overlay to close mobile sidebar (semi-transparent backdrop)
- F-016 Low: Copy button should copy original markdown source, not plain text

Constraints
- No two agents may modify the same files
- Agent A owns: public/index.html CSS section (mobile header fix, sidebar overlay CSS)
- Agent B owns: public/index.html JS section (copy fallback, timestamps, markdown copy source)

## agentA-mobile-and-overlay

Objective
Fix mobile header layout and add sidebar click-outside overlay in public/index.html

Tasks
1. B-014 Mobile header: At ≤600px (or ≤400px via media query), prevent header from wrapping. Options:
   - Move model selector out of the header into the main area (below thread, above input), OR
   - Collapse model selector to an icon button on mobile that opens a small dropdown, OR
   - Keep header single-row by reducing font sizes and padding so everything fits at 400px
   Pick the simplest approach that keeps header ≤56px tall on mobile.

2. F-015 Sidebar overlay: Add a `#sidebar-overlay` div (if not already present from Sprint 9) — `position: fixed; inset: 0; z-index: 99; background: rgba(0,0,0,0.4); display: none`. When sidebar opens, show it. When user clicks the overlay, close the sidebar. This gives mobile users an intuitive tap-outside-to-close gesture.

Acceptance Criteria
- Header is single-row (≤56px) at 400px viewport width
- Tapping anywhere outside the open sidebar closes it on mobile

## agentB-copy-and-timestamps

Objective
Improve copy button behavior and add timestamps to history sidebar in public/index.html

Tasks
1. B-016 Copy fallback: In the copy button click handler, after `navigator.clipboard.writeText()` fails (or in non-secure contexts), fall back to `document.execCommand('copy')` using a temporary textarea. If both fail, show a brief "Copy failed — HTTPS required" message where "Copied!" normally appears.

2. F-016 Copy markdown source: Instead of copying `bubble.textContent` (rendered plain text), store the original markdown string on the bubble element as a `data-markdown` attribute when the SSE stream completes. Use that for copy. This preserves code blocks, table syntax, bold/italic etc.

3. F-014 History timestamps: In `renderHistoryList()` / `pushConversationToHistory()`, store a `timestamp` (ISO string from `Date.now()`) alongside each history entry in localStorage. When rendering the sidebar, show a relative timestamp below each title: "just now" (<1min), "X min ago" (<1hr), "X hours ago" (<24hr), "yesterday", or the date for older entries. Update every 60 seconds via `setInterval`.

Acceptance Criteria
- Copy button works on HTTP (falls back gracefully, shows error if all methods fail)
- Copying a Claude response with a code block preserves the fenced code block syntax
- History entries show relative timestamps that update live

## Merge Order
1. agentA-mobile-and-overlay
2. agentB-copy-and-timestamps

## Merge Verification
- node -e "require('fs').readFileSync('public/index.html','utf8'); console.log('HTML readable')"
- docker compose up --build -d && sleep 5 && curl -s http://localhost:8080/api/health
- npm audit --audit-level=high
