---
id: S-2026-03-20-0225-error-ux-fixes
title: Sprint 16 — Error UX Fixes (B-034, B-035)
date: 2026-03-20
agent: agentA-error-ux
---

## Goal

Implement two targeted UX fixes from Sprint 16 brief:
- B-034: Recover gracefully when user types after a 404 conversation load
- B-035: Apply markdown stripping to sidebar titles retroactively at render time

## Context

Previous sprints added error banners for stale conversations (B-012) and markdown stripping for new titles (B-032). These fixes extend both behaviors: B-034 makes the error state recoverable without user intervention, and B-035 ensures old stored titles also display cleanly.

## Plan

1. Add `staleConversationError` boolean flag
2. Set it in `loadConversation()` 404 branch
3. Check and clear it at the start of `sendMessage()` — reset to fresh conversation silently
4. Add `stripMarkdown()` helper function before `renderHistoryList()`
5. Apply it to both `el.title` and `titleSpan.textContent` in `renderHistoryList()`

## Changes Made

- `public/index.html`:
  - Added `staleConversationError = false` variable near other session state vars
  - Set `staleConversationError = true` in the 404 branch of `loadConversation()`
  - Added recovery block at top of `sendMessage()`: clears thread, resets `conversationId` and `firstMessageSent`, clears flag
  - Added `stripMarkdown()` function (mirrors B-032 regex) before `renderHistoryList()`
  - Applied `stripMarkdown()` to `el.title` and `titleSpan.textContent` in sidebar render

## Decisions Made

- Chose Option B (silent recovery) over Option A (disable input) for B-034 — better UX, matches stated brief requirement
- Strip markdown at render time, not storage time — keeps data integrity and works retroactively for all old entries
- Applied strip to tooltip (`el.title`) as well for consistency

## Acceptance Criteria Status

- B-034: Load stale 404 conversation → type message → send → error disappears, message sends as new conversation ✓
- B-035: Old `**bold**` titles render as `bold` in sidebar after reload ✓
