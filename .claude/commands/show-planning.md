# Show Issues Planning

You are going to display the current issues planning in a user-friendly format.

## Instructions

1. **Read the ISSUES_PLANNING.yaml file**.

2. **Display a summary dashboard**:
   ```
   📊 Issues Planning Dashboard
   ════════════════════════════════════

   Last sync: [timestamp or "Never"]

   📈 Statistics:
   - Total issues: X
   - Planned: X
   - Ready: X
   - In Progress: X
   - Blocked: X
   - Completed: X

   🔙 Backend: X issues
   🎨 Frontend: X issues
   🔗 Shared: X issues
   ```

3. **List issues by status** in this order:
   - **In Progress** (most important)
   - **Blocked** (need attention)
   - **Ready** (can be started)
   - **Planned** (not yet created on GitHub)
   - **Completed** (for reference)

4. **For each issue, display**:
   ```
   [ID] Title
   │ Repo: backend/frontend
   │ Priority: high/medium/low
   │ Effort: small/medium/large
   │ Status: status
   │ GitHub: #123 (link) or "Not created"
   │ Blocked by: [IDs] (if applicable)
   └─ [bounded-context or feature]
   ```

5. **Add filtering options** (ask user if they want to filter):
   - By status
   - By repository
   - By priority
   - By bounded-context/feature

6. **Highlight actionable items**:
   - Issues ready to be created on GitHub (`status: planned`)
   - Issues blocked waiting for dependencies
   - Issues in progress that need sync

## Display Format

Use clear visual hierarchy with:
- Unicode box drawing characters for structure
- Emoji for visual categorization
- Color emphasis using markdown (bold, italic)
- Clickable links to GitHub issues

## Example Output

```
📊 Issues Planning Dashboard
════════════════════════════════════

Last sync: 2025-01-27 14:30:00

📈 Statistics:
- Total issues: 7
- Planned: 3
- Ready: 1
- In Progress: 2
- Blocked: 1
- Completed: 0

🔙 Backend: 3 issues
🎨 Frontend: 3 issues
🔗 Shared: 1 issue

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔄 IN PROGRESS (2 issues)

[BACK-001] Implement Club Invitation Flow
│ Repo: backend
│ Priority: high | Effort: medium
│ Status: in-progress
│ GitHub: #45 https://github.com/RomualdP/volley_app_back/issues/45
└─ bounded-context:club-management

[FRONT-002] Implement Global Loading States
│ Repo: frontend
│ Priority: medium | Effort: small
│ Status: in-progress
│ GitHub: #23 https://github.com/RomualdP/volley_app_front/issues/23
└─ feature:shared

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚫 BLOCKED (1 issue)

[FRONT-001] Create Club Invitation Accept Page
│ Repo: frontend
│ Priority: high | Effort: medium
│ Status: blocked
│ Blocked by: BACK-001
│ GitHub: Not created
└─ feature:club-management

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ READY (1 issue)

[BACK-002] Add Redis Caching Layer
│ Repo: backend
│ Priority: medium | Effort: small
│ Status: ready
│ GitHub: #46 https://github.com/RomualdP/volley_app_back/issues/46
└─ bounded-context:shared

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 PLANNED (3 issues - not yet on GitHub)

[BACK-003] ClubNotFoundException not properly caught
[FRONT-003] Migrate Players Page to Server Components
[SHARED-001] Add Match Statistics DTOs

💡 Tip: Run /create-issues to create these on GitHub

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Important Notes

- Always start with the dashboard/summary
- Make it easy to scan and understand the current state
- Highlight actionable items
- Provide helpful tips or next actions
