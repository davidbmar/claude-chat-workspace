# Sprint 8

Goal
- Fix markdown table rendering (B-007): GFM pipe-table syntax renders as raw text
- Fix model selection persistence (B-008): model selector resets to Sonnet on page reload
- Fix copy button overlap on short responses (B-005): needs minimum padding-right ~56px

Constraints
- No two agents may modify the same files
- Agent A owns: public/index.html (model persistence + copy button overlap fix)
- Agent B owns: public/index.html table renderer — NOTE: agents must coordinate; agentA commits first, agentB must git pull before editing

Merge Order
1. agentA-frontend-fixes
2. agentB-table-renderer

Merge Verification
- echo "No automated tests — verify manually with: docker compose up"

## agentA-frontend-fixes

Objective
- Fix model selector persistence across page reloads and fix copy button overlap on short responses

Tasks
- Edit public/index.html: in the model selector change event handler, add localStorage.setItem('selectedModel', this.value)
- Edit public/index.html: on page load after DOMContentLoaded, read localStorage.getItem('selectedModel') and if truthy set document.getElementById('model-selector').value to the saved value
- Edit public/index.html: in the .msg.claude CSS rule add padding-right: 56px so the Copy button does not overlap text on short bubbles
- Commit with: fix: persist model selection in localStorage, fix copy button overlap (B-005, B-008)

Acceptance Criteria
- Selecting Haiku and reloading the page keeps Haiku selected
- Copy button does not visually overlap message text on short Claude responses

## agentB-table-renderer

Objective
- Add GFM markdown table rendering to the DOM-based markdown renderer in public/index.html

Tasks
- Read public/index.html and understand the existing renderTextInto() DOM-based markdown renderer
- Add table block detection: a contiguous group of lines where line 0 matches /^\|.+\|$/ and line 1 matches /^\|[-| :]+\|$/ — this is a GFM table
- Parse header cells from line 0, skip line 1 (separator), parse data rows from remaining lines
- Build table as DOM elements using createElement only (no innerHTML): table > thead > tr > th for headers, tbody > tr > td for data rows; set cell text via textContent
- Insert the table as a block-level element alongside existing code blocks and paragraph text
- Commit with: feat: GFM table rendering in DOM markdown renderer (B-007)

Acceptance Criteria
- A markdown table renders as an HTML table element, not raw pipe-delimited text
- Existing rendering (headings, bold, italic, code blocks, lists) still works correctly
