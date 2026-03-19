# Sprint 2

Goal
- Fix two high-priority server-side bugs: model selector is ignored by server (B-001) and system prompt uses wrong API pattern (B-002)
- Fix invalid Opus model ID in the frontend (B-003)
- Add markdown bold/italic rendering in Claude bubbles (F-001)
- Add a loading indicator before the first streaming token (F-003)

Constraints
- No two agents may modify the same files
- Agent A owns: server.js
- Agent B owns: public/index.html

Merge Order
1. agentA-server-fixes
2. agentB-frontend-polish

Merge Verification
- echo "No automated tests yet — verify manually with: docker compose up"

## agentA-server-fixes

Objective
- Fix server.js so it respects the per-request model sent by the frontend, and use the correct Anthropic API system parameter for system prompts

Tasks
- Open server.js and read it fully before making changes
- Fix B-001: In the /api/chat route handler, extract `model` from req.body alongside `message` and `conversationId`. Pass the extracted model (falling back to process.env.CLAUDE_MODEL || 'claude-sonnet-4-6') into streamResponse() as a parameter. Update streamResponse() to accept a `model` argument and use it instead of always reading process.env.CLAUDE_MODEL.
- Fix B-002: In the /api/chat route handler, remove the current system prompt injection that prepends a fake user message. Instead, pass process.env.SYSTEM_PROMPT directly to the Anthropic client.messages.stream() call as the `system` field (only when it is non-empty). The system field should be a top-level string in the messages.stream() options object, not a message in the history array.
- Commit with: fix: respect per-request model and use Anthropic system parameter (B-001, B-002)

Acceptance Criteria
- server.js /api/chat extracts `model` from req.body and passes it to the API call
- streamResponse() takes model as a parameter instead of reading env var directly
- System prompt is passed as `system:` field in messages.stream(), not as a fake user message
- Fallback to process.env.CLAUDE_MODEL || 'claude-sonnet-4-6' when no model in request body

## agentB-frontend-polish

Objective
- Fix the invalid Opus model ID, add markdown bold/italic rendering, and add a loading indicator

Tasks
- Open public/index.html and read it fully before making changes
- Fix B-003: In the model selector <select>, change the Opus option value from 'claude-opus-4-6' to 'claude-opus-4-5'. Keep the display text "Opus — powerful".
- Fix F-001: In the renderTextInto() JavaScript function, after handling fenced code blocks and inline code, add support for **bold** (wrap in <strong>) and *italic* (wrap in <em>) text. Implement this in the appendInlineSegments() function: after splitting on inline code backticks, further split text segments on bold/italic markers using regex and insert the appropriate DOM elements. Be careful to handle the case where * or ** appear in code spans (they should not be processed inside code elements).
- Fix F-003: Add a loading indicator. After the user sends a message and before the first streaming token arrives, show a pulsing "..." animation inside the Claude bubble. Implement this by: (1) adding a CSS class `.loading-dots` with an animated content or child spans, and (2) in sendMessage(), adding the loading indicator to the claudeBubble immediately after creating it, then removing it as soon as the first token is received (before calling renderTextInto for the first time).
- Commit with: fix: correct Opus model ID, add bold/italic rendering, add loading indicator (B-003, F-001, F-003)

Acceptance Criteria
- Opus option value is 'claude-opus-4-5' (not 'claude-opus-4-6')
- Claude responses with **bold** and *italic* text render correctly as <strong> and <em> elements
- A loading animation appears in the Claude bubble between send and first token
- Loading animation disappears when the first token arrives
- All changes committed to public/index.html only
