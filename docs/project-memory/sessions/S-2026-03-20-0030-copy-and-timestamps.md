---
id: S-2026-03-20-0030-copy-and-timestamps
title: Copy Fallback, Markdown Copy Source, History Timestamps
goal: Implement B-016 (copy fallback for non-HTTPS), F-016 (copy markdown source), F-014 (relative timestamps in history sidebar)
context: Sprint 10 agentB tasks in public/index.html JS section
plan: |
  1. B-016: Add execCommand fallback in copy handler; show error if both methods fail
  2. F-016: Store accumulated markdown as data-markdown on bubble; use it for copy
  3. F-014: Add relativeTime() helper; render timestamp in history entries; setInterval to refresh
---

## Changes Made

- B-016: Copy handler tries clipboard API, falls back to execCommand, shows "Copy failed — HTTPS required" if both fail
- F-016: After SSE stream completes, stores `accumulated` as `bubble.dataset.markdown`; copy handler prefers data-markdown over textContent; also set for loaded conversations
- F-014: Added `relativeTime()` helper, `.history-entry-content` wrapper with title+time, CSS for `.history-entry-time`, setInterval(renderHistoryList, 60000)

## Decisions Made

- For loaded conversations: set data-markdown from server text since that IS the markdown source
- relativeTime thresholds: <1min="just now", <1hr="X min ago", <24hr="X hours ago", <48hr="yesterday", else locale date string

## Links

- Commit: (to be filled)
