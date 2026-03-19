# Roadmap & Architecture

## Roadmap

### Current Focus
**Sprint 9 — Production Deploy**: Build and push the Docker image to ECR, configure `CLAUDE_CHAT_IMAGE` on portal EC2s, redeploy portals. The chat app is feature-complete for v1; the only blocker to real users is this deploy step.

### Next Up
1. **Sprint 10 — Portal Catalog Integration**: Wire up the portal backend to route `appId=claude-chat` to the chat image (vs. code-server). Add the catalog entry in the portal frontend. This is what makes "Claude Chat" appear as a launchable option in the portal UI.
2. **Sprint 11 — Conversation Persistence** *(optional)*: SQLite or file-based storage so conversations survive pod restarts. Unlocks a better history experience for long-running chats.
3. **Sprint 12 — UX Polish**: Conversation export, keyboard shortcuts, token cost estimates.

## Architecture

### System Overview
```
User Browser
     │
     ▼
Traefik (IngressRoute)
     │  username-teamslug.ai.internal.capsule.com
     ▼
K8s Pod (claude-chat-workspace)
     │  port 8080
     ▼
Node.js Express Server (server.js)
  ├── GET  /               → public/index.html (SPA)
  ├── POST /api/chat        → SSE stream (Anthropic SDK)
  ├── GET  /api/conversations/:id
  ├── DELETE /api/conversations/:id
  ├── DELETE /api/conversations (bulk)
  ├── GET  /api/health
  └── GET  /api/stats
     │
     ▼
Anthropic Messages API (claude-sonnet-4-6 default)
```

**Frontend (public/index.html):** Single-file SPA, vanilla JS, no build step, dark theme. Chat history persisted in `localStorage`. Streams via `fetch()` + `ReadableStream`. Markdown rendered DOM-only (no innerHTML).

**Conversation storage:** `Map<conversationId, Message[]>` in process memory. Reset on restart.

### Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Single HTML file | Yes | No build step, easy to inspect and modify, zero dependencies |
| SSE for streaming | Yes | Simpler than WebSockets for one-way streaming; works through load balancers |
| In-memory conversation storage | Yes for v1 | No ops overhead; acceptable reset-on-restart behavior for internal tool |
| DOM-only markdown renderer | Yes | XSS-safe; no external dependencies; full control over output |
| LLM adapter pattern | `async function* streamResponse()` | Swap backend by changing one function; UI and infra are provider-agnostic |
| Same port 8080 | Yes | All existing k8s/Traefik/IngressRoute config works unchanged |
| node:20-alpine base | Yes | ~100MB vs 2GB for code-server; minimal attack surface |

### Technical Constraints
- Port 8080 (required by portal IngressRoute config — all workspaces use this port)
- `ANTHROPIC_API_KEY` injected via K8s Secret (same as code workspace pods)
- No persistent volumes available in current k8s setup — in-memory storage only for v1
- Portal EC2s need `CLAUDE_CHAT_IMAGE` env var set before catalog integration works
- No multi-user routing — each pod is owned by one user (same as code workspaces)

### Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Runtime | Node.js 20 (Alpine) | Tiny image, good SSE/streaming support, team familiarity |
| Framework | Express.js | Minimal, battle-tested, easy SSE with `res.write()` |
| LLM SDK | `@anthropic-ai/sdk` | Official SDK, streaming support, easy to swap via adapter |
| Frontend | Vanilla JS + inline CSS | Zero build step; single file deploy; no npm in production |
| Container | Docker (node:20-alpine) | ~100MB image; same ECR/k8s pipeline as code workspace |
| Storage | In-memory `Map` | No ops complexity for v1; trivially replaceable with SQLite later |
| Markdown | Custom DOM renderer | XSS-safe; no external deps; handles GFM tables, code blocks, lists |
