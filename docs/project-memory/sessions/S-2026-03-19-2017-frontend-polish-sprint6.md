---
id: S-2026-03-19-2017-frontend-polish-sprint6
title: Frontend Polish — Sprint 6 (F-008, F-009, F-010, B-005)
goal: Complete markdown renderer (ordered lists, horizontal rules), fix copy button overlap, add mobile-responsive layout
context: Sprint 6 agentA branch. Agent owns public/index.html exclusively.
---

## Plan

1. B-005: Increase padding-right on `.msg.claude .bubble` to 56px
2. F-008: Add ordered list support (`<ol><li>`) in processTextLines()
3. F-009: Add horizontal rule support (`<hr>`) for `---` and `***` lines
4. F-010: Mobile responsive layout — sidebar hidden on <=600px, hamburger button toggles it

## Changes Made

- `public/index.html`:
  - B-005: `padding-right` on `.msg.claude .bubble` increased from 52px → 56px
  - F-008: Added ordered list detection (`/^\d+\. /`) in `processTextLines()` — groups consecutive numbered lines into `<ol><li>` elements with inline formatting
  - F-009: Added horizontal rule detection (`---` or `***` after trim) — inserts `<hr>` element; added CSS `hr { border: none; border-top: 1px solid var(--border); margin: 8px 0; }`
  - F-010: Added `@media (max-width: 600px)` — sidebar hidden by default, fixed-position when `.sidebar-open` class applied; added `#hamburger-btn` (☰) visible only on mobile; hamburger click toggles `.sidebar-open` on `#sidebar`
  - Also fixed UL detection to check `currentList.tagName !== 'UL'` to properly switch between OL and UL contexts
  - Added `.bubble ol` to existing list CSS margin rule

## Decisions Made

- OL/UL detection checks `currentList.tagName` to handle mixed list types correctly
- Hamburger uses `&#9776;` (☰ trigram) character — no icon library dependency
- HR check uses `line.trim()` to handle leading/trailing whitespace

## Commits

- TBD after commit
