# Sprint 1 — Agent Notes

*Started: 2026-03-19 19:48 UTC*

Phase 1 Agents: 2
- agentA-standalone-setup
- agentB-ux-polish

Phase 2 Agents: 0
(none)

Automated summaries from each agent are appended below as they complete.

---

## agentA-standalone-setup

*Completed: 2026-03-19 19:50 UTC*

**Files changed** (9 files, 274 insertions):
- `server.js` — copied + edited: `CLAUDE_MODEL` env var, `SYSTEM_PROMPT` injection
- `Dockerfile` — copied from source
- `package.json` — copied from source
- `build-and-push.sh` — copied from source
- `docker-compose.yml` — created (single service, port 8080, env_file .env)
- `.env.example` — created (4 vars: API key, PORT, model, system prompt)
- `.gitignore` — added `.env` entry
- `README.md` — created (What It Is, Quick Start, env vars table, ECR build)
- `docs/project-memory/sessions/S-2026-03-19-1949-standalone-setup.md` — session doc

**Commands run:**
- `node --check server.js` — syntax OK
- `git add` + `git commit`
- `git push -u origin HEAD`

**Notes / follow-on work:**
- Agent B owns `public/index.html` (new chat button, copy-to-clipboard, model selector) — no overlap with this branch
- The SYSTEM_PROMPT unshift mutates `history`, so the injected system message persists in the server's in-memory store for the conversation. If clean history storage is preferred, a shallow copy should be passed to `streamResponse` instead — worth noting as a follow-on decision.


---

## agentB-ux-polish

*Completed: 2026-03-19 19:51 UTC*

**Files changed**
- `public/index.html` — created (copied from source, then polished)

**Commands run**
- `git pull origin agentB-ux-polish` (no remote yet)
- `mkdir -p public/`
- `git add public/index.html`
- `git commit` with session ID `S-2026-03-19-1951-ux-polish`
- `git push -u origin HEAD`

**What was implemented**
1. **New Chat button** — ghost style in header right; on click generates `crypto.randomUUID()` conversationId, clears thread via DOM removal, re-appends fresh empty-state using safe `textContent` (no `innerHTML`)
2. **Model selector** — `<select>` with Haiku/Sonnet/Opus options; Sonnet default; updates `currentModel` variable on change
3. **`model` field in POST body** — `sendMessage()` now sends `{ message, conversationId, model: currentModel }`
4. **Copy button on Claude bubbles** — each Claude `addMsg()` wraps bubble in `.bubble-wrap` (relative), appends `.copy-btn` (absolute top-right); hover CSS shows it; click calls `navigator.clipboard.writeText()`, shows "Copied!" for 1500ms then reverts

**Notes / follow-on**
- Agent A (server.js) needs to read the `model` field from the POST body and pass it to the Anthropic API — otherwise the selector has no effect server-side
- `navigator.clipboard` requires HTTPS or localhost; fails silently in plain HTTP deployments

