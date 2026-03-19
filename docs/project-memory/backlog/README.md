# Backlog

Track bugs and feature requests here.

## Naming Convention

- **Bugs:** `B-NNN-short-description.md` (e.g., `B-001-login-crash.md`)
- **Features:** `F-NNN-short-description.md` (e.g., `F-001-dark-mode.md`)

## Template

Each item should include:

```markdown
# B-NNN: Short Title

Status: Open | In Progress | Done
Priority: Critical | High | Medium | Low
Date: YYYY-MM-DD

## Summary
What's the bug/feature?

## Steps to Reproduce (bugs)
1. ...

## Expected Behavior
What should happen?

## Links
- Session: S-YYYY-MM-DD-HHMM-slug
- PR: #123
```

## Current Items

| ID | Title | Description | Priority | Status |
|----|-------|-------------|----------|--------|
| B-001 | Model selector ignored by server | The frontend sends the selected model in the POST body (`model` field) but `server.js` always uses `process.env.CLAUDE_MODEL` and ignores the per-request model. Switching Haiku/Sonnet/Opus in the UI has no effect. | high | Done (Sprint 2) |
| B-002 | System prompt uses wrong Anthropic API pattern | `server.js` prepends system prompt as a fake user message `[System: ...]` instead of using the Anthropic API `system` parameter. This is incorrect and will confuse the model. | high | Done (Sprint 2) |
| B-003 | Invalid model ID for Opus | `claude-opus-4-6` is not a valid Anthropic model ID. Should be `claude-opus-4-5` or the current Opus model identifier. | medium | Done (Sprint 2) |
| B-004 | Bold+italic combined markdown (***text***) not rendered | The markdown renderer regex `[^*]` excludes asterisks so `***text***` (bold+italic combined) renders as raw asterisks. Fixed in Sprint 3 with updated regex `(\*{3}[^*]+\*{3}|\*\*[^*]+\*\*|\*[^*\n]+\*)`. | medium | Done (Sprint 3) |
| B-005 | Copy button still overlaps on very short responses | Even with padding-right added in Sprint 4, the copy button still slightly overlaps text on very short Claude responses. Needs a minimum padding-right of ~56px on the bubble. | low | Partial (Sprint 4) |
| B-006 | History sidebar stale entry 404 handling | Fixed in Sprint 5: clicking a stale history entry shows inline error and removes entry from localStorage. | medium | Done (Sprint 5) |
| F-001 | Markdown bold/italic rendering | Fully fixed in Sprint 3 including `***bold+italic***`. | medium | Done (Sprint 3) |
| F-002 | Chat history sidebar / session persistence | Implemented in Sprint 4: sidebar shows past conversations from localStorage, click reloads via GET /api/conversations/:id. | medium | Done (Sprint 4) |
| F-003 | Loading indicator before first token | Implemented in Sprint 2 (animated dots). | low | Done (Sprint 2) |
| F-004 | Copy button accessibility | Made always-visible in Sprint 3. | low | Done (Sprint 3) |
| F-005 | Chat history sidebar — localStorage-based session list | Implemented in Sprint 4. | medium | Done (Sprint 4) |
| F-006 | Markdown heading rendering (# ## ###) | Implemented in Sprint 5: lines starting with #/##/### render as h1/h2/h3 elements. | low | Done (Sprint 5) |
| F-007 | Markdown unordered list rendering (- item) | Implemented in Sprint 5: lines starting with `- ` render as `<ul><li>` elements. | low | Done (Sprint 5) |
| F-008 | Markdown ordered list rendering (1. item) | Claude sometimes uses numbered lists like `1. First` `2. Second`. These render as raw text. Add ordered list `<ol><li>` support. | low | Open |
| F-009 | Markdown horizontal rule (---) | Lines that are just `---` or `***` should render as `<hr>` separators. | low | Open |
| F-010 | Mobile responsive layout | The sidebar at 220px takes too much space on small screens. Add a responsive layout: hide sidebar on mobile, add a hamburger button to toggle it. | medium | Open |
