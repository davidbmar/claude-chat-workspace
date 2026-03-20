---
title: Sprint 19 — Bullet list normalization, nested lists, HR opacity, modal/selector ARIA
session_id: S-2026-03-20-0332-sprint19-lists-and-aria
date: 2026-03-20T03:32Z
---

## Goal
Fix unordered list rendering for all bullet formats (•, -, *), add one-level nested list support, increase HR visibility, and complete ARIA semantics for confirm modal and model selector.

## Context
Sprint 19 agent A. All changes in `public/index.html`.

## Plan
- B-046: Normalize `•` and lone `*` to `-` at top of parse loop so existing `- ` branch handles all three
- B-050: Track `lastLi` and `currentNestedList`; detect `  - ` (2-space indent) and attach nested `<ul>` to the last top-level `<li>`
- B-047: Change HR border-top opacity from 0.15 → 0.3
- B-051: Add `role="dialog"`, `aria-modal="true"`, `aria-labelledby` to modal overlay; `id` to title `<p>`; `aria-label` to both buttons
- B-052: Add `aria-label="Select AI model"` to `#model-selector`

## Changes Made
- `public/index.html`: All five tasks implemented

## Decisions Made
- Used regex `\*(?!\*)` (negative lookahead) to distinguish lone `*` bullet from `**` bold syntax
- Nested lists: only one level of nesting supported (brief constraint)
- `currentNestedList` is reset on each new top-level list item so sub-items always attach to the correct `<li>`

## Commits
- See git log for Session: S-2026-03-20-0332-sprint19-lists-and-aria
