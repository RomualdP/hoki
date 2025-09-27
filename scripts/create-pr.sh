#!/usr/bin/env bash
set -euo pipefail
if ! command -v gh >/dev/null 2>&1; then echo "GitHub CLI not found"; exit 1; fi
if ! command -v yarn >/dev/null 2>&1; then echo "Yarn not found"; exit 1; fi
BASE_BRANCH=$(git remote show origin 2>/dev/null | awk '/HEAD branch/ {print $NF}')
if [ -z "${BASE_BRANCH:-}" ]; then BASE_BRANCH=main; fi
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" = "$BASE_BRANCH" ]; then
  BRANCH_NAME=${1:-"feat/auto-pr-$(date +%Y%m%d-%H%M%S)"}
  git checkout -b "$BRANCH_NAME"
else
  BRANCH_NAME="$CURRENT_BRANCH"
fi
yarn lint
yarn test
yarn build
git push -u origin "$BRANCH_NAME"
if gh pr view "$BRANCH_NAME" --json url -q .url >/dev/null 2>&1; then
  gh pr view "$BRANCH_NAME" --json url -q .url
else
  gh pr create --base "$BASE_BRANCH" --head "$BRANCH_NAME" --fill
fi
