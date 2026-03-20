# Sprint 14

Goal
- B-029 Medium: Fix numbered list rendering — items separated by blank lines all show as "1." because currentList resets on blank lines; fix to only break list on heading/code/table/HR or two consecutive blanks
- B-030 Medium: Auto-close mobile sidebar after selecting a conversation — sidebar stays open at ≤600px after tapping a history entry; add auto-close on item click
- B-031 Low: Render inline markdown in user message bubbles — **bold**, *italic*, `code` show as raw text in user bubbles; apply appendInlineSegmentsSingleLine() same as Claude bubbles

Constraints
- One agent only — all changes in public/index.html JS section
- Agent A owns everything

## agentA-rendering-fixes

Objective
Fix numbered list rendering and mobile UX issues in public/index.html.

Tasks

1. B-029 Numbered list reset on blank lines: Find `processTextLines()` (or equivalent) where `currentList = null` is set when a non-list line is encountered. Change the logic so blank lines between list items do NOT immediately close the list. Instead:
   - Track a `pendingListClose` flag when a blank line is seen while in a list
   - If the very next non-blank line continues the same list type (numbered: `/^\d+\.\s/`, unordered: `/^-\s/`), stay in the list and continue numbering
   - Only close the list when a non-list, non-blank line appears (heading, code fence, table, HR) OR when two consecutive blank lines are seen
   - This ensures Claude's typical "1. item\n\nblank\n\n2. item" pattern renders as a sequential ordered list

2. B-030 Auto-close mobile sidebar: Find the click handler(s) for history sidebar items (where conversations are loaded). Add a call to close the sidebar (remove the `active` class or equivalent) when `window.innerWidth <= 600`. The close logic already exists for the × button and click-outside overlay — reuse the same function/pattern.

3. B-031 User bubble markdown: Find where user message text is set (likely `userBubble.textContent = text` or similar). Replace with `appendInlineSegmentsSingleLine(userBubble, text)` (the same function used for inline markdown in Claude bubbles). This renders **bold**, *italic*, `code` in user messages. The function is XSS-safe (no innerHTML with raw user input).

Acceptance Criteria
- A numbered list from Claude with blank lines between items renders as 1, 2, 3... (not all 1.)
- On mobile (400px), clicking a history entry loads the conversation AND closes the sidebar automatically
- Typing "**hello** world" in the input and sending shows "**hello** world" rendered as bold + plain text in the user bubble

## Merge Order
1. agentA-rendering-fixes

## Merge Verification
- node -e "require('fs').readFileSync('public/index.html','utf8'); console.log('HTML readable')"
- docker compose up --build -d && sleep 5 && curl -s http://localhost:8080/api/health
- npm audit --audit-level=high
