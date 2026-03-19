---
id: S-2026-03-19-1957-frontend-polish-sprint2
title: Sprint 2 — Frontend Polish (B-003, F-001, F-003)
date: 2026-03-19T19:57Z
agent: agentB-frontend-polish
---

## Goal

Fix the invalid Opus model ID (B-003), add markdown bold/italic rendering in Claude bubbles (F-001), and add a loading indicator before the first streaming token (F-003).

## Context

Sprint 2, Agent B. Agent A owns server.js; Agent B owns public/index.html only.

## Plan

1. Fix B-003: change `claude-opus-4-6` → `claude-opus-4-5` in model selector
2. Fix F-001: add `appendFormattedLine()` helper that parses `**bold**` and `*italic*` markers using DOM elements (`<strong>`, `<em>`)
3. Fix F-003: add `.loading-dots` CSS with pulsing dot animation; inject three `<span>` dots into the Claude bubble immediately after creation; remove on first token

## Changes Made

- `public/index.html`
  - Model selector: `claude-opus-4-6` → `claude-opus-4-5`
  - Added `.loading-dots` CSS class with `dot-pulse` keyframe animation (three staggered dots)
  - In `sendMessage()`: create `loadingDots` div and append to `claudeBubble` before fetch; remove on `firstToken`
  - In `appendInlineSegments()`: replaced direct `createTextNode` with call to new `appendFormattedLine()`
  - Added `appendFormattedLine()`: splits line on `**bold**` / `*italic*` regex and inserts `<strong>` / `<em>` elements; text nodes are XSS-safe

## Decisions Made

- Bold regex `\*\*[^*]+\*\*` is listed before italic `\*[^*\n]+\*` in the alternation so `**` is greedily matched before `*`
- Loading dots are removed by explicit `removeChild` before `renderTextInto` (which clears children anyway) for clarity

## Links

- Commit: (see git log for Session: S-2026-03-19-1957-frontend-polish-sprint2)
