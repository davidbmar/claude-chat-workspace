# Vision: Claude Chat Workspace

## Problem Statement
Teams using the Capsule portal have access to Claude Code — a full VS Code workspace — but that's heavyweight for users who just want to ask Claude a question, brainstorm an idea, or draft a document. There's no lightweight, conversation-first interface. Users either overuse the code workspace for simple chats or don't engage with Claude at all because the barrier feels too high.

## Target Audience
Internal teams at Capsule who already have access to the portal: engineers who want quick answers without spinning up a full IDE, non-engineers (PMs, designers, ops) who want to use Claude but don't need a coding environment, and anyone who wants a persistent, conversation-focused interface that lives alongside their other tools.

## Key Differentiators
Claude Chat is a zero-friction conversational interface that deploys as a standard portal workspace — same URL pattern, same k8s/Traefik infrastructure, same API key injection — meaning no new infrastructure to manage. It's intentionally stripped down: no file tree, no terminal, just a clean thread of messages. The LLM backend is swappable from day one via a single adapter function, so it isn't locked to Anthropic forever.

## Solution Overview
A standalone Node.js server (~100MB Docker image vs 2GB for the code workspace) that serves a single-page chat UI on port 8080. The server maintains in-memory conversation history per session, streams Claude responses via SSE, and exposes a small REST API for conversation management. The frontend is a single HTML file with no build step — dark theme, markdown rendering, model selector, and chat history sidebar, all in vanilla JS.

## Success Criteria
- A user can launch a "Claude Chat" workspace from the portal catalog in under 30 seconds and have a conversation with Claude.
- The chat UI handles markdown-heavy responses (code blocks, tables, lists) without rendering artifacts.
- A non-engineer can use it without instructions — the interface is self-explanatory.
- The Docker image builds and deploys on the existing portal EC2s without any infrastructure changes.
- The LLM backend can be swapped by replacing one function in server.js.
