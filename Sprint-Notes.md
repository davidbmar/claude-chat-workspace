# Sprint 3 — Agent Notes

*Started: 2026-03-19 20:00 UTC*

Phase 1 Agents: 2
- agentA-frontend-fixes
- agentB-history-api

Phase 2 Agents: 0
(none)

Automated summaries from each agent are appended below as they complete.

---

## agentB-history-api

*Completed: 2026-03-19 20:01 UTC*

**Files changed:**
- `server.js` — added 3 new endpoints (GET /api/conversations, GET /api/conversations/:id, DELETE /api/conversations/:id)
- `docs/project-memory/sessions/S-2026-03-19-2001-history-api.md` — session doc

**Commands run:**
- `git pull origin main`
- `node --check server.js` (syntax OK)
- `git add` + `git commit`
- `git push -u origin HEAD`

**Notes:**
- No test framework exists in the project; syntax validation passed.
- All three endpoints operate on the existing in-memory `conversations` Map — no persistence layer added (consistent with existing design).
- Unknown IDs return `404 { error: 'not found' }` on both GET and DELETE as specified.


---

## agentA-frontend-fixes

*Completed: 2026-03-19 20:01 UTC*

**Files changed:**
- `public/index.html` — 1 file, 11 insertions / 7 deletions

**Commands run:**
- `git pull` (no upstream, skipped)
- `git add public/index.html && git commit`
- `git push -u origin HEAD`

**Changes made:**

1. **B-004 (triple-asterisk markdown):** Updated `appendFormattedLine()` regex from `(\*\*[^*]+\*\*|\*[^*\n]+\*)` to `(\*{3}[^*]+\*{3}|\*\*[^*]+\*\*|\*[^*\n]+\*)`. Added a new branch at the top of the if/else chain that creates `<strong><em>innerText</em></strong>` when a token starts and ends with `***` and length > 6.

2. **F-004 (always-visible copy button):** Removed `opacity: 0` from `.copy-btn` CSS rule and removed the `.bubble-wrap:hover .copy-btn { opacity: 1; }` rule entirely. Copy button is now always visible; hover still changes color/border.

**Notes:** No test command is defined in `package.json`. The project has no automated test suite — changes were verified by code inspection against the acceptance criteria.

