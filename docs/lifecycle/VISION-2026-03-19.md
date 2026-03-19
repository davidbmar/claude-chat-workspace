# Vision: Claude Chat Workspace

## Product Name

Claude Chat Workspace

## Problem Statement

The existing team AI platform (everyone-ai) offers only one catalog item: "Claude Code" — a full VS Code workspace running in a 2GB Docker container. It's powerful for building things, but it's the wrong tool when someone just wants to talk to Claude. Cold starts take 2–8 minutes. The editor, file tree, and terminal are irrelevant noise for a non-technical user who wants to ask a question, draft a document, or brainstorm an idea.

There's a gap between "I want to use Claude" and "I want to build something with Claude Code." Non-technical team members in finance, HR, operations, and compliance are being handed a power tool when they just need a conversation.

## Target Audience

**Primary:** Non-technical team members who want conversational AI without a coding environment — finance analysts, HR specialists, compliance officers, operations staff. They want to ask questions, draft content, and reason through problems. They don't need a terminal.

**Secondary:** Technical users who want a fast, lightweight Claude scratchpad — a quick conversation before spinning up a full workspace, or a side-channel to think through a problem without interrupting their coding session.

**Platform context:** Teams deploying the everyone-ai portal on their own Kubernetes infrastructure, where adding a lightweight second catalog item requires zero new infrastructure.

## Key Differentiators

- **~100MB image vs 2GB** — starts in seconds, not minutes. No cold start penalty.
- **Zero friction for non-technical users** — no terminal, no file tree, no code editor. Just type and get a response.
- **Same infrastructure, zero ops overhead** — runs on the same k8s cluster, same Traefik routing, same API key injection as Claude Code workspaces. Adding it required changing three files in the portal.
- **Swappable LLM backend by design** — the adapter pattern isolates the Anthropic SDK behind a single `streamResponse()` generator. Swap to Bedrock, Ollama, or any OpenAI-compatible endpoint without touching the UI.
- **Full conversation continuity** — full message history maintained server-side per session. Claude sees the whole conversation, not just the last message.
- **Rich UX** — model selector (Haiku/Sonnet/Opus), chat history sidebar, GFM markdown rendering, mobile responsive, copy button, char count.

## Solution Overview

Claude Chat Workspace is a minimal Node.js server (Express + Anthropic SDK) that serves a single-page chat UI on port 8080 — the same port everything else uses. When a user launches "Claude Chat" from the portal catalog, the portal creates a k8s pod with the `claude-chat-workspace` image instead of the `claude-code-workspace` image. Everything else — Service creation, IngressRoute, API key injection, URL pattern, workspace list — is identical.

The UI is a single HTML file with inline CSS and vanilla JS. No build step, no framework dependencies. It presents a clean dark-themed chat interface: user messages on the right, Claude responses on the left, tokens streaming in as they arrive via Server-Sent Events. A safe DOM-based markdown renderer handles the full GFM feature set (headings, lists, tables, code blocks, bold/italic) without any XSS risk.

A chat history sidebar persists conversations in localStorage and reloads them from the server on demand. The model selector lets users switch between Haiku, Sonnet, and Opus — the choice is remembered across page reloads. The interface is mobile-responsive with a hamburger-toggled sidebar.

## Success Criteria

- A non-technical team member can open the portal, click "Claude Chat", enter their name, and be in a conversation with Claude in under 60 seconds (vs 2–8 minutes for Claude Code)
- The chat interface is usable without any explanation — no walkthrough, no onboarding
- Streaming responses feel responsive — first token appears within 2 seconds of sending a message
- The image builds and deploys cleanly through the existing ECR/portal pipeline
- Claude Chat workspaces appear alongside Claude Code workspaces in the workspace list and stop/delete identically
- The LLM adapter can be swapped (e.g. to Ollama) by changing one function in `server.js` without touching the UI or k8s config

## FAQ

**Why not just add a chat panel inside Claude Code?**
The code-server image is 2GB and requires a 2–8 minute cold start. Non-technical users shouldn't have to navigate VS Code to have a conversation. Keeping them separate also keeps the images lean — the chat image stays ~100MB.

**What happens to the conversation when the pod stops?**
History resets. This is intentional for v1 — the use case is short-lived sessions, matching the same pod lifecycle as code-server workspaces. Persistence (PVC or S3) is planned for v2.

**Can I give Claude a custom persona or system prompt?**
Yes — set the `SYSTEM_PROMPT` env var. The server reads it and passes it as the Anthropic API `system` parameter on every conversation. A UI toggle to show/hide the active prompt is planned.

**Is this secure?**
Access is controlled at the network level by Traefik/ALB — the same as code-server workspaces. The API key is injected via a k8s Secret and never exposed to the browser. The UI uses DOM-safe rendering (no `innerHTML` with dynamic content) to prevent XSS.

**Can this run without the everyone-ai portal?**
Yes — it just needs `ANTHROPIC_API_KEY` in the environment. A `docker-compose.yml` and `.env.example` are included for local development: `cp .env.example .env && docker compose up`.
