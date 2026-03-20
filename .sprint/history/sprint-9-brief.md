# Sprint 9

Goal
- B-009 Critical: Fix mobile sidebar — add close button + click-outside overlay so user is never trapped with sidebar open
- B-010 High: Replace raw JSON API errors with human-readable messages
- B-011 High: Add CSS for rendered markdown tables (borders, padding, header styling)
- B-012 High: Fix stale history 404 UX — keep entry in sidebar, show explicit Remove button
- B-015 Medium: Fix history delete button layout — replace float:right with flexbox

Constraints
- No two agents may modify the same files
- Agent A owns: public/index.html CSS section + sidebar HTML + sidebar toggle JS
- Agent B owns: public/index.html sendMessage() error handler + loadConversation() 404 branch + model init

## agentA-css-and-layout

Objective
Fix CSS and layout bugs in public/index.html

Tasks
1. B-009 Mobile sidebar close: Add a close button (`×`) inside `.sidebar` at the top. Add a `#sidebar-overlay` div (`position:fixed; inset:0; z-index:99; background:rgba(0,0,0,0.4); display:none`) that shows when sidebar opens and dismisses sidebar when clicked. Update hamburger JS to also toggle overlay visibility. The sidebar itself should be z-index:100.

2. B-011 Table CSS: Add to the `<style>` block:
```
.bubble table { border-collapse: collapse; width: 100%; margin: 8px 0; }
.bubble th, .bubble td { border: 1px solid var(--border); padding: 6px 10px; text-align: left; font-size: 0.9em; }
.bubble th { background: rgba(255,255,255,0.06); font-weight: 600; }
.bubble tr:nth-child(even) td { background: rgba(255,255,255,0.02); }
```

3. B-015 History entry flexbox: Change `.history-entry` to `display:flex; align-items:center; gap:6px`. Give the title `flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap`. Make delete button `flex-shrink:0`. Remove any `float:right` from the delete button.

Acceptance Criteria
- On mobile (~400px), sidebar can be closed via × button or tapping the overlay
- A markdown table from Claude renders with visible borders and padding
- History entry × button sits right-aligned without overlapping the title text

## agentB-js-error-ux

Objective
Fix JavaScript UX bugs in public/index.html

Tasks
1. B-010 Friendly errors: In sendMessage() SSE error handling, replace raw JSON display with human-readable messages. Map known error types:
   - authentication_error → "API key is invalid or not configured. Please contact your administrator."
   - rate_limit_error → "Rate limit reached. Please wait a moment and try again."
   - overloaded_error → "Claude is currently busy. Please try again in a few seconds."
   - Network/fetch failure → "Could not reach the server. Check your connection and try again."
   - Default → "Something went wrong. Please try again." with a small collapsed "Details" toggle showing the raw error for debugging.

2. B-012 Stale 404 UX: In loadConversation(), when response is 404, do NOT immediately remove from localStorage. Instead: show error bubble "This conversation is no longer available (server was restarted)." with a "Remove from history" button. When that button is clicked, remove from localStorage and re-render the list. Until then, keep the entry in the sidebar.

3. B-013 Stale model guard: After setting modelSelector.value = savedModel, validate: if (modelSelector.value !== savedModel) { localStorage.removeItem('selectedModel'); } to clear stale IDs that don't match any option.

Acceptance Criteria
- A 401 API response shows "API key is invalid or not configured" not raw JSON
- Clicking a 404 history entry shows error bubble with "Remove from history" button; entry stays in sidebar
- Stale localStorage model IDs are cleared, not silently mismatched

## Merge Order
1. agentA-css-and-layout
2. agentB-js-error-ux

## Merge Verification
- node -e "require('fs').readFileSync('public/index.html','utf8'); console.log('HTML readable')"
- docker compose up --build -d && sleep 5 && curl -s http://localhost:8080/api/health
- npm audit --audit-level=high
