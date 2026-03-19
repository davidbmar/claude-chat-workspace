# Claude Chat Workspace — Sprint History

## Sprint 1 — Standalone Setup + UX Polish
**Goal:** Copy v1 code from everyone-ai repo into standalone repo, add Docker Compose, env config, UX improvements.

**Delivered:**
- Copied server.js, Dockerfile, package.json, build-and-push.sh from everyone-ai
- Created docker-compose.yml and .env.example
- server.js reads CLAUDE_MODEL and SYSTEM_PROMPT from env vars
- public/index.html: New Chat button, model selector (Haiku/Sonnet/Opus), copy button on Claude bubbles

## Sprint 2 — Bug Fixes + Loading Indicator
**Goal:** Fix critical bugs found in initial smoke test.

**Delivered:**
- B-001: Server now uses per-request model from POST body (was ignoring it)
- B-002: System prompt uses Anthropic API `system` parameter (was prepending fake user message)
- B-003: Corrected Opus model ID to claude-opus-4-5
- F-003: Animated loading dots before first token arrives

## Sprint 3 — Markdown Fixes + Conversations API
**Goal:** Fix markdown rendering, improve copy button, add server-side conversation management.

**Delivered:**
- B-004: Fixed ***bold+italic*** combined markdown rendering
- F-004: Copy button made always-visible (not hover-only)
- Added GET /api/conversations/:id and DELETE /api/conversations/:id endpoints

## Sprint 4 — Chat History Sidebar
**Goal:** Add persistent conversation history in the UI.

**Delivered:**
- F-005: localStorage-based chat history sidebar with click-to-reload
- Conversations stored by ID in localStorage['chat-history']
- Click loads conversation via GET /api/conversations/:id
- Server: enhanced conversations API to return message previews

## Sprint 5 — Markdown Headings/Lists + Stale History Handling
**Goal:** Extend markdown renderer, handle expired conversations gracefully.

**Delivered:**
- F-006: Heading rendering (#, ##, ### → h1/h2/h3)
- F-007: Unordered list rendering (- item → ul/li)
- B-006: Stale history entries show inline error + auto-remove from localStorage on 404
- Server: request logging middleware, graceful shutdown, bulk DELETE /api/conversations

## Sprint 6 — More Markdown + Mobile Layout + Stats
**Goal:** Complete markdown feature set, mobile responsive layout, operational endpoints.

**Delivered:**
- F-008: Ordered list rendering (1. item → ol/li)
- F-009: Horizontal rule rendering (--- → hr)
- F-010: Mobile responsive layout — sidebar hidden ≤600px, hamburger toggle
- GET /api/stats endpoint: uptime, conversation count, request count, version

## Sprint 7 — History Delete + Character Count
**Goal:** Delete individual history entries, show response character count.

**Delivered:**
- F-011: × button on each history entry removes from localStorage + calls DELETE /api/conversations/:id
- F-012: SSE done event includes chars/words counts; "N chars" label shown below each Claude response

## Sprint 8 — Final Polish
**Goal:** Fix remaining UI bugs identified by Playwright smoke tests.

**Delivered:**
- B-007: GFM pipe table rendering (| col | col | / |---|---| → HTML table)
- B-008: Model selection persisted in localStorage — survives page reload
- B-005: Copy button repositioned below bubble using flexbox (no longer overlaps text)

## Current State
All planned backlog items are Done. The app is feature-complete for v1 local development.
Outstanding work: push Docker image to ECR, set CLAUDE_CHAT_IMAGE env var on portal EC2s, redeploy portal.
