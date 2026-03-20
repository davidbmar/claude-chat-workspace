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
| F-008 | Markdown ordered list rendering (1. item) | Implemented in Sprint 6: numbered lists render as `<ol><li>` elements. | low | Done (Sprint 6) |
| F-009 | Markdown horizontal rule (---) | Implemented in Sprint 6: `---` lines render as `<hr>` elements. | low | Done (Sprint 6) |
| F-010 | Mobile responsive layout | Implemented in Sprint 6: sidebar hides on screens <= 600px, hamburger button toggles it. | medium | Done (Sprint 6) |
| F-011 | Delete conversation from history sidebar | Implemented in Sprint 7: × button on each history entry removes from localStorage and calls DELETE /api/conversations/:id. | low | Done (Sprint 7) |
| F-012 | Character/token usage display | Implemented in Sprint 7: SSE done event includes `chars` and `words` counts; frontend shows "N chars" label below Claude responses. | low | Done (Sprint 7) |
| B-009 | Mobile sidebar cannot be closed | Sidebar opens via hamburger but `z-index: 100` makes sidebar intercept pointer events on the hamburger button — user is trapped. No close button inside sidebar, no click-outside overlay. | critical | Open |
| B-010 | Raw JSON API error shown to users | When API returns an error (e.g. 401), the full JSON payload is shown in the chat bubble: `Error: 401 {"type":"error","error":{"type":"authentication_error",...}}`. Needs human-readable mapping. | high | Open |
| B-011 | Table CSS missing — rendered tables have no styling | `renderTextInto()` generates `<table><thead><tbody>` elements but there are zero CSS rules for table/th/td. Tables render as unstyled, borderless, unreadable blobs. | high | Open |
| B-012 | Stale history entry silently disappears on 404 | When a history entry 404s, it is immediately removed from sidebar AND an error bubble appears simultaneously — jarring UX. Entry should stay selected while error is shown, then offer explicit removal. | high | Open |
| B-013 | Stale localStorage model ID silently mismatches dropdown | If `localStorage['selectedModel']` contains an outdated model ID, `modelSelector.value = savedModel` silently fails. Selector shows default but `currentModel` holds stale value — wrong model sent to API. | medium | Open |
| B-014 | Mobile header wraps to two rows at narrow widths | At ~400px, `flex-wrap: wrap` causes model selector and New Chat button to appear on a second row, making header 93px tall and consuming excessive screen real estate. | medium | Open |
| B-015 | Delete button (×) floats over truncated history text | Sidebar entry uses `float: right` for `×` button which overlaps the truncated title text on narrow sidebar. Should use flexbox layout. | medium | Open |
| B-016 | Copy silently fails in non-HTTPS context | `navigator.clipboard.writeText()` requires a secure context (HTTPS). On HTTP the call silently fails — `.catch(() => {})` eats the error with no user feedback. | medium | Open |
| F-013 | No confirmation on New Chat — conversation immediately discarded | Clicking "+ New Chat" mid-conversation immediately clears the thread with no confirmation. Should prompt "Start new chat? Current conversation will remain in history." | low | Open |
| F-014 | History sidebar shows no timestamps or date grouping | All history entries look identical — no indication of when the conversation happened. Should show relative timestamps (e.g. "2 hours ago") or date separators. | low | Open |
| F-015 | No click-outside overlay to close mobile sidebar | Mobile sidebar has no backdrop overlay — users don't know they can't tap outside to close it (because there's nothing to tap). Standard mobile pattern: semi-transparent overlay dismisses the sidebar. | low | Open |
| F-016 | Copy button copies plain text, not original markdown | Copy button uses `bubble.textContent` which loses markdown structure. Code blocks become plain text, tables lose formatting. Should copy the original markdown source. | low | Open |
