# Claude Chat Workspace — Architecture

## System Overview

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
    └── Container: claude-chat
            Image: claude-chat-workspace:latest
            Port: 8080
            Env: ANTHROPIC_API_KEY (from k8s Secret)
            │
            ├── GET /           → serves public/index.html (SPA)
            ├── POST /api/chat  → SSE streaming chat endpoint
            └── GET /api/health → { ok: true }
```

## Docker Image

- **Base:** `node:20-alpine` (~170MB total vs ~2GB for claude-code-workspace)
- **Dependencies:** `express`, `@anthropic-ai/sdk`
- **Entry point:** `server.js`
- **Static files:** `public/index.html` (single-file SPA)
- **Port:** 8080 (same as all workspace types — no infra changes needed)
- **ECR repo:** `294499146847.dkr.ecr.us-east-1.amazonaws.com/automation-ai/claude-chat-workspace:latest`

## Server (server.js)

Express app with three routes:

### `GET /`
Serves `public/index.html`. The entire UI is a single HTML file with inline CSS and vanilla JS — no build step, no framework.

### `POST /api/chat`
Core chat endpoint. Accepts `{ message, conversationId }`.

- Looks up or creates conversation history for the `conversationId`
- Appends the user message to history
- Streams response from Anthropic via Server-Sent Events (SSE)
- Appends the completed assistant response to history
- Returns `data: {"token": "..."}` events as tokens arrive, then `data: {"done": true}`

### `GET /api/health`
Returns `{ ok: true }`. Used by k8s readiness probes (if configured).

## The LLM Adapter Pattern

The most important architectural decision: the LLM backend is isolated behind a single async generator function:

```js
// server.js — the ONLY function that changes when switching LLM providers
async function* streamResponse(messages) {
  const stream = client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages,
  });
  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      yield event.delta.text;
    }
  }
}
```

The conversation history management, SSE streaming protocol, and UI are all completely backend-agnostic. Swapping to Bedrock, Ollama, an OpenAI-compatible endpoint, or any other provider means replacing only this one function.

## SSE Streaming Protocol

Client-server contract for the chat stream:

```
Client: POST /api/chat
        { message: "...", conversationId: "uuid-v4" }

Server: Content-Type: text/event-stream
        data: {"token": "Hello"}\n\n
        data: {"token": " there"}\n\n
        data: {"token": "!"}\n\n
        data: {"done": true}\n\n
```

Error case:
```
        data: {"error": "message"}\n\n
```

The client uses `fetch()` + `ReadableStream` reader (not `EventSource`) because EventSource only supports GET. The SSE format is identical — just read manually via `response.body.getReader()`.

## Conversation History

```js
const conversations = new Map();
// Key: conversationId (UUID generated client-side, once per page load)
// Value: [{role: 'user', content: '...'}, {role: 'assistant', content: '...'}, ...]
```

- History is keyed by `conversationId`, which is `crypto.randomUUID()` generated in the browser on page load
- Each new page load = new conversation ID = fresh history
- Refreshing the page starts a new conversation (intentional for v1)
- History is stored in server memory — resets on pod restart
- The full history array is passed to the Anthropic API on every request (gives Claude full context)

## Frontend (public/index.html)

Single-file SPA: HTML + inline CSS + vanilla JS, no build step, no external dependencies.

Key design decisions:
- **Dark theme** matching the team platform aesthetic
- **User bubbles right, Claude bubbles left** — standard chat convention
- **SSE token streaming** — tokens append to the last Claude bubble in real time
- **DOM-based markdown renderer** — no `innerHTML` with untrusted content; uses `textContent` and `createElement` to safely render fenced code blocks, inline code, and line breaks
- **`crypto.randomUUID()`** for conversation ID — browser-native, no library needed
- **Enter to send, Shift+Enter for newline** — standard textarea behavior
- **Auto-scroll** on new tokens

## Kubernetes Integration

### Pod Spec (appId === 'claude-chat')

```js
{
  containers: [{
    name: 'claude-chat',
    image: process.env.CLAUDE_CHAT_IMAGE || '...ecr.../claude-chat-workspace:latest',
    ports: [{ containerPort: 8080 }],
    env: [
      { name: 'USERNAME', value: username },
      { name: 'TEAM_SLUG', value: teamSlug },
      { name: 'ANTHROPIC_API_KEY', valueFrom: { secretKeyRef: ... } },
    ],
    resources: {
      requests: { memory: '128Mi', cpu: '100m' },  // lighter than code-server (512Mi/250m)
      limits: { memory: '512Mi', cpu: '500m' },
    },
  }],
  restartPolicy: 'Never',
  // NO lifecycle.postStart hook — no template clone, no CLAUDE.md injection
}
```

Key differences from claude-code-workspace pods:
- Different image (`claude-chat-workspace` vs `claude-code-workspace`)
- No `postStart` lifecycle hook (no template repo clone, no CLAUDE.md injection, no alias setup)
- Smaller resource requests (100m CPU, 128Mi memory vs 250m/512Mi)
- Container name is `claude-chat` vs `code-server`

### Service and IngressRoute
**Identical** to code-server workspaces — no changes needed. Both use port 8080, same URL pattern (`<username>-<teamslug>.<TEAM_DOMAIN>`), same Traefik routing.

### API Key Injection
**Identical** to code-server workspaces — the portal creates a k8s Secret with `ANTHROPIC_API_KEY` and injects it via `secretKeyRef`. The chat server reads it from `process.env.ANTHROPIC_API_KEY`.

## Portal Integration

Three files changed in the `everyone-ai` portal:

### `portal/src/k8s.js`
`createWorkspacePod(username, teamSlug, apiKey, templateId, appId)` — new `appId` parameter. When `appId === 'claude-chat'`, branches to the lightweight pod spec. Otherwise falls through to the existing code-server logic.

### `portal/src/routes/workspaces.js`
`POST /api/workspaces` now extracts `appId` from `req.body` and passes it to `k8s.createWorkspacePod()`.

### `portal/public/js/catalog.js`
- Added `claude-chat` entry to the `APPS` array
- Template selector and auto-start checkbox are skipped for `claude-chat` (null-guarded, conditionally appended in DOM order)
- `launchWorkspace()` sends `appId: app.id` in POST body (was already doing this)

## Build & Deploy

```bash
# Build and push to ECR (from everyone-ai repo)
bash docker/claude-chat-workspace/build-and-push.sh

# Set on portal EC2s
CLAUDE_CHAT_IMAGE=294499146847.dkr.ecr.us-east-1.amazonaws.com/automation-ai/claude-chat-workspace:latest

# Redeploy portals
bash scripts/deploy-all-portals.sh
```
