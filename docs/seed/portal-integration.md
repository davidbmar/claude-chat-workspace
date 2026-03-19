# Claude Chat Workspace — Portal Integration

## Overview

Claude Chat Workspace is a second catalog item in the `everyone-ai` portal, alongside "Claude Code". It reuses all existing portal infrastructure (k8s, Traefik, API key injection) and only requires three file changes.

## Context: The Everyone-AI Portal

The `everyone-ai` portal is a Node.js/Express web app that:
1. Serves a SPA frontend (vanilla JS, dark theme)
2. Manages Kubernetes workspaces (create pod → create Service → create IngressRoute)
3. Injects API keys via k8s Secrets
4. Lists running workspaces with health/status

The portal already had an "App Catalog" view (`catalog.js`) with one item: Claude Code. Claude Chat is the second item.

## The appId Pattern

The key integration point is the `appId` field. The frontend sends it on every launch; the backend uses it to select the pod spec.

```
Frontend (catalog.js)
  APPS = [
    { id: 'claude-code', ... },
    { id: 'claude-chat', ... },   ← NEW
  ]

  POST /api/workspaces
  { username, teamSlug, appId: 'claude-chat', apiKey? }
         │
         ▼
Backend (workspaces.js)
  const { username, teamSlug, apiKey, templateId, appId } = req.body;
  await k8s.createWorkspacePod(username, teamSlug, effectiveApiKey, templateId, appId)
         │
         ▼
k8s.js
  if (appId === 'claude-chat') {
    // lightweight spec: claude-chat image, no postStart, smaller resources
    return await coreV1Api.createNamespacedPod(NAMESPACE, chatPod);
  }
  // else: existing code-server spec
```

## What's the Same for Both App Types

| Resource | claude-code | claude-chat |
|----------|------------|-------------|
| k8s Pod name | `workspace-<user>-<team>` | `workspace-<user>-<team>` |
| k8s Service | Port 8080, same selector | Identical |
| Traefik IngressRoute | `<user>-<team>.<domain>` | Identical |
| API key injection | k8s Secret → env | Identical |
| Stop/delete flow | DELETE /api/workspaces/:id | Identical |
| URL pattern | `https://<user>-<team>.<domain>` | Identical |
| Workspace list view | Appears in list | Also appears |

## What's Different

| Aspect | claude-code | claude-chat |
|--------|------------|-------------|
| Docker image | `claude-code-workspace:latest` | `claude-chat-workspace:latest` |
| Env var for image | `WORKSPACE_IMAGE` | `CLAUDE_CHAT_IMAGE` |
| Container name | `code-server` | `claude-chat` |
| postStart hook | Yes (template clone, CLAUDE.md, auto-start) | No |
| CPU request | 250m | 100m |
| Memory request | 512Mi | 128Mi |
| CPU limit | 1000m | 500m |
| Memory limit | 2Gi | 512Mi |
| Template selector | Shown in launch form | Hidden |
| Auto-start checkbox | Shown in launch form | Hidden |
| Pod label `template` | template id or `blank` | `claude-chat` |

## Env Var Configuration

Set on portal EC2s to use a specific ECR tag:

```bash
# /etc/portal.env or deployment environment
CLAUDE_CHAT_IMAGE=294499146847.dkr.ecr.us-east-1.amazonaws.com/automation-ai/claude-chat-workspace:latest
```

If not set, falls back to the hardcoded default (same ECR registry, `latest` tag).

## Launch Flow (End to End)

1. User opens catalog at `https://<portal-domain>/`
2. Sees two cards: "Claude Code" (robot emoji) and "Claude Chat" (speech bubble emoji)
3. Clicks "Launch Workspace" on Claude Chat
4. Enters their name — sees URL preview (`https://<name>-<team>.<domain>`)
5. Optionally enters API key (or portal's own key is used)
6. Submits — POST `/api/workspaces` with `{ username, teamSlug, appId: 'claude-chat' }`
7. Portal creates k8s Secret, Pod, Service, IngressRoute
8. Progress indicator shows startup (~10-30s for warm image, faster than code-server)
9. Badge turns green when pod is ready
10. User clicks URL → opens chat interface

## Workspace List Behavior

Chat workspaces appear in the same list as code workspaces. There's no visual distinction in v1 — both show the same username, URL, phase, and health status. The pod label `template: claude-chat` is available for future UI differentiation.

## Capacity and Quota

Claude Chat pods consume less CPU (100m requested vs 250m for code-server). In a capacity-constrained environment this means more simultaneous chat sessions fit on the same node. The existing quota check (`checkQuotaAvailable()`) still applies — chat pods count toward the pod quota.
