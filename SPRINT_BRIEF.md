# Sprint 16

Goal
- B-034 Medium: Fix input enabled on 404 error state — when a conversation 404s, disable textarea+send OR silently recover (clear error banner) on first successful new send
- B-035 Low: Apply markdown stripping to sidebar titles at render time — so pre-Sprint-15 conversations with raw **asterisks** in their titles show clean text

Constraints
- One agent only — all changes in public/index.html
- Agent A owns everything

## agentA-error-ux

Objective
Two targeted fixes: error-state input behavior and retroactive sidebar title cleanup.

Tasks

1. B-034 Stale conversation error state input:
   - When `loadConversation()` gets a 404, the app currently shows an error banner and leaves the input enabled
   - Option A (simpler): In the 404 error handler inside `loadConversation()`, disable the textarea and send button (`msgInput.disabled = true; sendBtn.disabled = true`) and add a note to the error message like "Start a new chat to continue"
   - Option B (smarter): Leave input enabled but in the message send handler, if the current conversationId returned a 404, clear the error banner before sending (treat as a fresh conversation). Update `conversationId` to null so a new one gets created.
   - Implement Option B — it's the better UX. When the user types after a 404, they clearly want to continue chatting. Clear the error banner, set `currentConversationId = null`, and let the send proceed normally as a new conversation.

2. B-035 Retroactive sidebar title markdown stripping:
   - Find where sidebar history entries are rendered (the function that reads from localStorage and creates the sidebar `<li>` elements)
   - Before setting the title text in the DOM, apply the same markdown-stripping regex used in B-032:
     ```js
     function stripMarkdown(text) {
       return text.replace(/\*\*([^*]+)\*\*/g, '$1')
                  .replace(/\*([^*]+)\*/g, '$1')
                  .replace(/`([^`]+)`/g, '$1')
                  .replace(/^#+\s*/gm, '');
     }
     ```
   - This ensures ALL conversations (old and new) show clean titles without asterisks

Acceptance Criteria
- Load a stale 404 conversation. Type a message and send. The error banner disappears, the message sends as a new conversation, and the sidebar updates with a new title.
- Old conversations stored with `**bold**` in their title show `bold` (no asterisks) in the sidebar after reload.

## Merge Order
1. agentA-error-ux

## Merge Verification
- node -e "require('fs').readFileSync('public/index.html','utf8'); console.log('HTML readable')"
- docker compose up --build -d && sleep 5 && curl -s http://localhost:8080/api/health
- npm audit --audit-level=high
