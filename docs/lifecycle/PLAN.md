# Plan: Claude Chat Workspace

## What Is Built (v1 — Sprint 1–8 Complete)

All core functionality is implemented and Playwright-verified. The app runs locally via Docker Compose.

### Server (server.js)
- Express on port 8080, node:20-alpine (~100MB image)
- `POST /api/chat` — SSE streaming; per-request model selection; system prompt via Anthropic `system` parameter
- `GET/DELETE /api/conversations/:id` — conversation history management
- `DELETE /api/conversations` — bulk clear
- `GET /api/stats` — uptime, conversation count, request count
- `GET /api/health` — k8s readiness probe
- Request logging, graceful SIGTERM/SIGINT shutdown
- Reads `CLAUDE_MODEL` and `SYSTEM_PROMPT` from env vars

### Frontend (public/index.html)
- Single-file SPA — HTML + inline CSS + vanilla JS, no build step
- Dark theme, SSE token streaming with animated loading dots
- Model selector (Haiku / Sonnet / Opus) — persisted in localStorage
- Chat history sidebar with localStorage persistence, click-to-reload, × delete, mobile hamburger toggle
- Copy button below each Claude bubble (never overlaps text — flexbox column layout)
- Character count label after each response
- New Chat button — generates new UUID, clears thread
- DOM-based markdown renderer (no innerHTML/XSS): fenced code blocks, inline code, headings, bold, italic, unordered/ordered lists, horizontal rules, GFM pipe tables

### Infrastructure
- `Dockerfile`, `docker-compose.yml`, `.env.example`, `build-and-push.sh`
- ECR repo: `294499146847.dkr.ecr.us-east-1.amazonaws.com/automation-ai/claude-chat-workspace:latest`

## Appetite

**Remaining work is sprint-sized.** The dev implementation is feature-complete. The next action is production deployment (1 sprint). Everything after that is additive.

## Rabbit Holes

- **Full markdown library (marked.js, etc.)** — the DOM-based renderer covers all practical cases safely. Adding a library introduces XSS surface and a dependency for marginal gain.
- **WebSockets** — SSE is correct for unidirectional streaming. WebSockets only become relevant for multi-user shared rooms.
- **App-level auth** — Traefik/ALB handles access control. Don't build auth into the chat server until there's a compliance requirement.
- **Build pipeline / bundler** — the single HTML file is the right tradeoff at this scale.

## No-Gos (v1)

- No multi-user shared chat rooms
- No file/image upload
- No separate database service
- No conversation persistence (resets on pod restart — planned for v2)

## Sprint Candidates (Next)

### Sprint 9 — Production Deploy
Ship v1 to production:
- Run `build-and-push.sh` to build and push `claude-chat-workspace:latest` to ECR
- Set `CLAUDE_CHAT_IMAGE` env var on all portal EC2s
- Redeploy portal via `deploy-all-portals.sh`
- Smoke test end-to-end: portal catalog → launch → chat → streaming response

### Sprint 10 — Conversation Persistence
Survive pod restarts:
- Option A: write conversation JSON to a k8s PersistentVolumeClaim (one-pod, simplest)
- Option B: write to S3 keyed by `conversationId` (portable, survives pod deletion)
- "Resume last conversation" on page load
- Conversation list sidebar already exists — just needs server-side backing

### Sprint 11 — LLM Backend Swap
Demonstrate the adapter pattern:
- Add `CLAUDE_CHAT_BACKEND=anthropic|ollama|bedrock` env var
- Implement Ollama adapter for on-prem / no-API-key deployment
- Implement Bedrock adapter using IAM instance role

### Sprint 12 — Export + Sharing
Useful for knowledge workers:
- Download conversation as `.md` or `.txt`
- Copy full thread to clipboard as formatted markdown
- Optional: shareable read-only URL (requires persistence first)

### Sprint 13 — System Prompt UI
Make personas configurable without code changes:
- Toggle in header to show/hide active system prompt
- Per-team persona set via `SYSTEM_PROMPT` env var (already supported in server)
- UI indicator when a custom system prompt is active
