agentA-list-and-a11y — Sprint 18

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
- B-046 High: Fix unordered list rendering — `- item` lines must produce `<ul><li>` elements, not standalone `div.bubble` with a • character
- B-048 Medium: Fix tab order — sidebar delete buttons dominate keyboard navigation; add tabindex="-1" to delete buttons and tabindex="0" + role="button" to history entries (fixes B-043 too)
- B-043 Medium: History entries keyboard-navigable — add tabindex, role="button", and Enter/Space keypress handler to .history-entry divs
- B-047 Low: Fix horizontal rule visibility — change `<hr>` border color from near-invisible dark to `rgba(255,255,255,0.15)` or `#4a5568`
- B-049 Low: Add aria-label to Copy and New Chat buttons — replace title-only with explicit aria-label attributes
- B-045 Low: Improve heading size differentiation — increase size steps and/or vary weight so H1/H2/H3 are visually distinct

Constraints
- One agent only — all changes in public/index.html
- Agent A owns everything


Objective
Fix unordered list rendering (high priority regression), complete keyboard accessibility, and minor visual polish.

Tasks

1. B-046 Unordered list rendering:
   Find the markdown renderer branch that handles lines starting with `- ` (hyphen-space). Currently it creates `div.bubble` with a bullet character. Change it to:
   - Accumulate consecutive `- ` lines into a single `<ul>` element (same pattern as ordered lists use `<ol>`)
   - Each item becomes a `<li>` with inline markdown applied via `appendInlineSegmentsSingleLine()`
   - Close the `<ul>` when a non-list line is encountered (same blank-line tolerance logic added in Sprint 14 for ordered lists)
   - CSS: `ul { margin: 6px 0 6px 20px; padding: 0; list-style: disc; } ul li { margin: 2px 0; }`

2. B-048 + B-043 Tab order and history keyboard nav:
   - Find all `.delete-btn` elements (the × buttons on history entries). Add `tabindex="-1"` so they're removed from the tab sequence (still clickable with mouse, accessible via history entry focus).
   - Find `.history-entry` divs. Add `tabindex="0"` and `role="button"` to each when created. Add a `keydown` listener: if `key === 'Enter' || key === ' '`, call the same click handler that loads the conversation.
   - This makes history navigable: Tab reaches each entry, Enter/Space loads it, Tab again moves to the next.

3. B-047 Horizontal rule visibility:
   Find the CSS rule for `hr`. Change the border color from its current near-invisible dark value to `rgba(255, 255, 255, 0.15)`. If using border-top shorthand, set: `border: none; border-top: 1px solid rgba(255,255,255,0.15); margin: 12px 0;`

4. B-049 Copy and New Chat aria-labels:
   - Find `#new-chat-btn`. Add `aria-label="Start a new conversation"`.
   - Find all copy buttons (class `.copy-btn` or similar). Add `aria-label="Copy message"` when created.

5. B-045 Heading differentiation:
   Update heading CSS to create clearer visual hierarchy:
   - H1: `font-size: 1.5rem; font-weight: 700; margin: 16px 0 8px;`
   - H2: `font-size: 1.25rem; font-weight: 600; margin: 14px 0 6px; color: #cbd5e0;`
   - H3: `font-size: 1.05rem; font-weight: 600; margin: 12px 0 4px; color: #a0aec0; text-transform: uppercase; letter-spacing: 0.04em;`
   This gives H1 bold weight, H2 slightly muted color, H3 small-caps treatment.

Acceptance Criteria
- Ask Claude for a bulleted list — renders as proper `<ul><li>` with indentation, not flat divs with • characters
- Tab through the page: delete buttons are skipped; history entries are reachable; pressing Enter on a history entry loads that conversation
- A response containing `---` shows a visible horizontal line dividing sections
- The "+ New Chat" button and Copy buttons are announced correctly by screen readers (aria-label present)
- H1, H2, H3 headings in Claude responses are visually distinct at a glance

## Merge Order
1. agentA-list-and-a11y

## Merge Verification
- node -e "require('fs').readFileSync('public/index.html','utf8'); console.log('HTML readable')"
- docker compose up --build -d && sleep 5 && curl -s http://localhost:8080/api/health
- npm audit --audit-level=high
