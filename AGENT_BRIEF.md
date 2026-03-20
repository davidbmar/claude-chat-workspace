agentA-css-and-layout — Sprint 9

Previous Sprint Summary
─────────────────────────────────────────
# claude-chat-workspace Project Status — March 19, 2026 (Sprint 8: Sprint 8)

## Sprint 8 Summary

- Fix markdown table rendering (B-007): GFM pipe-table syntax renders as raw text
- Fix model selection persistence (B-008): model selector resets to Sonnet on page reload
- Fix copy button overlap on short responses (B-005): needs minimum padding-right ~56px

---

## What Changed

### agentA-frontend-fixes

- Fix model selector persistence across page reloads and fix copy button overlap on short responses

**Commits:**
- (no commits)

**Files:** no changes

### agentB-table-renderer

- Add GFM markdown table rendering to the DOM-based markdown renderer in public/index.html

**Commits:**
- (no commits)

**Files:** no changes


---

## Merge Results

| # | Branch | Deliverable | Phase | Conflicts | Files Changed |
|---|--------|-------------|-------|-----------|---------------|
| 1 | agentA-frontend-fixes | Fix model selector persistence across page reloads and fix copy button overlap on short responses | 1 | Clean | 0 |
| 2 | agentB-table-renderer | Add GFM markdown table rendering to the DOM-based markdown renderer in public/index.html | 1 | Clean | 0 |

---

## Sprint Metrics

| Metric | Value |
|--------|-------|
| Agents | 2 |
| Test files | 0 |
| Security audit | 0 vulnerabilities |
| Git diff |  20 files changed, 1868 insertions(+), 472 deletions(-) |

---

## Backlog Snapshot

**Open:** 0
0 bug(s), 0
0 feature request(s)

### Completed This Sprint
- B-004
- B-006

---

## Next Steps

- Review sprint output and plan next sprint
─────────────────────────────────────────

Sprint-Level Context

Goal
- B-009 Critical: Fix mobile sidebar — add close button + click-outside overlay so user is never trapped with sidebar open
- B-010 High: Replace raw JSON API errors with human-readable messages
- B-011 High: Add CSS for rendered markdown tables (borders, padding, header styling)
- B-012 High: Fix stale history 404 UX — keep entry in sidebar, show explicit Remove button
- B-015 Medium: Fix history delete button layout — replace float:right with flexbox

Constraints
- No two agents may modify the same files
- Agent A owns: public/index.html CSS section + sidebar HTML + sidebar toggle JS
- Agent B owns: public/index.html sendMessage() error handler + loadConversation() 404 branch + model init


Objective
Fix CSS and layout bugs in public/index.html

Tasks
1. B-009 Mobile sidebar close: Add a close button (`×`) inside `.sidebar` at the top. Add a `#sidebar-overlay` div (`position:fixed; inset:0; z-index:99; background:rgba(0,0,0,0.4); display:none`) that shows when sidebar opens and dismisses sidebar when clicked. Update hamburger JS to also toggle overlay visibility. The sidebar itself should be z-index:100.

2. B-011 Table CSS: Add to the `<style>` block:
```
.bubble table { border-collapse: collapse; width: 100%; margin: 8px 0; }
.bubble th, .bubble td { border: 1px solid var(--border); padding: 6px 10px; text-align: left; font-size: 0.9em; }
.bubble th { background: rgba(255,255,255,0.06); font-weight: 600; }
.bubble tr:nth-child(even) td { background: rgba(255,255,255,0.02); }
```

3. B-015 History entry flexbox: Change `.history-entry` to `display:flex; align-items:center; gap:6px`. Give the title `flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap`. Make delete button `flex-shrink:0`. Remove any `float:right` from the delete button.

Acceptance Criteria
- On mobile (~400px), sidebar can be closed via × button or tapping the overlay
- A markdown table from Claude renders with visible borders and padding
- History entry × button sits right-aligned without overlapping the title text
