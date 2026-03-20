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
| B-009 | Mobile sidebar cannot be closed | Sidebar opens via hamburger but `z-index: 100` makes sidebar intercept pointer events on the hamburger button — user is trapped. No close button inside sidebar, no click-outside overlay. | critical | Done (Sprint 9) |
| B-010 | Raw JSON API error shown to users | When API returns an error (e.g. 401), the full JSON payload is shown in the chat bubble: `Error: 401 {"type":"error","error":{"type":"authentication_error",...}}`. Needs human-readable mapping. | high | Done (Sprint 9) |
| B-011 | Table CSS missing — rendered tables have no styling | `renderTextInto()` generates `<table><thead><tbody>` elements but there are zero CSS rules for table/th/td. Tables render as unstyled, borderless, unreadable blobs. | high | Done (Sprint 9) |
| B-012 | Stale history entry silently disappears on 404 | When a history entry 404s, it is immediately removed from sidebar AND an error bubble appears simultaneously — jarring UX. Entry should stay selected while error is shown, then offer explicit removal. | high | Done (Sprint 9) |
| B-013 | Stale localStorage model ID silently mismatches dropdown | If `localStorage['selectedModel']` contains an outdated model ID, `modelSelector.value = savedModel` silently fails. Selector shows default but `currentModel` holds stale value — wrong model sent to API. | medium | Done (Sprint 9) |
| B-014 | Mobile header wraps to two rows at narrow widths | At ~400px, `flex-wrap: wrap` causes model selector and New Chat button to appear on a second row, making header 93px tall and consuming excessive screen real estate. | medium | Done (Sprint 10) |
| B-015 | Delete button (×) floats over truncated history text | Sidebar entry uses `float: right` for `×` button which overlaps the truncated title text on narrow sidebar. Should use flexbox layout. | medium | Done (Sprint 9) |
| B-016 | Copy silently fails in non-HTTPS context | `navigator.clipboard.writeText()` requires a secure context (HTTPS). On HTTP the call silently fails — `.catch(() => {})` eats the error with no user feedback. | medium | Done (Sprint 10) |
| F-013 | No confirmation on New Chat — conversation immediately discarded | Clicking "+ New Chat" mid-conversation immediately clears the thread with no confirmation. Should prompt "Start new chat? Current conversation will remain in history." | low | Done (Sprint 11) |
| F-014 | History sidebar shows no timestamps or date grouping | All history entries look identical — no indication of when the conversation happened. Should show relative timestamps (e.g. "2 hours ago") or date separators. | low | Done (Sprint 10) |
| F-015 | No click-outside overlay to close mobile sidebar | Mobile sidebar has no backdrop overlay — users don't know they can't tap outside to close it (because there's nothing to tap). Standard mobile pattern: semi-transparent overlay dismisses the sidebar. | low | Done (Sprint 10) |
| F-016 | Copy button copies plain text, not original markdown | Copy button uses `bubble.textContent` which loses markdown structure. Code blocks become plain text, tables lose formatting. Should copy the original markdown source. | low | Done (Sprint 10) |
| B-017 | Model selector truncates to "Sonnet — b..." on mobile | At 400px the model selector is capped at max-width:100px showing "Sonnet — b..." — ambiguous. Should use short labels (Haiku, Sonnet, Opus) on mobile or increase max-width. | low | Done (Sprint 11) |
| B-018 | Copy button appears on error bubbles — copies error text | When a stale 404 conversation loads, the error message bubble gets a Copy button. Copying it puts the error string ("This conversation is no longer available...") on clipboard — useless and confusing. Copy button should only appear on real Claude responses. | low | Done (Sprint 11) |
| B-019 | F-018 scroll-to-bottom button has no JS wiring | The #scroll-btn DOM element and CSS exist but no JS scroll event listener or click handler was written. Button never appears and never works. | medium | Done (Sprint 12) |
| B-020 | New Chat confirmation fires on error-only threads | confirm() dialog appears even when thread only contains a stale-history error bubble (not a real user conversation). Should only fire if thread has actual user messages (.msg.user). | low | Done (Sprint 12) |
| B-021 | Cmd+Enter else-if branch is dead code | The keydown handler's `else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter')` branch is unreachable — prior `if (e.key === 'Enter' && !e.shiftKey)` already handles it. Works by accident; should be one unified condition. | low | Done (Sprint 12) |
| B-022 | Mobile input placeholder text too long — cut off at 400px | "Message Claude (Enter to send, Shift+Enter for newline)" wraps or clips inside the textarea at narrow widths. Should be "Message Claude..." on mobile. | low | Done (Sprint 12) |
| F-019 | Word count in response stats | Add word count alongside char count: "N chars · N words" format using words from SSE done event. | low | Done (Sprint 12) |
| B-023 | Markdown not rendered inside table cells | Table cells use `td.textContent = cells[c]` which sets raw markdown as literal text. Bold, italic, and code inside table cells render as `**text**`, `*text*`, `` `code` `` instead of formatted HTML. | high | Done (Sprint 13) |
| B-024 | Conversation history lost on server restart | Server stores conversations in a JavaScript Map in memory. On any restart all message history is lost — clients get a 404. Only metadata (title, ID, timestamp) persists in localStorage. | high | Open |
| B-025 | Response stats absent when loading from history | "N chars · N words" label only appears on live messages. When loading a conversation from the sidebar, stats are never shown — char/word counts not stored server-side or computed client-side for loaded messages. | medium | Done (Sprint 13) |
| B-026 | Pluralization: "1 words" instead of "1 word" | Stats label always appends " words" (plural) regardless of count. Short responses show "4 chars · 1 words". | low | Done (Sprint 13) |
| B-027 | "Remove from history" button unstyled on stale error card | The remove button on stale-conversation error cards uses no color/border CSS — renders as a browser-default white button on the dark card. | low | Done (Sprint 13) |
| B-028 | New Chat uses native browser confirm() dialog | window.confirm() is platform-dependent, unstyled, blocked in some embedded contexts (WebView, popup-suppressing browsers). Should use a custom in-app modal matching the dark theme. | low | Done (Sprint 13) |
| B-029 | Numbered list items all render as "1." when separated by blank lines | In processTextLines(), currentList is reset to null on any blank line. Claude often separates list items with blank lines (streaming markdown), causing each item to start a new <ol> from 1. | medium | Done (Sprint 14) |
| B-030 | Mobile sidebar stays open after selecting a conversation | At ≤600px, clicking a history entry loads the conversation but leaves the sidebar overlay open. User must manually close via × button. Should auto-close on item select. | medium | Done (Sprint 14) |
| B-031 | User bubble markdown missing in loadConversation history path | sendMessage() correctly calls appendInlineSegmentsSingleLine() for live sends, but loadConversation() uses bubble.textContent = m.content for user messages — raw markdown visible when reloading from history. | medium | Done (Sprint 15) |
| B-032 | Sidebar history titles show raw markdown syntax | Conversation titles (first 40 chars of first user message) are stored/displayed without stripping markdown — sidebar shows "Show me a table with **bold** and" with raw asterisks. | low | Done (Sprint 15) |
| B-033 | Mobile code block overflows viewport by ~8px | <pre> blocks render at 408px at 400px viewport width — 8px past edge. Content is accessible via horizontal scroll but visually jarring. Missing box-sizing/max-width constraint. | low | Done (Sprint 15) |
| B-034 | Input enabled on 404 stale-conversation error state | When a conversation 404s on load, the textarea and send button remain enabled. Sending a message "succeeds" (starts a new server context) but the error banner persists, creating a contradictory UI. Should either disable input or silently clear the error banner on first successful send. | medium | Done (Sprint 16) |
| B-035 | Sidebar titles not retroactively stripped of markdown | B-032 strips markdown at write time only. Conversations saved before Sprint 15 still show raw **asterisks** in sidebar titles. Fix: apply stripMarkdown() at render time in the sidebar component. | low | Done (Sprint 16) |
| B-036 | Blockquote markdown not rendered | > blockquote lines render as literal `&gt; text` instead of a styled <blockquote> element. The markdown renderer has no rule for `> ` prefixed lines. | high | Done (Sprint 17) |
| B-037 | Code block has no language label or syntax highlighting | Fenced code blocks with language specifiers (```python) lose the language info during rendering — no badge, no class applied, no syntax highlighting. | medium | Done (Sprint 17) |
| B-038 | Escape key does not close New Chat confirmation modal | Pressing Escape while the custom confirm modal is open leaves it visible. Clicking outside the modal also fails to dismiss it. Expected: Escape and backdrop-click both act as Cancel. | medium | Done (Sprint 17) |
| B-039 | Hidden elements remain in keyboard tab order | display:none elements are excluded from tab order by browsers automatically — not a real bug. | medium | Closed (not a bug) |
| B-040 | Icon-only buttons missing aria-labels | #send-btn (►), #hamburger-btn (☰), #scroll-btn (↓), .delete-btn (×), #sidebar-close-btn (×) have no aria-label. Screen readers cannot identify these controls. | medium | Done (Sprint 17) |
| B-041 | "Claude" label shown on system 404 error messages | Stale conversation error cards display a "Claude" sender attribution above them, implying Claude said the error. It is a system/client message. | low | Done (Sprint 17) |
| B-042 | No per-message model indicator | Switching models mid-conversation leaves no record of which model answered which message. Users cannot tell if a response came from Haiku vs Sonnet vs Opus. | low | Open |
| B-043 | History sidebar entries not keyboard-navigable | All .history-entry divs have tabIndex=-1 and no role attribute. Keyboard-only users cannot select previous conversations. | medium | Open |
| B-044 | New Chat modal missing backdrop overlay | The confirmation modal has no semi-transparent backdrop behind it — page content remains fully visible behind the dialog, reducing focus clarity. | low | Done (Sprint 17) |
| B-045 | Heading size steps too subtle (H1/H2/H3 nearly identical) | H1=21px, H2=18px, H3=15.75px all weight 600 — visually hard to distinguish H2 from H3. Needs larger size steps. | low | Open |
| B-046 | Unordered list bullet character not matched | Fix only handles `- ` prefix but Claude often outputs `• ` (U+2022) and `* ` bullet formats. | high | Done (Sprint 19) |
| B-047 | Horizontal rule (`---`) nearly invisible | `<hr>` border was `rgba(255,255,255,0.15)` — now 0.3, visible. | medium | Done (Sprint 19) |
| B-048 | Tab order dominated by sidebar delete buttons | Delete buttons now tabindex="-1". | medium | Done (Sprint 18) |
| B-049 | Copy button and New Chat button missing aria-label | Both now have explicit aria-label. | low | Done (Sprint 18) |
| B-050 | Nested lists render as raw text | Nested `  - sub-item` lines now produce nested `<ul><li>`. | high | Done (Sprint 19) |
| B-051 | Confirm modal missing ARIA dialog semantics | role="dialog", aria-modal, aria-labelledby, button labels all added. | medium | Done (Sprint 19) |
| B-052 | Model selector has no accessible label | aria-label="Select AI model" added. | medium | Done (Sprint 19) |
| B-053 | History entry accessible name lacks timestamp | title attr contains first message only — two "Hello" convos indistinguishable by screen reader. Add timestamp to aria-label. | low | Open |
| B-054 | User bubbles only render inline markdown — block elements show raw | Headings, fenced code, lists, blockquote, table, HR all appear as raw markdown in user message bubbles. Inline (bold/italic/code) works. | medium | Open |
| B-055 | Mobile header wraps to two lines at 375px | At narrow widths, "Claude Chat" title wraps — pushes header taller, reduces thread space. Need to truncate title or hide New Chat button text on mobile. | low | Open |
| B-056 | Mobile input area clips at bottom of viewport | Textarea bottom bleeds slightly below safe area at 375px — "Claude" portion of placeholder hidden. | low | Open |
