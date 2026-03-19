# Roadmap & Architecture: Claude Chat Workspace

## Current Focus

**Immediate:** Production deployment of v1 — build ECR image, set env vars on portal EC2s, redeploy. The code is complete; it just needs to ship.

**Near-term:** Conversation UX polish (new chat button, copy/export) and system prompt configurability.

**Medium-term:** Conversation persistence and LLM backend swappability.

**Long-term:** Standalone deployment (Docker Compose, no portal dependency), multi-user rooms, RAG/knowledge-base integration.

## Milestones

| Milestone | Status | Description |
|-----------|--------|-------------|
| v1 code complete | ✅ Done | Server, UI, portal integration, Docker image, build script |
| v1 production deploy | 🔲 Next | Build ECR image, set env vars, redeploy portals |
| UX polish | 🔲 Sprint 2 | New chat button, copy/export |
| System prompt + model select | 🔲 Sprint 3 | Configurable persona, model picker in UI |
| Conversation persistence | 🔲 Sprint 4 | PVC or S3, resume last conversation |
| LLM backend swap | 🔲 Sprint 5 | Ollama + Bedrock adapters |
| Standalone deploy | 🔲 Future | Docker Compose, no portal dependency |
| Multi-user rooms | 🔲 Future | WebSocket-based shared sessions |

## System Architecture

```
User Browser
    │
    │ HTTPS
    ▼
AWS ALB  →  Traefik IngressRoute
    │           Host: <username>-<teamslug>.ai.internal.capsule.com
    ▼
k8s Service (ClusterIP, port 8080)
    │
    ▼
Pod: workspace-<username>-<teamslug>
    └── Container: claude-chat  (node:20-alpine, ~100MB)
            Env: ANTHROPIC_API_KEY (from k8s Secret)
            │
            ├── GET /           → public/index.html  (SPA)
            ├── POST /api/chat  → SSE streaming endpoint
            └── GET /api/health → { ok: true }
```

**SSE streaming protocol:**
```
POST /api/chat { message, conversationId }
  → data: {"token": "Hello"}\n\n
  → data: {"token": " world"}\n\n
  → data: {"done": true}\n\n
```

**Conversation history (in-memory v1):**
```
Map<conversationId, [{role, content}, ...]>
  Key:   crypto.randomUUID() — generated in browser on page load
  Value: full message history — passed to Anthropic API on every turn
  Lifecycle: resets on pod restart
```

**LLM adapter (swappable):**
```js
async function* streamResponse(messages) {
  // Replace this function to change providers
  // Currently: Anthropic claude-sonnet-4-6
  // Planned: Ollama (local), Bedrock (AWS), OpenAI-compatible
}
```

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Runtime | Node.js 20 Alpine | Matches portal stack; Anthropic SDK first-class support; Alpine keeps image ~100MB |
| Framework | Express | Minimal overhead; SSE support; team familiarity |
| Frontend | Single HTML file, no build | Zero tooling complexity; UI is simple enough (~300 lines) |
| Streaming | SSE over WebSockets | Unidirectional streaming; works through all proxies; simpler protocol |
| History storage | In-memory Map (v1) | Stateless simplicity; matches pod lifecycle; persistence is a planned sprint |
| Markdown rendering | DOM-based (no innerHTML) | XSS safety without a library dependency |
| Conversation ID | crypto.randomUUID() | Browser-native; no library; new ID per page load = new conversation |
| Port | 8080 | Matches all other workspace types; zero infra changes |
| PostStart hook | Skipped for claude-chat | Not applicable — no template repo, no CLAUDE.md, no CLI auto-start |
| Resource requests | 100m CPU / 128Mi RAM | Chat server is far lighter than VS Code; allows more concurrent sessions |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Container runtime | Docker (node:20-alpine base) |
| Server framework | Express 4.x |
| LLM SDK | @anthropic-ai/sdk ^0.36 |
| Frontend | Vanilla JS + HTML + CSS (no framework) |
| Streaming | Server-Sent Events (SSE) |
| Orchestration | Kubernetes (k3s on EC2) |
| Routing | Traefik IngressRoute |
| Image registry | AWS ECR |
| Secret management | Kubernetes Secrets |
| Build/deploy | SSH to automation EC2 + docker build + ECR push |

## Constraints

- **Port 8080** — must match all other workspace types (Traefik routes to 8080 for all pods)
- **Single pod per user** — current portal model; one `workspace-<user>-<team>` pod at a time
- **API key via env** — injected by portal from k8s Secret; server reads `process.env.ANTHROPIC_API_KEY`
- **No imagePullSecrets** — EC2s use IAM instance profiles for ECR auth
- **Node memory** — in-memory conversation history grows unboundedly; large/long-lived sessions could OOM the 512Mi limit; persistence sprint should address this
- **Stateless pod** — no persistent volume in v1; history resets on pod stop/restart

## Future Architecture Evolution

**With persistence (Sprint 4):**
```
Pod → write conversation JSON to PVC or S3
    → on load: fetch last conversationId from storage → resume
```

**With multi-backend (Sprint 5):**
```
CLAUDE_CHAT_BACKEND=ollama
  → streamResponse() delegates to Ollama HTTP API
  → no API key needed; runs fully on-prem
```

**Standalone (Future):**
```
docker-compose up
  → claude-chat on :8080
  → no Kubernetes, no portal, no Traefik
  → env file sets ANTHROPIC_API_KEY + optional SYSTEM_PROMPT
```
