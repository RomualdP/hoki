# Development Workflow - Quality Assurance Methodology

**Purpose**: Systematic workflow to ensure zero ESLint/TypeScript errors, Skills compliance, and clean code principles at every development phase.

**When to use**: Apply this methodology for ALL development tasks, from simple bug fixes to complex feature implementation.

---

## Overview

This workflow follows a **3-phase approach**:
1. **Pre-Development**: Plan and verify before writing code
2. **During Development**: Continuous validation after each file
3. **Pre-Commit**: Final quality gate before committing

Each phase has **mandatory checkpoints** to catch errors early and prevent rework.

---

## Phase 1: Pre-Development (BEFORE writing code)

### Objective
Understand requirements, identify patterns, and plan implementation to avoid architectural mistakes.

### Checklist

#### 1.1 Read Relevant Skills

**Why?** Skills contain MANDATORY patterns and rules specific to this project.

**Frontend Tasks**:
- [ ] `.claude/skills/server-components/` - Server-First pattern, data fetching
- [ ] `.claude/skills/atomic-component/` - Component decomposition, size limits
- [ ] `.claude/skills/react-state-management/` - State init, useEffect cleanup
- [ ] `.claude/skills/server-actions/` - Mutations, revalidatePath, redirect
- [ ] `.claude/skills/view-transitions/` - Navigation transitions
- [ ] `.claude/skills/mobile-first/` - Responsive design

**Backend Tasks**:
- [ ] `.claude/skills/ddd-bounded-context/` - DDD layers, entity design
- [ ] `.claude/skills/cqrs-command-query/` - Commands, Queries, Handlers
- [ ] `.claude/skills/prisma-mapper/` - Domain ↔ Prisma mapping
- [ ] `.claude/skills/ddd-testing/` - Test coverage requirements

**Always**:
- [ ] `.claude/skills/zero-warnings/` - ESLint/TypeScript error handling

#### 1.2 Identify Patterns to Apply

Based on the task, determine which patterns to use:

**Frontend Patterns**:
- **Server-First**: Default to Server Components, Client Components only when needed
- **Atomic Design**: Break down components (Page → Smart → Dumb)
- **Server Actions**: For mutations with revalidatePath

**Backend Patterns**:
- **DDD Layers**: Domain → Application → Infrastructure → Presentation
- **CQRS**: Separate Commands (writes) from Queries (reads)
- **Repository Pattern**: Interface in Domain, implementation in Infrastructure

#### 1.3 Verify API Contract

**Critical for frontend tasks involving API calls.**

Questions to answer:
- What is the **exact response structure** from the backend?
- Does it use an **envelope** `{success, data, message}` or **direct data**?
- What HTTP status codes are returned? (200, 201, 204, 404, etc.)
- How are **errors** formatted?

**Example**:
```typescript
// If backend returns envelope:
{
  "success": true,
  "data": { id: "123", title: "Template" },
  "message": "Opération réussie"
}

// Then extract data:
const response = await serverFetch<{success, data}>(...);
return response?.data || null; // ✅ CORRECT
```

#### 1.4 Plan File Decomposition

**Estimate file sizes BEFORE writing code.**

Size Limits:
- **Pages** (`app/**page.tsx`): ≤ 50 lines
- **Smart Components**: ≤ 100 lines
- **Dumb Components**: ≤ 80 lines
- **Functions**: ≤ 30 lines
- **Parameters**: ≤ 5 params

If a file will exceed limits:
- Plan to extract sub-components
- Identify reusable parts
- Design component hierarchy

**Example Planning**:
```
TemplateForm (estimated 250 lines) → TOO BIG
Plan decomposition:
  ├── TemplateForm (Smart, 80 lines) - orchestration
  ├── FormFields (Dumb, 60 lines) - input fields
  ├── ErrorAlert (Dumb, 20 lines) - error display
  └── FormActions (Dumb, 30 lines) - submit/cancel buttons
```

---

## Phase 2: During Development (AFTER each file)

### Objective
Catch errors immediately after writing code, before moving to the next file.

### Checklist

#### 2.1 Run Linters Immediately

**Run after EVERY file created or modified:**

```bash
# Frontend
cd volley-app-frontend && yarn lint

# Backend
cd volley-app-backend && yarn lint
```

**What to check**:
- 0 errors (blocking issues)
- 0 warnings (follow `.claude/skills/zero-warnings/`)

#### 2.2 Verify File Size

```bash
wc -l path/to/file.tsx
```

**Action**:
- If exceeds limit → Decompose immediately
- Don't accumulate technical debt

#### 2.3 Critical Rules (Common Mistakes)

See `.claude/skills/development-workflow/common-errors.md` for detailed examples.

**Quick Reference**:

❌ **NEVER** use `useEffect` to initialize state:
```typescript
// ❌ WRONG
const [formData, setFormData] = useState({});
useEffect(() => {
  setFormData({ ...template }); // Cascade renders!
}, [template]);

// ✅ CORRECT
const [formData, setFormData] = useState({
  title: template?.title ?? "",
  // ... initialize directly with props
});
```

