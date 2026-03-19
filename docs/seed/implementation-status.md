# Claude Chat Workspace — Implementation Status

## What Has Been Built (v1)

All v1 code lives in `~/src/everyone-ai/docker/claude-chat-workspace/` and the portal source.

### Files Created

| File | Description |
|------|-------------|
| `docker/claude-chat-workspace/Dockerfile` | node:20-alpine, installs express + @anthropic-ai/sdk, port 8080 |
| `docker/claude-chat-workspace/server.js` | Express server with SSE chat endpoint and conversation history |
| `docker/claude-chat-workspace/public/index.html` | Single-file chat SPA (dark theme, streaming, safe markdown renderer) |
| `docker/claude-chat-workspace/package.json` | Dependencies: express ^4.18, @anthropic-ai/sdk ^0.36 |
| `docker/claude-chat-workspace/build-and-push.sh` | SSH to automation EC2, tar build context, docker build + ECR push |

### Files Modified

| File | Change |
|------|--------|
| `portal/src/k8s.js` | `createWorkspacePod()` gains `appId` param; branches to lightweight spec when `appId === 'claude-chat'` |
| `portal/src/routes/workspaces.js` | Extracts `appId` from POST body, passes to k8s |
| `portal/public/js/catalog.js` | Adds `claude-chat` to APPS array; conditionally hides template selector + auto-start for chat |

## What Works

- Full chat UI with streaming token display
- Conversation history maintained per session (in-memory, server-side)
- SSE streaming via `fetch()` + `ReadableStream` reader
- Safe DOM-based markdown renderer (fenced code blocks, inline code, line breaks — no innerHTML XSS)
- Portal catalog shows both "Claude Code" and "Claude Chat" as separate app cards
- Launching "Claude Chat" skips the template selector and auto-start checkbox
- k8s pod created with correct image, smaller resource footprint, no postStart hook
- Same URL pattern, Service, IngressRoute as code-server workspaces
- API key injected via k8s Secret (same mechanism as code-server)

## What Is NOT Built Yet (Known Gaps)

### Persistence
- Conversation history lives in server memory → resets when pod restarts or is stopped
- No database, no file-based persistence
- No way to resume a previous conversation

### Authentication / Access Control
- The chat UI has no auth layer beyond what Traefik/ALB provides at the network level
- Any user who knows the URL can chat (same as code-server workspaces)

### Multi-User Sessions
- One pod = one user (current architecture mirrors code-server workspaces)
- No shared chat rooms or team-visible conversations

### System Prompt Customization
- Currently no way to set a system prompt or persona from the UI
- Model is hardcoded to `claude-sonnet-4-6` in server.js

### Conversation Management
- No "new conversation" button (page refresh is the workaround)
- No conversation list / history browser
- No export (copy to clipboard, download as markdown, etc.)

### Production Deployment
- Image has not been built and pushed to ECR yet
- `CLAUDE_CHAT_IMAGE` env var not yet set on portal EC2s
- Portal has not been redeployed with the catalog changes

## Design Decisions Made

### Why node:20-alpine and not Python?
Node is already what the portal uses. The Anthropic SDK has first-class Node.js support. Alpine keeps the image small (~100MB vs ~170MB for slim).

### Why in-memory history and not Redis/DB?
Simplicity for v1. The use case is short-lived sessions — the pod is stopped when done, just like a code-server workspace. Adding persistence is a sprint-sized feature, not a prerequisite.

### Why SSE over WebSockets?
SSE is simpler for unidirectional streaming (server → client). No connection upgrade, no protocol overhead, works through all proxies and load balancers that handle HTTP. WebSockets would be needed if the client needed to push data mid-stream (not the case here).

### Why single-file HTML instead of a build pipeline?
Zero complexity, zero tooling. The UI is simple enough that a build step adds no value. The entire UI is ~300 lines of HTML/CSS/JS. This also makes the Docker image trivially simple to build and debug.

### Why DOM-based markdown rendering instead of a library?
Avoiding `innerHTML` with dynamic content prevents XSS. A library like marked.js or DOMPurify would work, but adds a dependency and complexity for what is essentially: render code blocks, inline code, and line breaks. The DOM-based renderer handles these three cases safely with ~40 lines of vanilla JS.

### Why skip the postStart lifecycle hook?
The postStart hook in code-server workspaces does three things: clones a template repo, injects CLAUDE.md, and sets up auto-start. None of these make sense for a chat server:
- No filesystem to clone a template into
- No Claude Code CLI to auto-start
- No CLAUDE.md — the chat server has its own system prompt (or none)
