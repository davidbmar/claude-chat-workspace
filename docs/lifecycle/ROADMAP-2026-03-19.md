# Roadmap & Architecture: Claude Chat Workspace

## Milestones

| Milestone | Status | Description |
|-----------|--------|-------------|
| v1 Core — server + UI | ✅ Done | Express SSE server, single-file SPA, streaming chat |
| v1 Portal Integration | ✅ Done | appId pattern, k8s lightweight pod spec, catalog card |
| UX Polish | ✅ Done | New Chat, model selector, copy button, char count |
| Chat History Sidebar | ✅ Done | localStorage persistence, click-to-reload, delete |
| Full Markdown Renderer | ✅ Done | Headings, lists, tables, bold, italic, code blocks |
| Mobile Responsive | ✅ Done | Hamburger sidebar, responsive layout ≤600px |
| Operational Endpoints | ✅ Done | /api/stats, /api/health, request logging, graceful shutdown |
| Bug-free UX | ✅ Done | Model persistence, copy button layout, table rendering |
| **Production Deploy** | 🔲 Next | Build + push to ECR, set env vars on portal EC2s, redeploy |
| Conversation Persistence | 🔲 Planned | PVC or S3-backed history, survive pod restarts |
| LLM Backend Swap | 🔲 Planned | Ollama + Bedrock adapters, `CLAUDE_CHAT_BACKEND` env var |
| Export / Sharing | 🔲 Planned | Download as markdown, copy full thread |
| System Prompt UI | 🔲 Planned | Show/hide active prompt, visual indicator |

## Architecture

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
    └── Container: claude-chat (~100MB node:20-alpine)
            Port: 8080
            Env: ANTHROPIC_API_KEY (from k8s Secret)
                 CLAUDE_MODEL (optional override)
                 SYSTEM_PROMPT (optional persona)
            │
            ├── GET /           → serves public/index.html (SPA)
            ├── POST /api/chat  → SSE streaming (fetch + ReadableStream)
            ├── GET/DELETE /api/conversations/:id
            ├── DELETE /api/conversations  (bulk clear)
            ├── GET /api/stats  → uptime, counts
            └── GET /api/health → { ok: true }
```

## LLM Adapter Pattern

The most important architectural decision — the LLM backend is isolated behind a single async generator:

```js
// Only this function changes when switching providers
async function* streamResponse(messages, model) {
  const stream = client.messages.stream({
    model: model || process.env.CLAUDE_MODEL || 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: process.env.SYSTEM_PROMPT || undefined,
    messages,
  });
  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      yield event.delta.text;
    }
  }
}
```

Swapping to Ollama, Bedrock, or any OpenAI-compatible endpoint means replacing only this function.

## Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Runtime | node:20-alpine | Same as portal; Anthropic SDK first-class Node support; ~100MB |
| Streaming protocol | SSE (fetch + ReadableStream) | Simpler than WebSockets for unidirectional streaming; works through all proxies |
| Conversation history | In-memory Map | Simple for v1; pod lifecycle matches session lifecycle |
| Markdown rendering | DOM-based (no innerHTML) | XSS-safe; handles 95% of cases with ~80 lines of vanilla JS |
| Frontend | Single HTML file | Zero build tooling; trivial to debug and deploy |
| Auth | Network-level (Traefik/ALB) | Consistent with code-server workspaces; no app-level auth needed |
| Model selection | Per-request + env fallback | Frontend sends model in POST body; server falls back to CLAUDE_MODEL env var |
| History persistence | localStorage (client) + in-memory (server) | Zero infrastructure for v1; server-side persistence planned for v2 |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Server runtime | Node.js 20 (node:20-alpine) |
| Server framework | Express 4.x |
| LLM SDK | @anthropic-ai/sdk 0.36+ |
| Container | Docker, node:20-alpine base |
| Orchestration | Kubernetes (via everyone-ai portal) |
| Routing | Traefik IngressRoute |
| Frontend | Vanilla JS + inline CSS, no build step |
| Streaming | Server-Sent Events (SSE) |
| Storage (v1) | In-memory (server) + localStorage (client) |

## Future Architecture Evolution

**Persistence (v2):** Add a PVC mount at `/data/conversations/`. Each conversation is a JSON file keyed by UUID. On page load, the client reads localStorage history IDs and hydrates from the server. Pod restarts no longer lose conversations.

**Multi-backend (v3):** `CLAUDE_CHAT_BACKEND` env var selects the adapter at startup. Ollama adapter calls the local Ollama API (no API key). Bedrock adapter uses AWS SDK + instance IAM role. All adapters implement the same `async function* streamResponse(messages, model)` interface.

**Multi-user rooms (future):** Switch from per-pod to shared deployment. Add WebSocket layer for real-time multi-user. Conversations keyed by `{roomId, userId}`. Requires auth layer (JWT or Traefik forward-auth).
