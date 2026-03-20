# Sprint 22

Goal
- Milestone B.1: Detect fenced code blocks in Claude's streaming response, write them as real files, expose a file API, and show a "Generated Files" panel in the chat UI
- Portal: expose GET /api/workspaces/:id/files proxy endpoint so the Playwright milestone test can verify file creation from outside the pod

Constraints
- Two agents — agentA owns server.js (file extraction + API); agentB owns public/index.html (Generated Files panel)
- Non-interactive — no confirmation prompts
- Write files to /workspace/ directory inside the container (create if absent)
- Node 20 / no new npm deps — use only fs, path, os (already in Node stdlib)

## agentA-file-api

Objective
Add file extraction from Claude's responses and a file download API to server.js.

Tasks

1. File storage setup:
   At the top of server.js, add:
   ```js
   const fs = require('fs');
   const WORKSPACE_DIR = process.env.WORKSPACE_DIR || '/workspace';
   if (!fs.existsSync(WORKSPACE_DIR)) fs.mkdirSync(WORKSPACE_DIR, { recursive: true });
   // Track files per conversation: Map<conversationId, string[]>
   const conversationFiles = new Map();
   ```

2. Fenced code block extractor:
   Add a function `extractCodeBlocks(text)` that returns an array of `{ lang, filename, code }`:
   - Match all ` ``` ` fences: opening line is ` ```lang ` or ` ```lang:filename ` or just ` ``` `
   - Filename resolution rules (in priority order):
     1. Explicit: ` ```html:todo.html ` → `todo.html`
     2. Language hint: `html` → `index.html`, `javascript`/`js` → `app.js`, `python`/`py` → `main.py`, `css` → `styles.css`, `typescript`/`ts` → `app.ts`, `sh`/`bash` → `run.sh`
     3. Fallback: `generated-N.txt` where N is the 1-indexed block number
   - Deduplicate: if a filename already exists in the result set, append `-2`, `-3`, etc.

3. Wire extraction into /api/chat:
   After `history.push({ role: 'assistant', content: assistantText })`, call:
   ```js
   const blocks = extractCodeBlocks(assistantText);
   if (blocks.length > 0) {
     const saved = [];
     for (const { filename, code } of blocks) {
       const filePath = path.join(WORKSPACE_DIR, filename);
       fs.writeFileSync(filePath, code, 'utf8');
       saved.push(filename);
     }
     if (!conversationFiles.has(conversationId)) conversationFiles.set(conversationId, []);
     for (const f of saved) {
       if (!conversationFiles.get(conversationId).includes(f)) {
         conversationFiles.get(conversationId).push(f);
       }
     }
     res.write(`data: ${JSON.stringify({ files: saved })}\n\n`);
   }
   ```

4. File listing API:
   ```js
   app.get('/api/files', (req, res) => {
     const { conversationId } = req.query;
     const names = conversationId ? (conversationFiles.get(conversationId) || []) : [];
     const files = names.map(name => {
       const fp = path.join(WORKSPACE_DIR, name);
       const stat = fs.existsSync(fp) ? fs.statSync(fp) : null;
       return { name, size: stat ? stat.size : 0 };
     });
     res.json({ files });
   });
   ```

5. File download API:
   ```js
   app.get('/api/files/:name', (req, res) => {
     const name = path.basename(req.params.name); // prevent path traversal
     const fp = path.join(WORKSPACE_DIR, name);
     if (!fs.existsSync(fp)) return res.status(404).json({ error: 'not found' });
     res.download(fp, name);
   });
   ```

Acceptance Criteria
- node --check server.js passes
- After chat response with a fenced html block: file written to /workspace/index.html
- GET /api/files?conversationId=<id> returns [ { name: 'index.html', size: N } ]
- GET /api/files/index.html returns file download
- SSE stream includes `{ files: ['index.html'] }` event after done event

Merge Verification
- node --check server.js
- docker compose down && docker compose up --build -d && sleep 4 && curl -s http://localhost:8080/api/health
- curl -s 'http://localhost:8080/api/files?conversationId=test'

## agentB-generated-files-ui

Objective
Add a "Generated Files" panel to the chat UI in public/index.html that appears when Claude produces files.

Tasks

1. Panel HTML:
   Inside the chat container (below `#messages` but before the input area), add:
   ```html
   <div id="generated-files-panel" class="generated-files-panel" style="display:none">
     <div class="generated-files-header">
       <span>📁 Generated Files</span>
       <span id="generated-files-count" class="files-count"></span>
     </div>
     <ul id="generated-files-list" class="files-list"></ul>
   </div>
   ```

2. CSS:
   Add styles for `.generated-files-panel`, `.generated-files-header`, `.files-list`, `.file-item`, `.file-download-btn`:
   - Panel: subtle border, rounded, padding 12px, margin 8px 0, background slightly offset from chat bg
   - Header: bold, small caps, flex space-between
   - File item: flex row, filename (monospace) + size + download button
   - Download button: small, secondary style, cursor pointer

3. SSE handler update:
   In the SSE message handler (where `done` and `token` are processed), add a branch for `files`:
   ```js
   if (data.files && data.files.length > 0) {
     data.files.forEach(name => addGeneratedFile(name, currentConversationId));
   }
   ```

4. addGeneratedFile function:
   ```js
   function addGeneratedFile(name, conversationId) {
     const panel = document.getElementById('generated-files-panel');
     const list = document.getElementById('generated-files-list');
     // Check for duplicate
     if (list.querySelector(`[data-filename="${CSS.escape(name)}"]`)) return;
     panel.style.display = '';
     const li = document.createElement('li');
     li.className = 'file-item';
     li.dataset.filename = name;
     li.innerHTML = `<span class="file-name">${escapeHtml(name)}</span>
       <a class="file-download-btn" href="/api/files/${encodeURIComponent(name)}" download="${escapeHtml(name)}">Download</a>`;
     list.appendChild(li);
     const count = list.children.length;
     document.getElementById('generated-files-count').textContent = `${count} file${count !== 1 ? 's' : ''}`;
   }
   ```
   Note: use the existing `escapeHtml` helper if present; if not, add a minimal one.

5. Clear on new conversation:
   When a new conversation is started (wherever conversations are cleared/reset), also reset:
   ```js
   document.getElementById('generated-files-panel').style.display = 'none';
   document.getElementById('generated-files-list').innerHTML = '';
   document.getElementById('generated-files-count').textContent = '';
   ```

Acceptance Criteria
- Generated Files panel hidden on load
- After receiving `{ files: ['index.html'] }` SSE event: panel visible, shows "index.html" with Download link
- Download link href is /api/files/index.html with download attribute
- Starting a new conversation clears the panel
- No duplicate entries if same file appears in multiple messages

Merge Verification
- node --check public/index.html 2>/dev/null || node -e "require('fs').readFileSync('public/index.html','utf8'); console.log('HTML readable')"
- docker compose down && docker compose up --build -d && sleep 4 && curl -s http://localhost:8080/

Merge Order
1. agentA-file-api
2. agentB-generated-files-ui
