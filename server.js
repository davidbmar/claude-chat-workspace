'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs');
const Anthropic = require('@anthropic-ai/sdk');

const WORKSPACE_DIR = process.env.WORKSPACE_DIR || '/workspace';
if (!fs.existsSync(WORKSPACE_DIR)) fs.mkdirSync(WORKSPACE_DIR, { recursive: true });
// Track files per conversation: Map<conversationId, string[]>
const conversationFiles = new Map();

const app = express();

const startTime = new Date();
let requestCount = 0;

// Request logging middleware
app.use((req, _res, next) => {
  requestCount++;
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// F-020: Configurable tool-chat module — env vars with sensible defaults
const TOOL_NAME = process.env.TOOL_NAME || 'Claude Chat';
const TOOL_ICON = process.env.TOOL_ICON || '💬';
const TOOL_DESCRIPTION = process.env.TOOL_DESCRIPTION || 'Chat with Claude';
const TOOL_COLOR = process.env.TOOL_COLOR || '#7c3aed';

// Per-session conversation history: Map<conversationId, [{role, content}]>
// Resets on server restart — intentional for a lightweight chat session model.
const conversations = new Map();

// ---------------------------------------------------------------------------
// Fenced code block extractor.
// Returns [{lang, filename, code}] for every ```...``` block in text.
// ---------------------------------------------------------------------------
const LANG_TO_FILENAME = {
  html: 'index.html',
  javascript: 'app.js',
  js: 'app.js',
  python: 'main.py',
  py: 'main.py',
  css: 'styles.css',
  typescript: 'app.ts',
  ts: 'app.ts',
  sh: 'run.sh',
  bash: 'run.sh',
};

function extractCodeBlocks(text) {
  const results = [];
  const seen = new Map(); // filename -> count for deduplication
  const fenceRe = /^```([^\n]*)\n([\s\S]*?)^```/gm;
  let match;
  let blockIndex = 0;
  while ((match = fenceRe.exec(text)) !== null) {
    blockIndex++;
    const header = match[1].trim();
    const code = match[2];
    let lang = '';
    let filename = '';

    const colonIdx = header.indexOf(':');
    if (colonIdx !== -1) {
      // Explicit filename: ```html:todo.html
      lang = header.slice(0, colonIdx);
      filename = header.slice(colonIdx + 1);
    } else {
      lang = header;
      filename = LANG_TO_FILENAME[lang.toLowerCase()] || `generated-${blockIndex}.txt`;
    }

    // Deduplicate: append -2, -3, etc. for repeated filenames
    if (seen.has(filename)) {
      const count = seen.get(filename) + 1;
      seen.set(filename, count);
      const dot = filename.lastIndexOf('.');
      filename = dot !== -1
        ? `${filename.slice(0, dot)}-${count}${filename.slice(dot)}`
        : `${filename}-${count}`;
    } else {
      seen.set(filename, 1);
    }

    results.push({ lang, filename, code });
  }
  return results;
}

// ---------------------------------------------------------------------------
// Swappable LLM backend adapter.
// To switch providers: replace only this function.
// The conversation history format, SSE streaming, and UI are all backend-agnostic.
// ---------------------------------------------------------------------------
async function* streamResponse(messages, model) {
  const streamOptions = {
    model: model || process.env.CLAUDE_MODEL || 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages,
  };
  if (process.env.SYSTEM_PROMPT) {
    streamOptions.system = process.env.SYSTEM_PROMPT;
  }
  const stream = client.messages.stream(streamOptions);

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      yield event.delta.text;
    }
  }
}

app.get('/api/health', (_req, res) => res.json({ ok: true }));

// F-020: Returns tool metadata — SYSTEM_PROMPT is intentionally excluded (server-side only)
app.get('/api/config', (_req, res) => {
  res.json({ toolName: TOOL_NAME, toolIcon: TOOL_ICON, toolDescription: TOOL_DESCRIPTION, toolColor: TOOL_COLOR });
});

app.get('/api/stats', (_req, res) => {
  const totalMessages = [...conversations.values()].reduce((sum, h) => sum + h.length, 0);
  res.json({
    uptime: Math.floor((Date.now() - startTime) / 1000),
    conversationCount: conversations.size,
    messageCount: totalMessages,
    requestCount,
    version: '1.0.0',
  });
});

app.get('/api/conversations', (_req, res) => {
  const list = [...conversations.entries()].map(([id, history]) => {
    const firstUser = history.find(m => m.role === 'user');
    const preview = firstUser ? firstUser.content.slice(0, 60) : '';
    return { id, messageCount: history.length, preview };
  });
  res.json({ conversations: list });
});

app.get('/api/conversations/:id', (req, res) => {
  const history = conversations.get(req.params.id);
  if (!history) return res.status(404).json({ error: 'not found' });
  res.json({ messages: history });
});

app.delete('/api/conversations', (_req, res) => {
  const count = conversations.size;
  conversations.clear();
  res.json({ ok: true, cleared: count });
});

app.delete('/api/conversations/:id', (req, res) => {
  if (!conversations.has(req.params.id)) return res.status(404).json({ error: 'not found' });
  conversations.delete(req.params.id);
  res.json({ ok: true });
});

app.post('/api/chat', async (req, res) => {
  const { message, conversationId, model } = req.body;
  if (!message || !conversationId) {
    return res.status(400).json({ error: 'message and conversationId are required' });
  }

  if (!conversations.has(conversationId)) {
    conversations.set(conversationId, []);
  }
  const history = conversations.get(conversationId);
  history.push({ role: 'user', content: message });

  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  let assistantText = '';
  try {
    for await (const token of streamResponse(history, model)) {
      assistantText += token;
      res.write(`data: ${JSON.stringify({ token })}\n\n`);
    }
    history.push({ role: 'assistant', content: assistantText });
    res.write(`data: ${JSON.stringify({ done: true, chars: assistantText.length, words: assistantText.split(/\s+/).filter(Boolean).length })}\n\n`);
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
  } catch (err) {
    console.error('[chat] stream error:', err.message);
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
  }
  res.end();
});

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

app.get('/api/files/:name', (req, res) => {
  const name = path.basename(req.params.name); // prevent path traversal
  const fp = path.join(WORKSPACE_DIR, name);
  if (!fs.existsSync(fp)) return res.status(404).json({ error: 'not found' });
  res.download(fp, name);
});

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`Claude Chat listening on :${PORT}`);
  console.log(`[config] toolName=${TOOL_NAME} toolIcon=${TOOL_ICON} toolColor=${TOOL_COLOR} systemPrompt=${process.env.SYSTEM_PROMPT ? 'SET' : 'not set'}`);
});

function shutdown() {
  server.close(() => process.exit(0));
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
