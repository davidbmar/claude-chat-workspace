# Sprint 7

Goal
- Add delete button to history sidebar entries (F-011)
- Add character count display below Claude responses (F-012 frontend)
- Add character count to the SSE stream done event (F-012 backend)

Constraints
- No two agents may modify the same files
- Agent A owns: public/index.html
- Agent B owns: server.js

Merge Order
1. agentA-history-delete
2. agentB-char-count

Merge Verification
- echo "No automated tests yet — verify manually with: docker compose up"

## agentA-history-delete

Objective
- Add delete buttons to history entries and display character count below Claude responses

Tasks
- Open public/index.html and read it fully before making changes
- Add F-011: In the history item rendering function, add a small delete button `×` to the right of each history entry title. Style it: `float: right; background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 14px; padding: 0 2px; line-height: 1;`. On click (stop propagation so it doesn't trigger the conversation reload): (1) remove the entry from the localStorage `chat-history` array by filtering out the matching id, (2) call DELETE /api/conversations/:id to remove server-side history, (3) re-render the history list. If the deleted conversation is currently active (conversationId matches), clear the thread and show empty state.
- Add F-012 (frontend part): After a Claude response completes streaming (after `claudeBubble.classList.remove('cursor')`), check if the bubble has a `data-charcount` attribute. If so, append a small muted label below the bubble showing "N chars". Add CSS for this label: `.char-count { font-size: 10px; color: var(--text-muted); margin-top: 2px; text-align: right; }`. The character count value should be read from the `data-charcount` attribute set on the bubble, which will be set by reading a `chars` field from the final SSE `done` event.
- Commit with: feat: history entry delete button and character count display (F-011, F-012 frontend)

Acceptance Criteria
- Each history entry shows a × button on the right
- Clicking × removes the entry from localStorage and calls DELETE /api/conversations/:id
- If the deleted conversation is active, the thread clears
- Character count label appears below completed Claude responses
- Character count comes from the SSE done event's `chars` field

## agentB-char-count

Objective
- Include character count in the SSE done event and expose response stats

Tasks
- Open server.js and read it fully before making changes
- In the /api/chat route handler, after the streaming loop completes and `assistantText` is populated, modify the done event to include the character count: instead of `res.write(\`data: ${JSON.stringify({ done: true })}\n\n\`)`, send `res.write(\`data: ${JSON.stringify({ done: true, chars: assistantText.length })}\n\n\`)`.
- Also add the word count: `words: assistantText.split(/\s+/).filter(Boolean).length` to the done event payload.
- Commit with: feat: include char and word count in SSE done event (F-012 backend)

Acceptance Criteria
- The SSE done event includes `chars: N` where N is the length of the assistant response text
- The SSE done event includes `words: N` where N is the approximate word count
- All existing functionality (streaming tokens, error handling) unchanged
