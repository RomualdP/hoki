# Create GitHub Issues from Planning

You are going to create GitHub issues from the ISSUES_PLANNING.yaml file, including support for cross-repo shared issues.

## Instructions

1. **Read the ISSUES_PLANNING.yaml file** to get all planned issues.

2. **For each issue with `status: planned`**:
   - Identify if it's a backend, frontend, or shared issue
   - Extract all metadata: title, description, labels, priority, etc.
   - Determine the target repository based on the issue type

3. **Create GitHub issues** using the `mcp__github__create_issue` tool:
   - **Backend issues**: Create in `RomualdP/volley_app_back`
   - **Frontend issues**: Create in `RomualdP/volley_app_front`
   - **Shared issues**: Create 2 issues (one in each repo) + link them

## Issue Creation Rules

**CRITICAL**: These rules apply to ALL GitHub issues created, whether from ISSUES_PLANNING.yaml or created directly:

### 1. Language Requirement
- **ALL issues MUST be written in English** (title and description)
- This applies to both manual creation and automated creation from planning files
- If the planning file contains French text, translate it to English before creating the issue

### 2. Repository Specification
- **ALWAYS specify the target repository** in the issue body:
  - Backend issues: Must include `**Repository**: RomualdP/volley_app_back`
  - Frontend issues: Must include `**Repository**: RomualdP/volley_app_front`
  - Shared issues: Each issue must specify its respective repository
- Add this information at the beginning of the issue description, after the context section
- Format: Use markdown bold format: `**Repository**: {owner}/{repo}`

### 3. Issue Body Structure
When creating issues, always follow this structure:
```markdown
## Context
{context description}

**Repository**: {owner}/{repo}

## Problem / Requirement
{detailed description}

## Solution / Implementation
{technical details}

## Acceptance Criteria
{checklist}

## References
{relevant files or documentation}
```

4. **For SHARED issues** (special handling):
   - Create **Backend issue** in `RomualdP/volley_app_back`:
     - Title: Use `backend_issue.title` (includes "(Backend)" suffix)
     - Labels: Use `backend_issue.labels`
     - Body: Full description with "## Backend Tasks" section emphasized
   - Create **Frontend issue** in `RomualdP/volley_app_front`:
     - Title: Use `frontend_issue.title` (includes "(Frontend)" suffix)
     - Labels: Use `frontend_issue.labels`
     - Body: Full description with "## Frontend Tasks" section emphasized
   - **Link the 2 issues** using `mcp__github__add_issue_comment`:
     - Add comment on backend issue: "🔗 Related Frontend: RomualdP/volley_app_front#Y"
     - Add comment on frontend issue: "🔗 Related Backend: RomualdP/volley_app_back#X"
   - **Add both issues to GitHub Project** (optional, can be done later with /sync-project)

5. **Update ISSUES_PLANNING.yaml** after each issue is created:
   - **For backend/frontend issues**:
     - Set `github_issue_number` to the created issue number
     - Set `github_url` to the issue URL
     - Set `status` from `planned` to `ready`
     - Set `created_at` to current timestamp
   - **For shared issues**:
     - Set `backend_issue.github_issue_number` and `backend_issue.github_url`
     - Set `frontend_issue.github_issue_number` and `frontend_issue.github_url`
     - Set `status` from `planned` to `ready`
     - Set `created_at` and `linked_at` to current timestamp

6. **Output a summary** showing:
   - Number of backend issues created
   - Number of frontend issues created
   - Number of shared issues created (count as 2)
   - Links to all created issues
   - Shared issues marked with 🔗 icon
   - Any errors encountered

## Important Notes

- **Language**: ALL issues MUST be in English (title and description)
- **Repository**: ALWAYS specify the target repository in the issue body using `**Repository**: {owner}/{repo}` format
- Only create issues with `status: planned`
- Do NOT create issues that already have a `github_issue_number`
- For shared issues, do NOT create if either backend_issue or frontend_issue already has a github_issue_number
- If an issue is `blocked_by`, you can still create it and mark it as blocked with appropriate labels
- The description field supports markdown and should be used as-is for the issue body (but translate to English if needed)
- Labels should be applied exactly as specified in the planning file
- If a label doesn't exist in the repo, the GitHub API will return an error - log it but continue with other issues
- Add "🤖 Generated with [Claude Code](https://claude.com/claude-code)" at the end of each issue body

## Shared Issue Body Format

For shared issues, structure the body to highlight the relevant sections for each repo:

### Backend Issue Body:
```markdown
## Context
{context description}

**Repository**: RomualdP/volley_app_back

## Problem / Requirement
{problem description}

---

## 🎯 Backend Focus

{Extract and highlight Backend Tasks section}

## 📝 Related Frontend Work

{Brief mention of Frontend Tasks}

---

🔗 **Related Frontend Issue**: RomualdP/volley_app_front#Y

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

### Frontend Issue Body:
```markdown
## Context
{context description}

**Repository**: RomualdP/volley_app_front

## Problem / Requirement
{problem description}

---

## 🎯 Frontend Focus

{Extract and highlight Frontend Tasks section}

## 📝 Related Backend Work

{Brief mention of Backend Tasks}

---

🔗 **Related Backend Issue**: RomualdP/volley_app_back#X

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

## Example Flow

```
User: /create-issues