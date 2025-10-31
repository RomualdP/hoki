# Sync Issues with GitHub Project

You are going to synchronize all issues from ISSUES_PLANNING.yaml with the GitHub Project "RomualdP's Hoki App".

## Instructions

1. **Read the ISSUES_PLANNING.yaml file** to get all issues with `github_issue_number`.

2. **Extract project information**:
   - Project URL: `https://github.com/users/RomualdP/projects/4`
   - Owner: `RomualdP`
   - Project Number: `4`

3. **Collect all issues to sync**:
   - **Backend issues**: All issues in `backend:` section with `github_issue_number`
   - **Frontend issues**: All issues in `frontend:` section with `github_issue_number`
   - **Shared issues**: Both backend_issue and frontend_issue with `github_issue_number`

4. **For each issue**:
   - Get the issue's GitHub Node ID (GraphQL ID) using GitHub API
   - Check if the issue is already in the project
   - If not in project: Add it to the project using GraphQL mutation
   - If already in project: Skip (no error)

5. **Use GitHub GraphQL API** (via `gh api graphql`):
   - Query to get Project ID:
     ```graphql
     query {
       user(login: "RomualdP") {
         projectV2(number: 4) {
           id
           title
         }
       }
     }
     ```
   - Query to get Issue Node ID:
     ```graphql
     query {
       repository(owner: "RomualdP", name: "volley_app_back") {
         issue(number: 45) {
           id
           title
         }
       }
     }
     ```
   - Mutation to add issue to project:
     ```graphql
     mutation {
       addProjectV2ItemById(input: {
         projectId: "PROJECT_ID"
         contentId: "ISSUE_NODE_ID"
       }) {
         item {
           id
         }
       }
     }
     ```

6. **Output a detailed summary**:
   ```
   📊 GitHub Project Sync
   ═════════════════════

   Project: RomualdP's Hoki App
   URL: https://github.com/users/RomualdP/projects/4

   📝 Issues processed:
     ✓ Backend: 3 issues
     ✓ Frontend: 5 issues
     ✓ Shared: 2 issues (4 total with backend + frontend)

   Results:
     ✓ Added to project: 8
     ○ Already in project: 2
     ✗ Failed: 0

   🌐 Project dashboard: https://github.com/users/RomualdP/projects/4
   ```

7. **Handle errors gracefully**:
   - If issue already in project: Skip silently (success)
   - If issue not found: Log error and continue with others
   - If GraphQL error: Log detailed error message
   - If no issues to sync: Show helpful message with next steps

## Important Notes

- **GitHub CLI required**: This command uses `gh api graphql` under the hood
- **Authentication**: User must be authenticated with `gh auth login`
- **Permissions**: Token must have `project` scope for GitHub Projects v2
- **Shared issues**: Each shared issue creates 2 entries in the project (backend + frontend)
- **Idempotent**: Can be run multiple times safely (won't duplicate issues)
- **No status update**: This command only adds issues to the project, does not update their status fields

## Example Flow

```
User: /sync-project

Claude: I'll synchronize all issues from ISSUES_PLANNING.yaml with your GitHub Project.

[Reads ISSUES_PLANNING.yaml]
[Uses gh api graphql to get project ID]
[For each issue: gets node ID and adds to project]

Claude: ✅ Successfully synced 10 issues to project "RomualdP's Hoki App"

Results:
- 8 issues added to project
- 2 issues already in project (skipped)
- 0 failures

Project URL: https://github.com/users/RomualdP/projects/4
```

## Alternative Implementation

If direct GraphQL calls are difficult, you can use the Node.js script:

```bash
node .github/scripts/sync-project.js
```

This script does the same thing but with more detailed error handling and progress reporting.

## Next Steps After Sync

After syncing issues to the project, you can:
1. **View the project board**: Open the project URL in your browser
2. **Organize issues**: Drag and drop issues in the board
3. **Update statuses**: Change issue status (TODO, In Progress, Done)
4. **Filter by labels**: Use GitHub Project filters to focus on specific issues
5. **Track progress**: See overall progress on the project dashboard

## Tips

- Run `/sync-project` after `/create-issues` to ensure all new issues are in the project
- Run periodically (weekly) to catch any issues created manually on GitHub
- Shared issues will appear twice in the project (once for backend, once for frontend) - this is intentional for tracking purposes
