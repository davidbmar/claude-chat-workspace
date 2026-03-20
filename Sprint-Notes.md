# Sprint 9 — Agent Notes

*Started: 2026-03-20 00:02 UTC*

Phase 1 Agents: 2
- agentA-css-and-layout
- agentB-js-error-ux

Phase 2 Agents: 0
(none)

Automated summaries from each agent are appended below as they complete.

---

## agentB-js-error-ux

*Completed: 2026-03-20 00:04 UTC*

**Files changed:**
- `public/index.html` — B-010, B-012, B-013 fixes
- `docs/project-memory/sessions/S-2026-03-20-0003-js-error-ux.md` — session doc (new)

**Commands run:**
- `git fetch origin && git merge origin/main`
- `node -e "require('fs').readFileSync(...)"` — HTML parse check (pass)
- `npm audit --audit-level=high` — 0 vulnerabilities
- `git add && git commit && git push -u origin HEAD`

**Changes summary:**
1. **B-010**: Added `friendlyErrorMessage()` helper that maps `authentication_error` / `rate_limit_error` / `overloaded_error` / network errors to human-readable strings. Unknown errors show "Something went wrong" with a `<details>` toggle exposing the raw error. Applied to both the SSE `parsed.error` path and the `catch` block.
2. **B-012**: The 404 branch in `loadConversation()` no longer removes the sidebar entry immediately. Instead it shows the error bubble with a "Remove from history" button; clicking it removes the entry and re-renders the list.
3. **B-013**: After setting `modelSelector.value = savedModel`, validates that the value actually stuck. If it didn't (stale ID not in any `<option>`), clears `localStorage` key and leaves `currentModel` at its default.


---

## agentA-css-and-layout

*Completed: 2026-03-20 00:04 UTC*

**Files changed:**
- `public/index.html` — all three bug fixes applied

**Commands run:**
- `git pull` (no tracking branch; no-op)
- `node -e` syntax check — passed
- `git add` + `git commit`
- `git push -u origin HEAD`

**Changes summary:**

| Ticket | Change |
|--------|--------|
| B-009 | Added `#sidebar-overlay` div + `#sidebar-close-btn` (×) to HTML; CSS for overlay (z-index:99) and close button; `openSidebar()`/`closeSidebar()` JS helpers; hamburger, close btn, and overlay click all call these helpers |
| B-011 | Added 4 CSS rules for `.bubble table/th/td/tr:nth-child(even) td` — borders, padding, header background, alternating rows |
| B-015 | Changed `.history-entry` to `display:flex; align-items:center; gap:6px`; added `.history-entry-title` (flex:1 + ellipsis); `.delete-btn` changed from `float:right` to `flex-shrink:0`; `renderHistoryList()` wraps title in `<span class="history-entry-title">` |

**Notes:** No automated tests defined in `package.json`; JS syntax verified clean via `node`.

