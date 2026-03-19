# Sprint 4

Goal
- Add a localStorage-based chat history sidebar so users can return to previous conversations (F-005)
- Fix the copy button overlap on narrow Claude bubbles (B-005)
- Enhance the server conversations list endpoint to include a preview of the first message

Constraints
- No two agents may modify the same files
- Agent A owns: public/index.html
- Agent B owns: server.js

Merge Order
1. agentA-history-sidebar
2. agentB-conversations-api

Merge Verification
- echo "No automated tests yet — verify manually with: docker compose up"

## agentA-history-sidebar

Objective
- Add a collapsible history sidebar to the chat UI and fix the copy button overlap

Tasks
- Open public/index.html and read it fully before making changes
- Fix B-005: Add padding-right: 52px to .msg.claude .bubble CSS rule so the always-visible copy button (positioned absolute top-right) does not overlap the message text.
- Add F-005 (history sidebar):
  - Add a sidebar panel to the left of the chat area. The sidebar should be a fixed-width column (220px) showing a list of past conversations. The overall layout should change from a single column to two columns: sidebar + chat area.
  - Add CSS for the sidebar: `#sidebar { width: 220px; flex-shrink: 0; border-right: 1px solid var(--border); display: flex; flex-direction: column; overflow: hidden; }`. Add a "History" heading and a `#history-list` div that holds conversation entries.
  - Each history entry shows the first message as a truncated title (max 40 chars). Entries are stored in localStorage under key `chat-history` as a JSON array of `{ id, title, timestamp }` objects.
  - When a message is sent, save the conversation to history: if it is the first message in the current conversationId, push `{ id: conversationId, title: text.slice(0, 40), timestamp: Date.now() }` to the history array in localStorage (max 20 entries, newest first).
  - When a history entry is clicked: set conversationId to the clicked id, fetch GET /api/conversations/:id to retrieve the message history, then replay the messages into the thread DOM (user and claude messages in order).
  - When New Chat is clicked: generate a new conversationId, clear the thread, reset empty state, and refresh the history list display.
  - On page load: render the history list from localStorage.
  - Wrap the existing `#app` content (header + thread + input-area) in a flex row container alongside the sidebar.
- Commit with: feat: add chat history sidebar and fix copy button overlap (F-005, B-005)

Acceptance Criteria
- A sidebar is visible on the left with a list of past conversations
- Conversations are saved to localStorage when the first message is sent
- Clicking a history entry reloads the conversation by fetching from /api/conversations/:id
- Copy button no longer overlaps text in narrow Claude bubbles (padding-right added)
- New Chat clears thread and refreshes history list

## agentB-conversations-api

Objective
- Enhance the server-side conversations API to include message previews in the list

Tasks
- Open server.js and read it fully before making changes
- Update GET /api/conversations: instead of returning `{ ids: [...] }`, return `{ conversations: [ { id, messageCount, preview } ] }` where `preview` is the first user message content truncated to 60 characters, and `messageCount` is the total number of messages in history. If the conversation has no messages, set preview to "".
- Keep GET /api/conversations/:id unchanged (still returns full history).
- Keep DELETE /api/conversations/:id unchanged.
- Commit with: feat: enhance conversations list API with preview and message count

Acceptance Criteria
- GET /api/conversations returns `{ conversations: [{ id, messageCount, preview }] }` array
- Preview is the first user message truncated to 60 chars
- Empty conversations return preview: ""
- Individual GET /api/conversations/:id still works as before
