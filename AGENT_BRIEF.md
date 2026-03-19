agentA-standalone-setup — Sprint 1

Sprint-Level Context

Goal
- Copy the v1 claude-chat-workspace implementation from ~/src/everyone-ai into this standalone repo
- Add Docker Compose for local development and .env.example for configuration
- Add UX polish: new chat button, copy message to clipboard, model selector in header
- Make server.js read SYSTEM_PROMPT and CLAUDE_MODEL from environment variables

Constraints
- No two agents may modify the same files
- Agent A owns: server.js, Dockerfile, package.json, build-and-push.sh, docker-compose.yml, .env.example, README.md, .gitignore
- Agent B owns: public/index.html
- Both agents must copy their source files from ~/src/everyone-ai/docker/claude-chat-workspace/ before modifying


Objective
- Bring the v1 server code into this repo and wire up local dev tooling with environment variable config

Tasks
- Copy ~/src/everyone-ai/docker/claude-chat-workspace/server.js to ./server.js
- Copy ~/src/everyone-ai/docker/claude-chat-workspace/Dockerfile to ./Dockerfile
- Copy ~/src/everyone-ai/docker/claude-chat-workspace/package.json to ./package.json
- Copy ~/src/everyone-ai/docker/claude-chat-workspace/build-and-push.sh to ./build-and-push.sh
- Create ./docker-compose.yml with a single service: build: . ports: 8080:8080 env_file: .env
- Create ./.env.example with ANTHROPIC_API_KEY=sk-ant-... PORT=8080 CLAUDE_MODEL=claude-sonnet-4-6 SYSTEM_PROMPT= (empty default)
- Add .env to .gitignore (create .gitignore if it doesn't exist)
- Edit server.js: replace hardcoded 'claude-sonnet-4-6' with process.env.CLAUDE_MODEL || 'claude-sonnet-4-6'
- Edit server.js: in streamResponse(), if process.env.SYSTEM_PROMPT is set, prepend {role:'user', content:'[System: ' + process.env.SYSTEM_PROMPT + ']'} as first message only when history length is 1
- Update README.md: add What It Is section, Quick Start (cp .env.example .env && docker compose up), environment variables table, and how to build/push to ECR
- Commit with: feat: standalone setup — copy v1 code, Docker Compose, env config

Acceptance Criteria
- server.js, Dockerfile, package.json, build-and-push.sh all exist at repo root
- docker-compose.yml and .env.example exist at repo root
- .env is in .gitignore
- server.js uses process.env.CLAUDE_MODEL with fallback to claude-sonnet-4-6
- server.js uses process.env.SYSTEM_PROMPT when set
- README.md has setup instructions
