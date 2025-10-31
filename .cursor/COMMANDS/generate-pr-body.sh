#!/usr/bin/env bash
set -euo pipefail

REPO_DIR=${1:-""}
if [ -z "$REPO_DIR" ]; then
  echo "Usage: $0 /absolute/path/to/repo" >&2
  exit 1
fi
cd "$REPO_DIR"

BASE_BRANCH=$(git remote show origin 2>/dev/null | awk '/HEAD branch/ {print $NF}')
if [ -z "${BASE_BRANCH:-}" ]; then BASE_BRANCH=main; fi
HEAD_BRANCH=$(git rev-parse --abbrev-ref HEAD)

COMMITS=$(git log --pretty=format:"- %s" "$BASE_BRANCH".."$HEAD_BRANCH" 2>/dev/null || echo "")
if [ -z "$COMMITS" ]; then COMMITS="- Update branch $HEAD_BRANCH"
fi

CHANGED_FILES=$(git diff --name-only "$BASE_BRANCH".."$HEAD_BRANCH" 2>/dev/null || echo "")
if [ -z "$CHANGED_FILES" ]; then CHANGED_FILES=$(git show --name-only --pretty="format:" HEAD | sed '/^$/d' || true)
fi

# Group top-level paths
CHANGES_SUMMARY=$(echo "$CHANGED_FILES" | awk -F/ '{print $1}' | sort | uniq -c | awk '{printf("- %s files in `%s`\n", $1, $2)}' || true)
if [ -z "$CHANGES_SUMMARY" ]; then CHANGES_SUMMARY="- Minor updates"
fi

LINT_STATUS=${PR_LINT_STATUS:-unknown}
TEST_STATUS=${PR_TEST_STATUS:-unknown}
BUILD_STATUS=${PR_BUILD_STATUS:-unknown}

cat <<'EOF'
## Summary
EOF

echo "Auto-generated from commits on branch \`$HEAD_BRANCH\` against \`$BASE_BRANCH\`:"
echo "$COMMITS"

echo
cat <<'EOF'
## Changes
EOF

echo "$CHANGES_SUMMARY"

echo
cat <<'EOF'
## Tests and Checks
EOF

echo "- Lint: $LINT_STATUS"
echo "- Tests: $TEST_STATUS"
echo "- Build: $BUILD_STATUS"

echo
cat <<'EOF'
## Checklist
- [x] Follows `Skills (`.claude/skills/`)` and project conventions
- [ ] No ESLint or TypeScript errors
- [ ] Tests added or updated
- [ ] Docs updated if needed
- [ ] No secrets committed

## Linked Issues
- N/A

## Risk and Impact
- Describe risk and migration if any

## Deployment Notes
- Steps and rollback plan

## Reviewer Notes
- Areas to focus
EOF
