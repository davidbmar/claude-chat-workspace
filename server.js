'use strict';

const express = require('express');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

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

// Per-session conversation history: Map<conversationId, [{role, content}]>
// Resets on server restart — intentional for a lightweight chat session model.
const conversations = new Map();

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
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  } catch (err) {
    console.error('[chat] stream error:', err.message);
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
  }
  res.end();
});

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => console.log(`Claude Chat listening on :${PORT}`));

function shutdown() {
  server.close(() => process.exit(0));
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
