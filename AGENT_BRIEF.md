agentB-ux-polish — Sprint 1

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
- Add new chat button, per-message copy button, and model selector to the chat UI

Tasks
- Copy ~/src/everyone-ai/docker/claude-chat-workspace/public/index.html to ./public/index.html (create public/ dir)
- Add a New Chat button in the header (right side, small ghost style): on click generates new crypto.randomUUID() conversationId, clears the thread div children, and re-appends the empty-state div
- Add a model selector <select> in the header: options are claude-haiku-4-5-20251001 (Haiku — fast), claude-sonnet-4-6 (Sonnet — balanced, default), claude-opus-4-6 (Opus — powerful). Store selected value in a variable currentModel
- Pass currentModel as model field in the POST /api/chat request body alongside message and conversationId
- Add a copy button to each Claude message bubble: appears on hover (CSS), copies bubble textContent to clipboard via navigator.clipboard.writeText(), shows Copied! for 1500ms then reverts
- Add hover CSS for the copy button: position absolute top-right of bubble, small muted icon, visible on .msg.claude:hover
- Commit with: feat: UX polish — new chat button, model selector, copy message button

Acceptance Criteria
- New Chat button clears the thread and generates a new conversationId
- Model selector changes which model is sent in the POST body
- Each Claude bubble shows a copy button on hover that copies text to clipboard
- All changes committed to public/index.html
