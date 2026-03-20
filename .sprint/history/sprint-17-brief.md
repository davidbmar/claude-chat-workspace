# Sprint 17

Goal
- B-036 High: Add blockquote rendering — `> text` lines should render as styled `<blockquote>` elements
- B-037 Medium: Show language label on code blocks — parse language from fenced code opening and display as a badge
- B-038 Medium: Escape key and backdrop click close the New Chat modal
- B-040 Medium: Add aria-labels to all icon-only buttons (send, hamburger, scroll-to-bottom, delete, sidebar-close)
- B-041 Low: Remove "Claude" attribution label from system 404 error messages
- B-044 Low: Add semi-transparent backdrop behind New Chat modal

Constraints
- One agent only — all changes in public/index.html (HTML + JS + CSS)
- Agent A owns everything

## agentA-accessibility-and-rendering

Objective
Blockquote rendering, code block language labels, modal UX polish, and accessibility aria-labels.

Tasks

1. B-036 Blockquote rendering:
   In the markdown renderer, add a rule for lines starting with `> `. When such a line is encountered:
   - Create a `<blockquote>` element
   - Pass the text after `> ` through the inline renderer (bold/italic/code)
   - Consecutive `> ` lines should be grouped into the same blockquote
   - Add CSS: `blockquote { border-left: 3px solid #4a5568; margin: 8px 0; padding: 4px 12px; color: #a0aec0; font-style: italic; background: rgba(255,255,255,0.03); border-radius: 0 4px 4px 0; }`

2. B-037 Code block language label:
   In the fenced code block renderer, parse the language identifier from the opening fence line (e.g., ` ```python ` → `python`). If a language is found:
   - Add a `data-language` attribute to the `<pre>` element
   - Render a language label badge above (or top-right corner of) the code block
   - CSS for badge: `position: absolute; top: 8px; right: 8px; font-size: 0.7rem; color: #718096; text-transform: uppercase; letter-spacing: 0.05em;`
   - Set `position: relative` on the `<pre>` wrapper to anchor the badge
   - Also set the language as a class on `<code>` (e.g., `class="language-python"`) for future syntax highlighting

3. B-038 Escape + backdrop dismiss modal:
   Find the `showConfirmModal()` function (or the modal show/hide logic). Add:
   - A `keydown` listener for `Escape` that calls the cancel handler (remove listener after modal closes)
   - A click listener on the modal backdrop element (the outer overlay div) that fires cancel when the click target is the backdrop itself (not the inner card) — `if (e.target === modalOverlay) cancel()`

4. B-040 Aria-labels on icon buttons:
   Add `aria-label` to each icon-only button:
   - `#send-btn`: `aria-label="Send message"`
   - `#hamburger-btn` / sidebar toggle: `aria-label="Open conversation history"`
   - `#scroll-btn`: `aria-label="Scroll to bottom"`
   - Each `.delete-btn` (history entry delete): `aria-label="Delete conversation"`
   - `#sidebar-close-btn`: `aria-label="Close sidebar"`
   Also add `role="button"` to any of these that use `<div>` instead of `<button>`.

5. B-041 Remove "Claude" label from error messages:
   Find where the 404 error bubble is created. The error card is currently wrapped in (or preceded by) a sender label showing "Claude". Remove the label for error/system messages — only real Claude responses should have the attribution label.

6. B-044 Modal backdrop:
   The `#confirm-modal` overlay div should have a semi-transparent background. Check its CSS — it should have `background: rgba(0,0,0,0.5)` on the outer overlay. If this is missing or set to transparent, add it. Also ensure it uses `display: flex` (not `display: block`) when visible so the inner card centers correctly.

Acceptance Criteria
- Ask Claude for a response with `> blockquote text` — a styled left-bordered blockquote renders instead of `&gt;` literal text
- Ask for a ```python code block — a "PYTHON" language badge appears in the top-right corner of the block
- Open New Chat modal, press Escape → modal closes. Click the dark backdrop area → modal closes. Click the card itself → modal stays open.
- Tab through the page — all interactive controls have descriptive screen-reader labels (verify with browser accessibility inspector)
- 404 stale conversation error card shows no "Claude" label above it
- New Chat modal has a visible dark semi-transparent backdrop behind the card

## Merge Order
1. agentA-accessibility-and-rendering

## Merge Verification
- node -e "require('fs').readFileSync('public/index.html','utf8'); console.log('HTML readable')"
- docker compose up --build -d && sleep 5 && curl -s http://localhost:8080/api/health
- npm audit --audit-level=high
