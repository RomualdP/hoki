# Sync Planning with GitHub Issues

You are going to synchronize the ISSUES_PLANNING.yaml file with the current state of issues on GitHub.

## Instructions

1. **Read the ISSUES_PLANNING.yaml file** to get all issues with `github_issue_number`.

2. **For each issue that has a `github_issue_number`**:
   - Fetch the issue from GitHub using `mcp__github__get_issue`
   - Compare the GitHub issue state with the planning file
   - Update the planning file with:
     - Current status (open/closed)
     - Updated labels
     - Updated assignee
     - `updated_at` timestamp

3. **Status Mapping**:
   - GitHub `open` + no assignee → `status: ready`
   - GitHub `open` + has assignee → `status: in-progress`
   - GitHub `closed` → `status: completed`
   - If issue has `status:blocked` label → `status: blocked`

4. **Detect changes**:
   - Log any significant changes (status, assignee, labels)
   - Highlight issues that were closed since last sync

5. **Update ISSUES_PLANNING.yaml**:
   - Update `last_sync` metadata to current timestamp
   - Save all changes

6. **Output a summary**:
   - Number of issues synced
   - Issues that changed status
   - Issues that were closed
   - Issues that are blocked

## Important Notes

- Only sync issues that already have a `github_issue_number`
- Do NOT create new issues during sync (use `/create-issues` for that)
- If an issue number exists but the issue is not found on GitHub, mark it as `status: deleted` in the planning
- Preserve all other metadata that's not synced from GitHub (description, skills, etc.)

## Example Usage

```
User: /sync-planning