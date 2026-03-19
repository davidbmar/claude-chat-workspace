# Claude Chat Workspace — Future Directions

## Near-Term (Next Sprint Candidates)

### 1. Production Deploy
Complete the v1 deployment path:
- Build image and push to ECR via `build-and-push.sh`
- Set `CLAUDE_CHAT_IMAGE` env var on all portal EC2s
- Redeploy portals with `deploy-all-portals.sh`
- Smoke test: open catalog, launch Claude Chat, send a message, verify streaming

### 2. System Prompt / Persona
Allow a system prompt to be configured per deployment:
- Read from `SYSTEM_PROMPT` env var (injected via portal config or k8s ConfigMap)
- Could be set per team (finance team gets a compliance-focused persona, etc.)
- UI toggle to show/hide the active system prompt

### 3. Model Selection
Let users choose the Claude model:
- Small UI selector in the header: Haiku (fast/cheap) | Sonnet (balanced) | Opus (powerful)
- Pass selected model in POST body
- Useful for power users who know what they need

### 4. New Conversation Button
Instead of requiring a page refresh to start fresh:
- "New Chat" button in the header
- Generates a new `conversationId`, clears the thread UI
- Server-side: old conversation stays in memory until GC, new one starts fresh

### 5. Copy/Export
After a useful conversation, let users capture it:
- "Copy to clipboard" button per message or for the whole thread
- "Download as markdown" for the full conversation
- Simple client-side operations, no server involvement

## Medium-Term

### 6. Persistent Conversation History
The big one — survive pod restarts:
- Options: write conversation JSON to a mounted volume, use a shared Redis/Postgres, or write to S3
- The simplest approach: save conversations to a file in a k8s PersistentVolumeClaim
- Or: write to S3 keyed by `conversationId` on each turn
- Unlock: "Resume last conversation" button on page load

### 7. Conversation List
Once persistence exists:
- Sidebar listing past conversations (title = first user message, truncated)
- Click to load and continue
- Delete a conversation
- Search across conversation history

### 8. Swapping the LLM Backend
The `streamResponse()` adapter was designed for this:
- Add `CLAUDE_CHAT_BACKEND=anthropic|ollama|bedrock|openai` env var
- At startup, select the appropriate adapter implementation
- Ollama adapter: call local Ollama API for on-prem deployment (no API key needed)
- Bedrock adapter: use AWS SDK + IAM role instead of API key
- OpenAI-compatible: any endpoint that speaks the OpenAI chat completions format

### 9. File/Image Upload
Extend the chat to accept attachments:
- Drag an image into the chat input → send to Claude vision
- Upload a CSV or document → Claude reads and responds about it
- Requires multipart form handling in server.js and Anthropic Files API or base64 encoding

## Long-Term / Larger Ideas

### 10. Standalone Product
Extract claude-chat-workspace entirely from the everyone-ai portal context:
- Own Docker Compose for local dev
- Own deployment scripts (independent of portal EC2s)
- Configurable via a simple JSON config file
- Could be deployed by any team, not just everyone-ai customers

### 11. Team/Shared Workspace
A "room" model where multiple users can chat together with Claude:
- WebSocket-based for real-time multi-user
- Shared conversation visible to all participants
- Each user's messages labeled with their name
- Use case: collaborative brainstorm, meeting facilitation, team Q&A

### 12. Embeddings / RAG
Give Claude access to team knowledge:
- Upload documents to a vector store
- On each message, retrieve relevant chunks and inject as context
- Use case: "Ask our docs" — internal knowledge base chatbot

### 13. Tool Use / Agents
Enable Claude to take actions:
- Define tools the server exposes (read a Google Sheet, query a DB, call an API)
- Claude decides when to use them and the server executes
- Stream tool use results back into the conversation
- This starts to look like a lightweight agent framework

## What This Evolves Into

At its simplest, claude-chat-workspace is a chat UI. But the adapter pattern + conversation history + k8s-native deployment make it a foundation for:

- **Team AI portal** — multiple chat personas served from the same infrastructure
- **Embedded AI** — drop this into any internal tool as an AI sidebar
- **Agent gateway** — route requests to specialized agents (Claude for text, other models for code, vision, etc.) behind one UI
- **Private LLM deployment** — same UI, swap backend to Ollama for fully on-prem operation
