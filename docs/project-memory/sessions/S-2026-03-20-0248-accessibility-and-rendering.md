---
id: S-2026-03-20-0248-accessibility-and-rendering
title: Sprint 17 — Accessibility, Blockquote/Code Rendering, Modal Polish
date: 2026-03-20T02:48Z
---

## Goal

Implement Sprint 17 tasks: blockquote rendering (B-036), code block language labels (B-037), modal Escape/backdrop dismiss (B-038), aria-labels (B-040), remove Claude label from error messages (B-041), confirm modal backdrop polish (B-044).

## Context

Agent A owns all changes in `public/index.html`. All work is CSS + JS within that single file.

## Plan

1. B-036: Add `<blockquote>` grouping in `processTextLines` + CSS
2. B-037: Parse language from fenced code opener; add badge and `data-language`
3. B-038: Add Escape keydown + backdrop click dismiss in `showConfirmModal`
4. B-040: Add `aria-label` to all icon-only buttons (HTML + JS)
5. B-041: Skip "Claude" msg-label for isError messages in `addMsg`
6. B-044: Verify modal backdrop is `rgba(0,0,0,0.5)` with flex centering (already present)

## Changes Made

- `public/index.html`: All 6 tasks implemented

## Decisions Made

- B-044 backdrop was already implemented correctly; confirmed and left as-is
- Blockquote uses same stateful grouping pattern as lists
- Language badge uses absolute positioning anchored to `pre` (position: relative)

## Links

- Commit: TBD
