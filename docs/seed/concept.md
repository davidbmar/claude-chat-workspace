# Claude Chat Workspace — Concept

## What It Is

Claude Chat Workspace is a lightweight conversational interface to Claude that runs as a Kubernetes pod in the same infrastructure as Claude Code workspaces. It provides a clean, distraction-free chat UI — no terminal, no file tree, no code editor. Just a window to talk to Claude.

## The Problem It Solves

The existing catalog item ("Claude Code") always launches a full VS Code workspace (code-server). This is a 2GB Docker image that takes 2-8 minutes to cold-start. It's powerful, but heavy — overkill when someone just wants to:
- Ask Claude a question
- Brainstorm ideas
- Draft a document
- Get an explanation
- Have a back-and-forth conversation

There's a UX gap between "I want to use Claude" and "I want to build something with Claude Code." This project fills that gap.

## Target Users

- Non-technical team members who want conversational AI without a coding environment
- Anyone who wants a quick Claude session without waiting for VS Code to spin up
- Users in finance, HR, compliance, or operations who want to draft, ask, or analyze — not code
- Technical users who want a lightweight scratchpad before opening a full workspace

## Core Principles

1. **Lightweight** — ~100MB image vs 2GB. Starts in seconds, not minutes.
2. **Clean** — No chrome, no distractions. Just the conversation.
3. **Swappable backend** — The LLM is an adapter. Swap Claude for any other provider without touching the UI or infrastructure.
4. **Familiar infrastructure** — Runs on the same k8s cluster, same port (8080), same Traefik/IngressRoute routing as everything else. No new infrastructure to learn or manage.
5. **Conversation continuity** — Full message history is maintained per session (in-memory, server-side). Claude sees the whole conversation, not just the latest message.

## What It Is NOT

- Not a persistent chat history system (history resets on pod restart — intentional for v1)
- Not a multi-user chat room
- Not a replacement for Claude Code (it has no filesystem, no terminal, no ability to run code)
- Not a general-purpose LLM router (it's a specific UI for conversational use within the team platform)
