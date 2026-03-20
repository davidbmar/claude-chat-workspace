# Sprint 19

Goal
- B-046 Critical: Fix unordered list bullet matching — renderer only handles `- ` but Claude outputs `• ` (U+2022) and `* ` too; match all three
- B-050 High: Support nested lists — indented `  - sub-item` lines should produce nested `<ul><li>` inside the parent `<li>`
- B-047 Medium: Fix HR visibility — increase opacity from 0.15 to 0.3
- B-051 Medium: Add ARIA dialog semantics to confirm modal — role, aria-modal, aria-labelledby, button labels
- B-052 Medium: Add accessible label to model selector — aria-label or visually-hidden `<label>`

Constraints
- One agent only — all changes in public/index.html
- Agent A owns everything

## agentA-lists-and-aria

Objective
Fix unordered list rendering for all bullet formats, add nested list support, fix HR visibility, and complete modal/selector ARIA.

Tasks

1. B-046 Unordered list bullet formats:
   In the markdown renderer (`processTextLines` or equivalent), update the condition that matches unordered list items to also catch:
   - `• text` (Unicode bullet U+2022) — Claude's default bullet char
   - `* text` (asterisk-space — must not conflict with bold `**`)
   The simplest approach: normalize at parse time. When a line starts with `• ` or `* ` (but not `**`), convert it to treat as `- ` before processing. Then the existing `- ` branch handles all three.
   Make sure `* ` is only matched as a list item when the line starts with exactly `* ` (single asterisk + space), not `**`.

2. B-050 Nested lists:
   After fixing B-046, add support for indented list items. When inside a `<ul>` or `<ol>` context and a line matches `/^  [-•*] /` or `/^    [-•*] /` (2 or 4 spaces), create a nested `<ul>` inside the current `<li>` rather than flushing to plain text.
   Keep it simple — support one level of nesting (2-space or 4-space indent). Do not try to implement arbitrary depth.
   When the indent returns to zero, close the nested list and continue the parent list.

3. B-047 HR opacity:
   Find the CSS rule: `hr { border: none; border-top: 1px solid rgba(255,255,255,0.15); margin: 12px 0; }`
   Change `0.15` to `0.3`: `border-top: 1px solid rgba(255,255,255,0.3);`

4. B-051 Confirm modal ARIA:
   Find `#confirm-modal`. Add to the outer overlay div:
   - `role="dialog"`
   - `aria-modal="true"`
   - `aria-labelledby="confirm-modal-title"`
   Find the `<p>` inside the modal card and add `id="confirm-modal-title"`.
   Find the Cancel button inside the modal and add `aria-label="Cancel — keep current conversation"`.
   Find the confirm/New Chat button and add `aria-label="Confirm — start new conversation"`.

5. B-052 Model selector label:
   Find `#model-selector` (the `<select>` element). Add `aria-label="Select AI model"` directly to the element. Alternatively add a visually-hidden `<label for="model-selector">Model</label>` before it using CSS `.sr-only { position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0,0,0,0); }`.

Acceptance Criteria
- Ask Claude "give me a bullet list of 5 things" — response renders as proper `<ul><li>` whether Claude uses `•`, `-`, or `*` format
- Ask "show nested bullet list with sub-items" — nested items render indented under their parent as nested `<ul>`
- A response with `---` shows a clearly visible horizontal dividing line
- Opening New Chat modal: screen reader announces "dialog", buttons have descriptive labels
- Model selector has accessible label readable by screen readers

## Merge Order
1. agentA-lists-and-aria

## Merge Verification
- node -e "require('fs').readFileSync('public/index.html','utf8'); console.log('HTML readable')"
- docker compose up --build -d && sleep 5 && curl -s http://localhost:8080/api/health
- npm audit --audit-level=high