❌ **NEVER** place `redirect()` inside try-catch:
```typescript
// ❌ WRONG
try {
  await serverFetch(...);
  redirect("/success"); // NEXT_REDIRECT caught!
} catch (error) {
  return { success: false };
}

// ✅ CORRECT
try {
  await serverFetch(...);
} catch (error) {
  return { success: false };
}
redirect("/success"); // Outside try-catch
```

✅ **ALWAYS** extract `response.data` if envelope:
```typescript
// ❌ WRONG
export async function getTemplate(id: string) {
  const response = await serverFetch<{success, data}>(...);
  return response; // Returns {success, data, message}
}

// ✅ CORRECT
export async function getTemplate(id: string) {
  const response = await serverFetch<{success, data}>(...);
  return response?.data || null; // Extracts data
}
```

#### 2.4 TypeScript Check

If using VSCode, check for red squiggles.

Or run build:
```bash
cd volley-app-frontend && yarn build
# or
cd volley-app-backend && yarn build
```

---

## Phase 3: Pre-Commit (BEFORE `git commit`)

### Objective
Final quality gate to ensure all code meets standards before committing.

### Checklist

#### 3.1 Run Full Linting Suite

```bash
# Frontend
cd volley-app-frontend
yarn lint    # Must output: No errors, no warnings

# Backend
cd volley-app-backend
yarn lint    # Must output: No errors, no warnings
```

**Action if fails**:
- Fix ALL errors and warnings
- Do NOT use `eslint-disable` or `@ts-ignore`
- Fix the **root cause** (see `.claude/skills/zero-warnings/`)

#### 3.2 Run Full Build

```bash
# Frontend
cd volley-app-frontend
yarn build   # Must succeed with 0 TypeScript errors

# Backend
cd volley-app-backend
yarn build   # Must succeed with 0 TypeScript errors
```

**Action if fails**:
- Fix TypeScript errors
- Ensure all types are explicit (no `any`, no `unknown`)

#### 3.3 Review Changes

```bash
git diff --stat  # Overview of changes
git diff         # Detailed diff
```

**What to verify**:
- No unintended changes (commented code, debug logs)
- No secrets or sensitive data
- File sizes respect limits
- Consistent formatting

#### 3.4 Verify Skills Compliance

Manual review:
- [ ] Component sizes: Page ≤50, Smart ≤100, Dumb ≤80 lines
- [ ] Function sizes: ≤30 lines, ≤5 params
- [ ] Clean code: No comments, descriptive names, single responsibility
- [ ] Patterns applied: Server-First, CQRS, DDD layers, etc.
- [ ] Tests: Domain 100%, Application 95%, Integration coverage

#### 3.5 Commit Message

Follow conventional commits:
```
feat(scope): short description

Detailed description with:
- What was implemented
- Why it was implemented
- Technical decisions made

Closes #issue-number
```

---

## Automated Checks (Optional but Recommended)

### Git Pre-commit Hook

Install Husky:
```bash
yarn add -D husky
npx husky init
```

Create `.husky/pre-commit`:
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."

# Frontend
cd volley-app-frontend
yarn lint || exit 1
yarn build || exit 1
cd ..

# Backend
cd volley-app-backend
yarn lint || exit 1
yarn build || exit 1
cd ..

echo "✅ All checks passed!"
```

### GitHub Actions

Create `.github/workflows/quality-checks.yml`:
```yaml
name: Quality Checks
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Frontend Lint
        run: cd volley-app-frontend && yarn install && yarn lint
      - name: Backend Lint
        run: cd volley-app-backend && yarn install && yarn lint

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Frontend Build
        run: cd volley-app-frontend && yarn install && yarn build
      - name: Backend Build
        run: cd volley-app-backend && yarn install && yarn build
```

---

## Troubleshooting

### "I have ESLint errors but I don't know how to fix them"

1. Read the error message carefully
2. Check `.claude/skills/zero-warnings/` for guidance
3. Search for similar patterns in the codebase
4. Fix the **root cause**, never disable the rule

### "My component is too big but I don't know how to decompose"

1. Identify logical sections (form fields, error display, actions)
2. Extract each section into a sub-component
3. Use Smart/Dumb pattern:
   - Smart: State management, event handlers
   - Dumb: Pure presentation with props

### "I'm not sure which pattern to apply"

1. Read the relevant Skill in `.claude/skills/`
2. Look for similar features in the codebase
3. Ask the user for clarification if multiple approaches are valid

---

## Summary: Quick Checklist

**Before coding**:
- [ ] Read relevant Skills
- [ ] Identify patterns
- [ ] Verify API contract
- [ ] Plan decomposition

**After each file**:
- [ ] Run `yarn lint`
- [ ] Check file size with `wc -l`
- [ ] Verify critical rules (no useEffect init, no redirect in try-catch, extract response.data)

**Before commit**:
- [ ] `yarn lint` → 0 errors, 0 warnings
- [ ] `yarn build` → 0 TypeScript errors
- [ ] Review `git diff`
- [ ] Verify Skills compliance
- [ ] Write conventional commit message

**Goal**: 0 errors, 0 warnings, 100% Skills compliance on first try.
