# Plan: Claude Chat Workspace

## Appetite

**Sprint-sized work.** The v1 implementation is already complete — server, UI, portal integration, Docker image, build script. The immediate work is production deployment (~1 sprint). Subsequent features are each 1-sprint sized.

## What's Already Built (v1)

All code lives in `~/src/everyone-ai/docker/claude-chat-workspace/` and the portal source files.

**New files:**
- `docker/claude-chat-workspace/Dockerfile` — node:20-alpine, port 8080
- `docker/claude-chat-workspace/server.js` — Express + Anthropic SDK + SSE streaming + conversation history Map
- `docker/claude-chat-workspace/public/index.html` — single-file chat SPA (dark theme, DOM-safe markdown renderer)
- `docker/claude-chat-workspace/package.json` — express ^4.18, @anthropic-ai/sdk ^0.36
- `docker/claude-chat-workspace/build-and-push.sh` — SSH to automation EC2, tar context, docker build + ECR push

**Modified files:**
- `portal/src/k8s.js` — `createWorkspacePod()` gains `appId` param; branches to lightweight spec for `claude-chat`
- `portal/src/routes/workspaces.js` — extracts `appId` from POST body, passes to k8s
- `portal/public/js/catalog.js` — adds `claude-chat` to APPS array; hides template selector + auto-start for chat

## Solution Sketch

### The appId branch pattern
```
POST /api/workspaces { appId: 'claude-chat', username, teamSlug }
  → k8s.createWorkspacePod(..., appId)
    → if appId === 'claude-chat': lightweight pod spec (chat image, no postStart, 100m/128Mi)
    → else: existing code-server spec (2GB image, postStart hook, 250m/512Mi)
```

### The LLM adapter (swappable backend)
```js
async function* streamResponse(messages) {
  // Only this function changes when switching providers
  // Currently: Anthropic SDK
  // Future: Ollama, Bedrock, OpenAI-compatible
}
```

### Conversation history
```js
const conversations = new Map();
// Key: crypto.randomUUID() — generated client-side once per page load
// Value: [{role, content}, ...] — full history, passed to API on every turn
```

## Sprint Candidates

### Sprint 1 — Production Deploy (immediate)
Complete the deployment path so the feature is live:
- Build and push `claude-chat-workspace:latest` to ECR via `build-and-push.sh`
- Set `CLAUDE_CHAT_IMAGE` env var on all portal EC2s
- Redeploy portal via `deploy-all-portals.sh`
- Smoke test end-to-end: catalog → launch → chat → streaming response

### Sprint 2 — Conversation UX Polish
Small improvements with high impact:
- "New Chat" button in header (new UUID, clear thread — no page refresh needed)
- Copy conversation to clipboard (full thread as markdown)
- Download conversation as `.md` file
- Show token count / estimated cost per session (optional)

### Sprint 3 — System Prompt & Model Selection
Make the chat configurable without code changes:
- Read `SYSTEM_PROMPT` from env var → inject as system message on every conversation
- Model selector in UI header: Haiku / Sonnet / Opus
- Per-team personas: finance team gets compliance-focused system prompt via portal config

### Sprint 4 — Conversation Persistence
Survive pod restarts:
- Option A: write conversation JSON to a k8s PersistentVolumeClaim (simplest, one-pod)
- Option B: write to S3 keyed by `conversationId` (portable, survives pod deletion)
- "Resume last conversation" button on page load
- Conversation list in sidebar (title = first user message, truncated to 50 chars)

### Sprint 5 — LLM Backend Swap
Demonstrate the adapter pattern in action:
- Add `CLAUDE_CHAT_BACKEND=anthropic|ollama|bedrock` env var
- Implement Ollama adapter for on-prem / no-API-key deployment
- Implement Bedrock adapter using IAM instance role (no API key needed on AWS)
- Test: same UI, same conversation UX, different backend

## Rabbit Holes

- **Rich markdown rendering** — adding a full markdown library (marked.js, etc.) brings XSS risk. The current DOM-based renderer handles 95% of cases safely. Don't over-engineer this.
- **WebSockets** — SSE handles server-to-client streaming cleanly. WebSockets add complexity and aren't needed until multi-user/real-time collaboration is required.
- **Auth layer in the chat server** — network-level access control (Traefik/ALB) is sufficient for the current deployment model. Don't build auth into the app server until there's a clear requirement.
- **Kubernetes operators / CRDs** — the current pod-based model is simple and matches the existing workspace pattern. Don't introduce new k8s abstractions.

## No-Gos

- No multi-user shared chat rooms (v1 is one pod = one user)
- No file upload / vision in v1 (adds Anthropic Files API complexity)
- No separate database service (keep it stateless for v1; persistence via volume or S3 only)
- No build pipeline / bundler for the frontend (single HTML file is the right tradeoff at this size)
- No cramming chat UI into code-server (separate image is the right call — keeps both images clean)

## Market / Prior Art

- **ChatGPT, Claude.ai** — the canonical chat interfaces. We're not competing; we're embedding similar UX inside an org's own k8s infrastructure with their own API key and security controls.
- **Open WebUI** — a self-hosted chat UI for Ollama. More feature-rich but heavier. Claude Chat Workspace is intentionally lighter and portal-native.
- **LibreChat** — open-source multi-LLM chat. Full-featured but complex to deploy. Our value is zero-ops deployment inside existing portal infrastructure.
