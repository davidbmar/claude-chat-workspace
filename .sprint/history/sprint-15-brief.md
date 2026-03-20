# Sprint 15

Goal
- B-031 Medium: Fix user bubble markdown in loadConversation — replace `bubble.textContent = m.content` with `appendInlineSegmentsSingleLine(bubble, m.content)` for user-role messages in the history-load path
- B-032 Low: Strip markdown from sidebar history titles — when saving/displaying conversation title (first 40 chars of first message), strip markdown syntax so `**bold**` shows as `bold`
- B-033 Low: Fix mobile code block width overflow — `<pre>` blocks exceed viewport at 400px; add `box-sizing:border-box` and `max-width:100%` to code block CSS

Constraints
- One agent only — all changes in public/index.html (JS + CSS)
- Agent A owns everything

## agentA-polish

Objective
Three small targeted fixes in public/index.html — one JS fix in the history load path, one title sanitizer, one CSS constraint.

Tasks

1. B-031 loadConversation user bubble markdown: Find the `loadConversation` function (or wherever `GET /api/conversations/:id` response is rendered). In the loop that creates message bubbles, find the user-role path where text is set. Replace the plain `textContent` assignment with a call to `appendInlineSegmentsSingleLine(bubble, m.content)`. This is the same function already used in `sendMessage()` — mirror that behavior.

2. B-032 Strip markdown from sidebar titles: Find where conversation titles are created from the first user message (look for the `slice(0, 40)` or similar truncation). Before storing or displaying the title, strip common markdown syntax:
   - Remove `**text**` → `text` (bold)
   - Remove `*text*` → `text` (italic)
   - Remove `` `text` `` → `text` (inline code)
   - Remove `# ` heading prefixes
   Use a simple regex chain: `text.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1').replace(/`([^`]+)`/g, '$1').replace(/^#+\s*/gm, '')`

3. B-033 Mobile code block CSS: Find the CSS rules for `pre` and `code` elements. Add or update:
   ```css
   pre { max-width: 100%; box-sizing: border-box; overflow-x: auto; }
   ```
   Ensure the bubble container doesn't allow children to overflow: add `overflow: hidden` or `max-width: 100%` to `.msg.claude` or `.bubble` if needed.

Acceptance Criteria
- Send `**hello** world`, reload page, load from sidebar — user bubble shows bold "hello" not raw `**hello**`
- Send a message with `**bold**` in it — sidebar title shows "bold" not "**bold**"
- At 400px viewport, a code block response fits within the viewport (no 8px overflow)

## Merge Order
1. agentA-polish

## Merge Verification
- node -e "require('fs').readFileSync('public/index.html','utf8'); console.log('HTML readable')"
- docker compose up --build -d && sleep 5 && curl -s http://localhost:8080/api/health
- npm audit --audit-level=high
