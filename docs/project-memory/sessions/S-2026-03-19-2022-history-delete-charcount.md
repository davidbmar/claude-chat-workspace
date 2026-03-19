# S-2026-03-19-2022-history-delete-charcount

**Title:** History entry delete button and character count display
**Goal:** Implement F-011 (delete history entries) and F-012 frontend (char count label)
**Context:** Sprint 7, agentA-history-delete branch

## Plan

1. Add CSS for `.delete-btn` and `.char-count`
2. Update `renderHistoryList()` to render a `×` delete button per entry
3. Add `deleteConversation()` function: removes from localStorage, calls DELETE API, clears thread if active
4. Parse `done` SSE event for `chars` field → set `data-charcount` on bubble
5. After streaming ends, append `.char-count` label if `data-charcount` is set

## Changes Made

- `public/index.html`: Added `.char-count` and `.delete-btn` CSS rules; updated `renderHistoryList` to add `×` delete buttons; added `deleteConversation()` function; added SSE `done`+`chars` handling; added char count label after streaming completes

## Decisions Made

- Delete button comes before text node in DOM so `float: right` renders correctly
- New `conversationId` is generated when the active conversation is deleted, preventing stale ID reuse
- `data-charcount` attribute bridges SSE parsing and post-stream UI without coupling them

## Commits

- feat: history entry delete button and character count display (F-011, F-012 frontend)
