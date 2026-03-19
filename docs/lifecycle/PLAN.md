# Plan

## Problem
The portal catalog has one item: Claude Code (full VS Code workspace). Users who want a simple conversation with Claude have no lightweight option. We need a second catalog item — "Claude Chat" — that spins up a clean, minimal chat interface using the same portal/k8s infrastructure.

## Appetite
Small-to-medium batch. The core chat server and UI are complete (Sprints 1–8). Remaining work is primarily: production deploy to ECR, portal catalog integration (appId routing), and quality-of-life improvements. No new infrastructure is needed.

## Solution Sketch
A Node.js Express server with SSE streaming serves a single-file SPA chat UI. The server maintains per-session conversation history in memory. The Docker image uses node:20-alpine (~100MB). Portal backend routes `appId=claude-chat` to this image instead of the code-server workspace image. The frontend uses a DOM-based markdown renderer (no innerHTML, XSS-safe) and stores history in localStorage.

**What is already built (post Sprint 8):**
- Express server: `/api/chat` (SSE), `/api/conversations/:id` (GET/DELETE), `/api/health`, `/api/stats`
- Frontend: dark theme SPA, model selector (Haiku/Sonnet/Opus), chat history sidebar, copy button, character count
- Markdown: headings, bold, italic, bold+italic, code blocks, inline code, ordered/unordered lists, horizontal rules, GFM pipe tables
- Docker: Dockerfile, docker-compose.yml, .env.example, build-and-push.sh

## Market Fit Analysis
Internal tool — no external market to validate. The demand is clear: every team member who has used Claude has expressed wanting a simpler chat interface. The code workspace is actively used but treated as "too much" for simple tasks. Direct replacement for ad-hoc Claude.ai usage within the internal network.

## Differentiation Strategy
Integrated into the existing portal auth/infra with zero friction. No separate login, no separate API key management. Model selector lets users choose the right Claude tier for the task. Clean, distraction-free UI that doesn't fight for attention with IDE chrome.

## Rabbit Holes
- **Persistent storage**: Adding a database for conversation persistence is tempting but not needed for v1. In-memory storage that resets on restart is acceptable.
- **Multi-user features**: Shared rooms, collaborative threads — defer indefinitely.
- **File/image upload**: Technically possible with the Anthropic API but scope-creep for a chat-first tool.
- **LLM backend swap**: The adapter is in place; don't build a configuration UI for it now.

## No-Gos
- No database for this iteration — in-memory only
- No authentication beyond network/Traefik layer
- No file or image upload
- No multi-user shared rooms
- No LLM provider selection UI (adapter is internal only)

## Sprint Candidates

### Sprint 9 — Production Deploy
- Build and push Docker image to ECR (`build-and-push.sh`)
- Set `CLAUDE_CHAT_IMAGE` env var on portal EC2s
- Redeploy portal to pick up the env var
- Verify catalog shows "Claude Chat" as second option
- End-to-end smoke test: launch from portal, send message, see streaming response

### Sprint 10 — Portal Catalog Integration
- `portal/src/k8s.js`: add `appId` parameter to `createWorkspacePod()`; use `CLAUDE_CHAT_IMAGE` when `appId === 'claude-chat'`; skip postStart hook for chat pods
- `portal/src/routes/workspaces.js`: accept `appId` in POST body, pass to k8s
- `portal/public/js/catalog.js`: add `claude-chat` entry to `APPS` array; hide template selector for chat app

### Sprint 11 — Conversation Persistence (Optional)
- Add SQLite or file-based storage for conversations
- Conversations survive server restarts
- History sidebar shows conversations from previous sessions

### Sprint 12 — UX Improvements
- Keyboard shortcut reference (Cmd+K modal or tooltip)
- Export conversation as Markdown
- Token/cost estimate display per message
- Session title auto-generation (first user message truncated)
