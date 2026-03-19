# Sprint 5

Goal
- Fix graceful handling of stale history entries when the server restarts and conversations are lost (B-006)
- Add markdown heading rendering for # ## ### syntax (F-006)
- Add markdown unordered list rendering for - item syntax (F-007)
- Add server-side request logging and graceful shutdown (server robustness)

Constraints
- No two agents may modify the same files
- Agent A owns: public/index.html
- Agent B owns: server.js

Merge Order
1. agentA-markdown-and-history-fixes
2. agentB-server-robustness

Merge Verification
- echo "No automated tests yet — verify manually with: docker compose up"

## agentA-markdown-and-history-fixes

Objective
- Improve the markdown renderer with heading and list support, and handle stale history entries gracefully

Tasks
- Open public/index.html and read it fully before making changes
- Fix B-006: In the history item click handler, when fetching GET /api/conversations/:id, handle the case where the server returns a 404 (conversation not found after server restart). If a 404 is returned: show a small inline error message in the thread like "This conversation is no longer available (server was restarted)." Remove the stale entry from localStorage and re-render the history list.
- Add F-006: In renderTextInto(), after splitting on fenced code blocks, detect lines starting with # markdown headings BEFORE calling appendInlineSegments. In the text-part processing, split on newlines first, then check if each line starts with `# `, `## `, or `### ` and create the appropriate heading element (h1, h2, h3) with the heading text content. Apply inline formatting (bold/italic/code) to heading content too.
- Add F-007: In renderTextInto() (or appendInlineSegments), detect contiguous lines starting with `- ` and group them into a `<ul>` element with `<li>` children. Each list item text should have inline formatting (bold/italic/code) applied via appendFormattedLine(). A blank line or a non-list line ends the current list.
- Commit with: feat: markdown headings and lists, graceful stale history handling (B-006, F-006, F-007)

Acceptance Criteria
- Clicking a stale history entry shows an inline error and removes the entry from localStorage
- Claude responses with # Heading render as h1/h2/h3 elements (not raw # text)
- Claude responses with - list item render as <ul><li> elements
- Bold, italic, and inline code still work inside headings and list items
- No regressions in existing code block or bold/italic rendering

## agentB-server-robustness

Objective
- Add request logging and graceful shutdown to the server

Tasks
- Open server.js and read it fully before making changes
- Add request logging middleware: before app.use(express.json()), add a simple middleware that logs `[${new Date().toISOString()}] ${req.method} ${req.url}` to console for every request. Use app.use() with a function that calls next().
- Add graceful shutdown: after app.listen(), add process.on('SIGTERM', ...) and process.on('SIGINT', ...) handlers that call server.close() and then process.exit(0). Store the return value of app.listen() in a variable named `server` so it can be closed.
- Add a conversation cleanup: add a route DELETE /api/conversations which clears ALL conversations from the Map (useful for testing). Returns { ok: true, cleared: count }.
- Commit with: feat: request logging, graceful shutdown, bulk conversation clear endpoint

Acceptance Criteria
- Every HTTP request is logged to stdout with method, URL, and ISO timestamp
- SIGTERM and SIGINT trigger graceful server close
- DELETE /api/conversations (no id) clears all conversations and returns count
- DELETE /api/conversations/:id (existing) still works per individual conversation
