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
| B-004 | Bold+italic combined markdown (***text***) not rendered | The markdown renderer regex `[^*]` excludes asterisks so `***text***` (bold+italic combined) renders as raw asterisks. The regex pattern needs to handle triple-asterisk. | medium | Open |
| F-001 | Markdown bold/italic rendering | Claude responses with `**bold**` or `*italic*` text render as raw asterisks. Basic `**bold**` and `*italic*` implemented in Sprint 2 but `***bold+italic***` still broken (see B-004). | medium | Partial (Sprint 2) |
| F-002 | Chat history sidebar / session persistence | No way to return to previous conversations. Conversations are lost on page reload or New Chat. Add a session history sidebar showing past conversations. | medium | Open |
| F-003 | Loading indicator before first token | After sending a message there is no visible "thinking" state until the first streaming token arrives. Implemented in Sprint 2 (animated dots). | low | Done (Sprint 2) |
| F-004 | Copy button accessibility | The copy button on Claude responses is hover-only (opacity: 0 until hover). This is inaccessible on mobile and for keyboard-only users. Make it always visible or add a keyboard shortcut. | low | Open |
| F-005 | Chat history sidebar — persist conversations in localStorage | Add a left sidebar showing past conversations (stored in localStorage). Users can click to reload a previous chat. Conversations are keyed by conversationId. | medium | Open |
