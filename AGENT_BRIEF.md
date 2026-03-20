agentA-lists-and-aria — Sprint 19

Previous Sprint Summary
─────────────────────────────────────────
# claude-chat-workspace Project Status — March 20, 2026 (Sprint 9: Sprint 9)

## Sprint 9 Summary

- B-009 Critical: Fix mobile sidebar — add close button + click-outside overlay so user is never trapped with sidebar open
- B-010 High: Replace raw JSON API errors with human-readable messages
- B-011 High: Add CSS for rendered markdown tables (borders, padding, header styling)
- B-012 High: Fix stale history 404 UX — keep entry in sidebar, show explicit Remove button
- B-015 Medium: Fix history delete button layout — replace float:right with flexbox

---

## What Changed

### agentA-css-and-layout

Completed assigned tasks.

**Commits:**
- (no commits)

**Files:** no changes

### agentB-js-error-ux

Completed assigned tasks.

**Commits:**
- (no commits)

**Files:** no changes


---

## Merge Results

| # | Branch | Deliverable | Phase | Conflicts | Files Changed |
|---|--------|-------------|-------|-----------|---------------|
| 1 | agentA-css-and-layout | Completed tasks | 1 | Clean | 0 |
| 2 | agentB-js-error-ux | Completed tasks | 1 | Clean | 0 |

---

## Sprint Metrics

| Metric | Value |
|--------|-------|
| Agents | 2 |
| Test files | 0 |
| Security audit | 0 vulnerabilities |
| Git diff |  9 files changed, 442 insertions(+), 116 deletions(-) |

---

## Backlog Snapshot

**Open:** 8 bug(s), 4 feature request(s)

### Completed This Sprint
- B-004
- B-006

---

## Next Steps

- Review sprint output and plan next sprint
─────────────────────────────────────────

Sprint-Level Context

Goal
- B-046 Critical: Fix unordered list bullet matching — renderer only handles `- ` but Claude outputs `• ` (U+2022) and `* ` too; match all three
- B-050 High: Support nested lists — indented `  - sub-item` lines should produce nested `<ul><li>` inside the parent `<li>`
- B-047 Medium: Fix HR visibility — increase opacity from 0.15 to 0.3
- B-051 Medium: Add ARIA dialog semantics to confirm modal — role, aria-modal, aria-labelledby, button labels
- B-052 Medium: Add accessible label to model selector — aria-label or visually-hidden `<label>`

Constraints
- One agent only — all changes in public/index.html
- Agent A owns everything


Objective
Fix unordered list rendering for all bullet formats, add nested list support, fix HR visibility, and complete modal/selector ARIA.

Tasks

1. B-046 Unordered list bullet formats:
   In the markdown renderer (`processTextLines` or equivalent), update the condition that matches unordered list items to also catch:
   - `• text` (Unicode bullet U+2022) — Claude's default bullet char
   - `* text` (asterisk-space — must not conflict with bold `**`)
   The simplest approach: normalize at parse time. When a line starts with `• ` or `* ` (but not `**`), convert it to treat as `- ` before processing. Then the existing `- ` branch handles all three.
   Make sure `* ` is only matched as a list item when the line starts with exactly `* ` (single asterisk + space), not `**`.

2. B-050 Nested lists:
   After fixing B-046, add support for indented list items. When inside a `<ul>` or `<ol>` context and a line matches `/^  [-•*] /` or `/^    [-•*] /` (2 or 4 spaces), create a nested `<ul>` inside the current `<li>` rather than flushing to plain text.
   Keep it simple — support one level of nesting (2-space or 4-space indent). Do not try to implement arbitrary depth.
   When the indent returns to zero, close the nested list and continue the parent list.

3. B-047 HR opacity:
   Find the CSS rule: `hr { border: none; border-top: 1px solid rgba(255,255,255,0.15); margin: 12px 0; }`
   Change `0.15` to `0.3`: `border-top: 1px solid rgba(255,255,255,0.3);`

4. B-051 Confirm modal ARIA:
   Find `#confirm-modal`. Add to the outer overlay div:
   - `role="dialog"`
   - `aria-modal="true"`
   - `aria-labelledby="confirm-modal-title"`
   Find the `<p>` inside the modal card and add `id="confirm-modal-title"`.
   Find the Cancel button inside the modal and add `aria-label="Cancel — keep current conversation"`.
   Find the confirm/New Chat button and add `aria-label="Confirm — start new conversation"`.

5. B-052 Model selector label:
   Find `#model-selector` (the `<select>` element). Add `aria-label="Select AI model"` directly to the element. Alternatively add a visually-hidden `<label for="model-selector">Model</label>` before it using CSS `.sr-only { position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0,0,0,0); }`.

Acceptance Criteria
- Ask Claude "give me a bullet list of 5 things" — response renders as proper `<ul><li>` whether Claude uses `•`, `-`, or `*` format
- Ask "show nested bullet list with sub-items" — nested items render indented under their parent as nested `<ul>`
- A response with `---` shows a clearly visible horizontal dividing line
- Opening New Chat modal: screen reader announces "dialog", buttons have descriptive labels
- Model selector has accessible label readable by screen readers

## Merge Order
1. agentA-lists-and-aria

## Merge Verification
- node -e "require('fs').readFileSync('public/index.html','utf8'); console.log('HTML readable')"
- docker compose up --build -d && sleep 5 && curl -s http://localhost:8080/api/health
- npm audit --audit-level=high
