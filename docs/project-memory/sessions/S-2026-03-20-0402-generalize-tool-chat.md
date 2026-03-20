# S-2026-03-20-0402-generalize-tool-chat

**Title:** Sprint 20 — Generalize to configurable tool-chat module + mobile/UX fixes
**Goal:** Turn claude-chat-workspace into a reusable Docker image powered by env vars; fix user bubble markdown, mobile header wrap, and input safe-area clipping.
**Context:** Sprint 20, agentA owns all changes (server.js + public/index.html).

## Plan
1. F-020: Add TOOL_NAME/TOOL_ICON/TOOL_DESCRIPTION/TOOL_COLOR env vars + /api/config endpoint
2. B-054: User bubbles use renderTextInto (full markdown, not just inline)
3. B-055: Mobile 480px breakpoint hides "New Chat" text, truncates title
4. B-056: Safe-area padding on input container

## Changes Made
- `server.js`: Added TOOL_NAME/TOOL_ICON/TOOL_DESCRIPTION/TOOL_COLOR constants (with defaults); added GET /api/config endpoint; SYSTEM_PROMPT injection was already present
- `public/index.html`:
  - CSS: Added `--tool-color: #7c3aed`; wired send-btn, user-bubble, scroll-btn to `var(--tool-color)`
  - CSS: Added `@media (max-width: 480px)` for B-055 — hides New Chat text, truncates title
  - CSS: Added `padding-bottom: max(20px, env(safe-area-inset-bottom, 20px))` for B-056
  - HTML: Added `id="app-logo"`, `id="app-title"`, `id="empty-state-icon"`, wrapped New Chat text in `<span>`
  - JS: Added `toolConfig` module-level var and `fetch('/api/config')` to apply title/icon/description/color on load
  - JS: Replaced `appendInlineSegmentsSingleLine(userBubble, ...)` with `renderTextInto(userBubble, ...)` in sendMessage and loadConversation (B-054)
  - JS: All empty-state icon recreations use `toolConfig.toolIcon` instead of hardcoded emoji

## Decisions Made
- SYSTEM_PROMPT was already implemented in server.js from a prior sprint; only the config endpoint + new vars were needed
- `--tool-color` replaces per-element colors for send btn, user bubble, scroll btn — single JS setProperty call applies the entire theme
- Team-name hostname logic preserved as fallback; config `toolDescription` overrides it when set
- `white-space: pre-wrap` removed from user bubble since `renderTextInto` inserts DOM nodes (not raw text), making pre-wrap unnecessary
