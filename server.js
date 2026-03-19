'use strict';

const express = require('express');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
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
async function* streamResponse(messages) {
  const stream = client.messages.stream({
    model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages,
  });

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      yield event.delta.text;
    }
  }
}

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.post('/api/chat', async (req, res) => {
  const { message, conversationId } = req.body;
  if (!message || !conversationId) {
    return res.status(400).json({ error: 'message and conversationId are required' });
  }

  if (!conversations.has(conversationId)) {
    conversations.set(conversationId, []);
  }
  const history = conversations.get(conversationId);
  history.push({ role: 'user', content: message });

  // Prepend system prompt as first user message when starting a new conversation
  if (process.env.SYSTEM_PROMPT && history.length === 1) {
    history.unshift({ role: 'user', content: '[System: ' + process.env.SYSTEM_PROMPT + ']' });
  }

  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  let assistantText = '';
  try {
    for await (const token of streamResponse(history)) {
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
app.listen(PORT, () => console.log(`Claude Chat listening on :${PORT}`));
