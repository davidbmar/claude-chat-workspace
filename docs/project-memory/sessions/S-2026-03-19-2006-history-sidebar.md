# Session

Session-ID: S-2026-03-19-2006-history-sidebar
Title: Add chat history sidebar and fix copy button overlap
Date: 2026-03-19
Author: agentA

## Goal

Add a localStorage-based chat history sidebar (F-005) and fix the copy button overlap on narrow Claude bubbles (B-005).

## Context

Sprint 4 agentA task. The chat UI previously had no history persistence — each page load started fresh. The copy button (positioned absolute top-right) overlapped text in narrow bubbles.

## Plan

1. Fix B-005: add `padding-right: 52px` to `.msg.claude .bubble`
2. Add sidebar panel (220px) to the left of chat area
3. Change `#app` to flex-row layout; wrap existing content in `#chat-area`
4. Save conversation to localStorage on first message send
5. Render history list on page load and after New Chat
6. Load conversation from `/api/conversations/:id` on history entry click

## Changes Made

- `public/index.html`:
  - Changed `#app` from single-column to flex-row layout
  - Added `#sidebar`, `#chat-area`, `#history-list` CSS
  - Added `padding-right: 52px` to `.msg.claude .bubble` (B-005 fix)
  - Added sidebar HTML with "History" heading and `#history-list` container
  - Wrapped header/thread/input-area in `#chat-area` div
  - Added `getHistory`, `saveHistory`, `pushConversationToHistory`, `renderHistoryList`, `loadConversation` JS functions
  - Save to localStorage on first message of each conversation (max 20 entries, newest first)
  - On history entry click: fetch `/api/conversations/:id` and replay messages
  - New Chat resets `firstMessageSent` and refreshes history list
  - `renderHistoryList()` called on page load

## Decisions Made

- Used `firstMessageSent` flag to track whether to save history (avoids double-saves on subsequent messages)
- History stored as `{ id, title, timestamp }` with title = first 40 chars of first message
- `loadConversation` handles both `{ messages: [...] }` and flat array response shapes from the API

## Open Questions

- Server's `/api/conversations/:id` response format — handled both shapes defensively

## Links

Commits:
- TBD

PRs:
- N/A
