# Claude Chat Workspace — Current Implementation (Post Sprint 8)

## What Is Built Today

This is the current state as of Sprint 8. The project started as a design and has been fully implemented across 8 sprints.

### Server (server.js)

Express app running on port 8080:
- `GET /` — serves public/index.html
- `POST /api/chat` — SSE streaming chat; accepts `{ message, conversationId, model }`; uses per-request model override
- `GET /api/conversations/:id` — retrieve conversation history by ID
- `DELETE /api/conversations/:id` — delete a conversation
- `DELETE /api/conversations` — bulk clear all conversations
- `GET /api/health` — `{ ok: true }` health check
- `GET /api/stats` — `{ uptime, conversationCount, messageCount, requestCount, version }`
- System prompt: reads `SYSTEM_PROMPT` env var, uses Anthropic API `system` parameter (not a fake user message)
- Model: reads per-request `model` field from POST body; falls back to `CLAUDE_MODEL` env var, then `claude-sonnet-4-6`
- Request logging middleware on all routes
- Graceful shutdown on SIGTERM/SIGINT

### Frontend (public/index.html)

Single-file SPA, dark theme, vanilla JS + inline CSS. No build step, no dependencies.

#### Layout
- Left sidebar: "HISTORY" — lists past conversations from localStorage
  - Each entry shows truncated title (first user message)
  - × button to delete entry (removes from localStorage + calls DELETE /api/conversations/:id)
  - Click entry loads conversation via GET /api/conversations/:id
  - Mobile responsive: sidebar hidden on screens ≤600px, hamburger toggle button
  - Graceful 404: if server restarted and conversation is gone, shows inline error message
- Header: project icon + "Claude Chat" title + model selector + "New Chat" button
- Thread: message bubbles (user right, Claude left)
- Input area: textarea + send button; Enter to send, Shift+Enter for newline

#### Model selector
- Dropdown with 3 options: Haiku (fast), Sonnet (balanced, default), Opus (powerful)
- Selection persisted in `localStorage['selectedModel']` — survives page reload
- Selected model sent as `model` field in every POST /api/chat request

#### Streaming
- SSE via `fetch()` + `ReadableStream` reader
- Animated loading dots (3 bouncing dots) before first token arrives
- Blinking cursor during streaming
- Auto-scroll on new tokens
- Input and send button disabled during streaming

#### Markdown renderer (DOM-based, no innerHTML, XSS-safe)
Supports:
- Fenced code blocks (``` ``` ```) with monospace styling
- Inline code (`code`)
- Headings: `#`, `##`, `###` → h1, h2, h3
- Bold: `**text**`
- Italic: `*text*`
- Bold+italic: `***text***`
- Unordered lists: `- item` → `<ul><li>`
- Ordered lists: `1. item` → `<ol><li>`
- Horizontal rule: `---` → `<hr>`
- GFM pipe tables: `| col | col |` / `|---|---|` → `<table><thead><tbody>`
- Line breaks → `<br>`
All rendering uses `createElement` + `textContent` only — no `innerHTML` with dynamic content.

#### Copy button
- Appears below each Claude response bubble (flexbox column layout)
- Copies bubble text to clipboard via `navigator.clipboard.writeText()`
- Shows "Copied!" for 1500ms then reverts to "Copy"

#### Character count
- After each completed Claude response, shows "N chars" label below the copy button
- Count comes from the SSE `done` event which includes `chars` and `words` fields

#### New Chat button
- Generates new `crypto.randomUUID()` conversationId
- Clears thread, re-shows empty state
- Preserves history sidebar entries

### Docker / Deployment
- `Dockerfile`: FROM node:20-alpine, ~100MB image
- `docker-compose.yml`: single service, build: ., ports 8080:8080, env_file: .env
- `.env.example`: ANTHROPIC_API_KEY, PORT, CLAUDE_MODEL, SYSTEM_PROMPT
- `build-and-push.sh`: SSH to automation EC2, tar build context, docker build, push to ECR
- ECR repo: `294499146847.dkr.ecr.us-east-1.amazonaws.com/automation-ai/claude-chat-workspace:latest`

### What Is NOT Built (Known Gaps)
- No persistent conversation storage (in-memory only — resets on pod/container restart)
- No authentication beyond network-level (Traefik/ALB)
- No multi-user shared rooms
- No file/image upload
- No LLM backend swap (currently Anthropic-only)
- Production deploy to ECR not yet done (image built locally but not pushed)
