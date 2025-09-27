#!/usr/bin/env bash
set -euo pipefail

if ! command -v yarn >/dev/null 2>&1; then echo "Yarn not found [ERR_YARN_MISSING]"; exit 1; fi

BASE_BRANCH=$(git remote show origin 2>/dev/null | awk '/HEAD branch/ {print $NF}')
if [ -z "${BASE_BRANCH:-}" ]; then BASE_BRANCH=main; fi
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
TEMPLATE_FILE=".github/pull_request_template.md"

function open_pr() {
  local base_branch="$1"
  local head_branch="$2"
  local title="${PR_TITLE:-}"
  if [ -z "$title" ]; then title=$(git log -1 --pretty=%s || echo "$head_branch"); fi
  if command -v gh >/dev/null 2>&1; then
    if gh pr view "$head_branch" --json url -q .url >/dev/null 2>&1; then
      gh pr view "$head_branch" --json url -q .url
    else
      if [ -f "$TEMPLATE_FILE" ]; then
        echo "Creating PR with template file..."
        gh pr create --base "$base_branch" --head "$head_branch" --title "$title" --body-file "$TEMPLATE_FILE"
      else
        echo "Creating PR without template file..."
        gh pr create --base "$base_branch" --head "$head_branch" --title "$title" --fill
      fi
    fi
  else
    local remote
    remote=$(git remote get-url origin 2>/dev/null || echo "")
    if [[ "$remote" =~ github.com[:/]+([^/]+)/([^/.]+)(\.git)?$ ]]; then
      local owner="${BASH_REMATCH[1]}"
      local repo="${BASH_REMATCH[2]}"
      echo "GitHub CLI not found. Open this URL to create PR (template will auto-apply):"
      echo "https://github.com/$owner/$repo/compare/$base_branch...$head_branch?expand=1"
    else
      echo "GitHub CLI not found and remote not detected. Create PR manually."
    fi
  fi
}

BRANCH_NAME=${1:-}
if [ -z "$BRANCH_NAME" ]; then BRANCH_NAME="feat/auto-pr-$(date +%Y%m%d-%H%M%S)"; fi

if [ "$CURRENT_BRANCH" = "$BASE_BRANCH" ]; then
  git checkout -b "$BRANCH_NAME"
else
  BRANCH_NAME="$CURRENT_BRANCH"
fi

yarn lint
yarn build

git push -u origin "$BRANCH_NAME"
open_pr "$BASE_BRANCH" "$BRANCH_NAME"
