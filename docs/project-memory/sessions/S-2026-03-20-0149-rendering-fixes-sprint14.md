---
type: session
id: S-2026-03-20-0149-rendering-fixes-sprint14
title: Sprint 14 — Rendering fixes (B-029, B-030, B-031)
date: 2026-03-20
agent: agentA-rendering-fixes
---

## Goal

Fix three rendering/UX issues in public/index.html as specified in AGENT_BRIEF.md for Sprint 14.

## Context

Single-agent sprint. All changes scoped to the JS section of public/index.html.

## Plan

1. B-029: Fix numbered list rendering — blank lines between items reset the counter
2. B-030: Auto-close mobile sidebar after tapping a history entry
3. B-031: Render inline markdown (**bold**, *italic*, `code`) in user bubbles

## Changes Made

### B-029 — Numbered list reset on blank lines (`processTextLines`)

Added `pendingListClose` and `consecutiveBlanks` state variables to `processTextLines()`.

- Blank lines *inside* a list set `pendingListClose = true` instead of immediately resetting `currentList`
- Two consecutive blank lines force-close the list (same OL/UL logic as before)
- Non-blank, non-list lines (heading/HR/table/regular) force-close the list
- When the next non-blank line continues the same list type, the existing `<ol>`/`<ul>` element is reused → items number sequentially

### B-030 — Auto-close sidebar on mobile (`renderHistoryList`)

Added `if (window.innerWidth <= 600) closeSidebar();` after `loadConversation(entry.id)` in the history entry click handler. Reuses the existing `closeSidebar()` function.

### B-031 — User bubble inline markdown (`sendMessage`)

Replaced `userBubble.textContent = text` with `appendInlineSegmentsSingleLine(userBubble, text)` so **bold**, *italic*, and `code` render in the user bubble. Function is XSS-safe (no innerHTML).

## Decisions Made

- Used `appendInlineSegmentsSingleLine` (not `appendInlineSegments`) for user bubbles per brief spec. Single-line inline formatting is sufficient for the acceptance criteria; multi-line user messages still display as the browser handles text nodes naturally within `white-space: pre-wrap`.
- Two consecutive blank lines chosen as the "force close" threshold for B-029, matching typical markdown paragraph separation semantics.

## Verification

- `node -e "require('fs').readFileSync('public/index.html','utf8'); console.log('HTML readable')"` → pass
- `npm audit --audit-level=high` → 0 vulnerabilities
