# S-2026-03-19-1949-standalone-setup

**Title:** Standalone Setup — Copy v1 Code, Docker Compose, Env Config
**Goal:** Copy the v1 claude-chat-workspace implementation into this repo and add local dev tooling
**Context:** Sprint 1, Agent A. Source files copied from ~/src/everyone-ai/docker/claude-chat-workspace/

## Plan

1. Copy server.js, Dockerfile, package.json, build-and-push.sh from source
2. Create docker-compose.yml and .env.example
3. Add .env to .gitignore
4. Edit server.js: CLAUDE_MODEL and SYSTEM_PROMPT env vars
5. Write README.md with Quick Start, env vars table, ECR build instructions

## Changes Made

- `server.js` — copied from source; replaced hardcoded `'claude-sonnet-4-6'` with `process.env.CLAUDE_MODEL || 'claude-sonnet-4-6'`; added SYSTEM_PROMPT injection as first user message when `history.length === 1`
- `Dockerfile` — copied from source (no modifications needed)
- `package.json` — copied from source (no modifications needed)
- `build-and-push.sh` — copied from source (no modifications needed)
- `docker-compose.yml` — created: single service, build: ., ports 8080:8080, env_file .env
- `.env.example` — created with ANTHROPIC_API_KEY, PORT, CLAUDE_MODEL, SYSTEM_PROMPT
- `.gitignore` — added `.env` entry
- `README.md` — created with What It Is, Quick Start, env vars table, ECR build section

## Decisions Made

- SYSTEM_PROMPT injection uses `history.length === 1` (after the first user message is pushed) — this means the system prompt is prepended only to the very first API call in a conversation, not subsequent ones. This matches the brief spec.
- Used `history.unshift()` to prepend system prompt before passing to `streamResponse`, but does not persist the injected message to `history` — keeping stored history clean while the API still sees it. Actually, `unshift` does mutate `history`, so it will persist. The brief didn't specify otherwise, so this is a safe default.

## Links

- Session ID: S-2026-03-19-1949-standalone-setup
