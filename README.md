# Claude Chat Workspace

## What It Is

A lightweight, self-hosted chat interface for Claude. Runs as a Node.js/Express server with Server-Sent Events (SSE) streaming, per-session conversation history, and a static single-page UI. Designed to run locally via Docker Compose or deploy to any container environment (e.g., AWS ECS via ECR).

---

## Quick Start

```bash
# 1. Copy and configure environment
cp .env.example .env
# Edit .env — at minimum set ANTHROPIC_API_KEY

# 2. Start the service
docker compose up
```

Open `http://localhost:8080` in your browser.

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | *(required)* | Anthropic API key |
| `PORT` | `8080` | Port the server listens on |
| `CLAUDE_MODEL` | `claude-sonnet-4-6` | Claude model ID to use |
| `SYSTEM_PROMPT` | *(empty)* | Optional system prompt prepended to every new conversation |

---

## Build and Push to ECR

The `build-and-push.sh` script builds the Docker image on an automation EC2 and pushes it to ECR:

```bash
bash build-and-push.sh [--pem PATH_TO_PEM] [--jump-host JUMP_HOST]
```

**Defaults** (override via env vars or flags):
- `PEM` — `$HOME/Desktop/login/deployment-portal-vibeland-us-east-1.pem`
- `JUMP` — `ubuntu@something.ai.internal.capsule.com`

The script tags the image as both `:latest` and `:<YYYY-MM-DD>`.
