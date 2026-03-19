#!/usr/bin/env bash
# build-and-push.sh — build claude-chat-workspace image on automation EC2 and push to ECR.
# Mirrors docker/claude-code-workspace/build-and-push.sh — see that script for full comments.
#
# Usage:
#   bash build-and-push.sh [--pem PATH] [--jump-host HOST]
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

ECR_REGISTRY="294499146847.dkr.ecr.us-east-1.amazonaws.com"
ECR_REPO="automation-ai/claude-chat-workspace"
ECR_REGION="us-east-1"
BUILD_EC2="10.100.39.119"

PEM="${PEM:-$HOME/Desktop/login/deployment-portal-vibeland-us-east-1.pem}"
JUMP="${JUMP:-ubuntu@something.ai.internal.capsule.com}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --pem)       PEM="$2";  shift 2 ;;
    --jump-host) JUMP="$2"; shift 2 ;;
    *) echo "[ERROR] Unknown argument: $1" >&2; exit 1 ;;
  esac
done

if [[ ! -f "$PEM" ]]; then
  echo "[ERROR] PEM key not found: $PEM" >&2
  exit 1
fi

SSH="ssh -i $PEM -o StrictHostKeyChecking=no -o ConnectTimeout=15 -J $JUMP"
SCP="scp -i $PEM -o StrictHostKeyChecking=no -J $JUMP"
DATE_TAG="$(date +%Y-%m-%d)"

echo "[INFO] Archiving build context..."
TARBALL="$(mktemp /tmp/claude-chat-workspace-XXXXXX.tar.gz)"
tar -czf "$TARBALL" -C "$SCRIPT_DIR" Dockerfile package.json server.js public/

echo "[INFO] Copying build context to automation EC2 ($BUILD_EC2)..."
$SCP "$TARBALL" "ubuntu@$BUILD_EC2:/tmp/claude-chat-workspace.tar.gz"
rm -f "$TARBALL"

echo "[INFO] Building and pushing on automation EC2..."
$SSH "ubuntu@$BUILD_EC2" bash -s "$ECR_REGISTRY" "$ECR_REPO" "$ECR_REGION" "$DATE_TAG" << 'REMOTE'
set -euo pipefail
ECR_REGISTRY="$1"
ECR_REPO="$2"
ECR_REGION="$3"
DATE_TAG="$4"

BUILD_DIR="/tmp/claude-chat-workspace-build"
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"
tar -xzf /tmp/claude-chat-workspace.tar.gz -C "$BUILD_DIR"
cd "$BUILD_DIR"

echo "[REMOTE] Logging in to ECR..."
aws ecr get-login-password --region "$ECR_REGION" \
  | sudo docker login --username AWS --password-stdin "$ECR_REGISTRY"

echo "[REMOTE] Building image..."
sudo docker build \
  -t "$ECR_REGISTRY/$ECR_REPO:latest" \
  -t "$ECR_REGISTRY/$ECR_REPO:$DATE_TAG" \
  .

echo "[REMOTE] Pushing :latest..."
sudo docker push "$ECR_REGISTRY/$ECR_REPO:latest"

echo "[REMOTE] Pushing :$DATE_TAG..."
sudo docker push "$ECR_REGISTRY/$ECR_REPO:$DATE_TAG"

echo "[REMOTE] Done."
REMOTE

echo ""
echo "[DONE] Image pushed: $ECR_REGISTRY/$ECR_REPO:latest and :$DATE_TAG"
echo ""
echo "Next: set CLAUDE_CHAT_IMAGE on portal EC2s and redeploy:"
echo "  bash $(dirname "$SCRIPT_DIR")/scripts/deploy-all-portals.sh"
