#!/usr/bin/env bash
set -euo pipefail

if ! command -v yarn >/dev/null 2>&1; then echo "Yarn not found [ERR_YARN_MISSING]"; exit 1; fi

BASE_BRANCH=$(git remote show origin 2>/dev/null | awk '/HEAD branch/ {print $NF}')
if [ -z "${BASE_BRANCH:-}" ]; then BASE_BRANCH=main; fi
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
TEMPLATE_FILE=".github/pull_request_template.md"
GENERATOR_SCRIPT="$(cd "$(dirname "$0")/../.." && pwd)/.cursor/COMMANDS/generate-pr-body.sh"

function gh_pr_url() {
  local head_branch="$1"
  gh pr view "$head_branch" --json url -q .url 2>/dev/null || true
}

function open_pr() {
  local base_branch="$1"
  local head_branch="$2"
  local title="${PR_TITLE:-}"
  if [ -z "$title" ]; then title=$(git log -1 --pretty=%s || echo "$head_branch"); fi
  if command -v gh >/dev/null 2>&1; then
    if [ "${PR_AUTOFILL:-}" = "1" ] && [ -x "$GENERATOR_SCRIPT" ]; then
      BODY_CONTENT=$("$GENERATOR_SCRIPT" "$(pwd)" | sed 's/\r$//')
      gh pr create --base "$base_branch" --head "$head_branch" --title "$title" --body "$BODY_CONTENT"
      return
    fi
    if [ -f "$TEMPLATE_FILE" ]; then
      echo "Creating PR with template file..."
      gh pr create --base "$base_branch" --head "$head_branch" --title "$title" --body-file "$TEMPLATE_FILE"
    else
      echo "Creating PR without template file..."
      gh pr create --base "$base_branch" --head "$head_branch" --title "$title" --fill
    fi
  else
    local remote
    remote=$(git remote get-url origin 2>/dev/null || echo "")
    if [[ "$remote" =~ github.com[:/]+([^/]+)/([^/.]+)(\.git)?$ ]]; then
      local owner="${BASH_REMATCH[1]}"
      local repo="${BASH_REMATCH[2]}"
      echo "GitHub CLI not found. Open this URL to create PR (template will auto-apply):"
      echo "https://github.com/$owner/$repo/compare/$base_branch...$head_branch?expand=1"
      if [ "${PR_AUTOFILL:-}" = "1" ] && [ -x "$GENERATOR_SCRIPT" ]; then
        echo
        echo "---- Suggested PR body (copy/paste) ----"
        "$GENERATOR_SCRIPT" "$(pwd)"
      fi
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

STATE=$(command -v gh >/dev/null 2>&1 && gh pr view "$BRANCH_NAME" --state all --json state -q .state 2>/dev/null || echo "")
if [ "$STATE" = "OPEN" ]; then
  gh_pr_url "$BRANCH_NAME" && exit 0
fi
if [ "$STATE" = "CLOSED" ] || [ "$STATE" = "MERGED" ]; then
  if [ "$STATE" = "CLOSED" ] && [ "${PR_REUSE_BRANCH:-}" = "1" ]; then
    NUM=$(gh pr view "$BRANCH_NAME" --state all --json number -q .number 2>/dev/null || echo "")
    if [ -n "$NUM" ]; then gh pr reopen "$NUM" && gh_pr_url "$BRANCH_NAME" && exit 0; fi
  fi
  NEW_BRANCH="${BRANCH_NAME}-$(date +%Y%m%d-%H%M%S)"
  git checkout -b "$NEW_BRANCH" "$BRANCH_NAME"
  git push -u origin "$NEW_BRANCH"
  BRANCH_NAME="$NEW_BRANCH"
fi

open_pr "$BASE_BRANCH" "$BRANCH_NAME"
