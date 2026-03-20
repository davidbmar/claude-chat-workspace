# Sprint 12 — Agent Notes

*Started: 2026-03-20 00:56 UTC*

Phase 1 Agents: 1
- agentA-js-fixes

Phase 2 Agents: 0
(none)

Automated summaries from each agent are appended below as they complete.

---

## agentA-js-fixes

*Completed: 2026-03-20 00:58 UTC*

**Files changed:**
- `public/index.html` — 5 targeted JS edits
- `docs/project-memory/sessions/S-2026-03-20-0058-sprint12-js-fixes.md` — session doc (new)

**Commands run:**
- `git pull` (no upstream, skipped)
- `node -e "require('fs').readFileSync(...)"` — HTML readable ✓
- `npm audit --audit-level=high` — 0 vulnerabilities ✓
- `git add && git commit`
- `git push -u origin HEAD`

**Changes by task:**
| Task | Change |
|------|--------|
| B-019 | Added `updateScrollBtn()`, scroll listener on `#thread`, click handler on `#scroll-btn`, called `updateScrollBtn()` in `scrollToBottom()` |
| B-020 | Changed `.msg` → `.msg.user` in newChatBtn confirm guard |
| B-021 | Removed dead `else if ((e.metaKey \|\| e.ctrlKey) && e.key === 'Enter')` branch |
| B-022 | Added `updatePlaceholder()` + resize listener (short text at ≤600px) |
| F-019 | Stored `parsed.words` in `dataset.wordcount`; updated stats label to "N chars · N words" |

**Notes:** The HTML placeholder in the DOM (`"Message Claude (Enter or Cmd+Enter to send, Shift+Enter for newline)"`) is the static fallback — JS overwrites it immediately on load via B-022.

