---
description: Complete validation checklist before creating PR
---

# PR Validation Checklist

Complete validation before creating a pull request to ensure code quality and production readiness.

## Validation Steps:

### 1. Code Quality Checks
```bash
# Run linting and formatting
cd volley-app-backend && yarn lint && yarn format
cd ../volley-app-frontend && yarn lint
```

### 2. Type Checking
```bash
# Backend type check (implicit in build)
cd volley-app-backend && npx tsc --noEmit

# Frontend type check
cd volley-app-frontend && npx tsc --noEmit
```

### 3. Backend Tests
```bash
cd volley-app-backend
yarn test:cov
```

**Requirements:**
- ✓ All tests passing
- ✓ Coverage > 80% on new code
- ✓ No regression in existing tests

### 4. Backend Build
```bash
cd volley-app-backend
yarn build
```

**Requirements:**
- ✓ Build succeeds without errors
- ✓ No TypeScript compilation errors

### 5. Frontend Build
```bash
cd volley-app-frontend
yarn build
```

**Requirements:**
- ✓ Build succeeds without errors
- ✓ No bundle size warnings
- ✓ All pages compile successfully

### 6. Architecture Compliance
Run `/check-architecture` to verify:
- ✓ Clean Architecture (backend)
- ✓ Feature-Based Architecture (frontend)
- ✓ No architectural violations

### 7. Skills Compliance
Verify compliance with Skills from `.claude/skills/`:
- ✓ Clean Code Principles (max 30 lines/function, max 5 params, etc.)
- ✓ Naming Conventions (descriptive names, proper casing)
- ✓ TypeScript Standards (strict types, no `any`)
- ✓ React Standards (functional components, typed props)
- ✓ Zero Warnings (`.claude/skills/zero-warnings/`)
- ✓ Architecture (`.claude/skills/ddd-bounded-context/` or `.claude/skills/atomic-component/`)

### 8. Documentation
- ✓ Code is self-documenting (no comments needed)
- ✓ Complex logic has clear variable names
- ✓ Public APIs have type definitions

### 9. Git Status
```bash
git status
git diff
```

**Check:**
- ✓ No unintended files in commit
- ✓ No debug code or console.logs
- ✓ No commented-out code
- ✓ No TODO comments without tracking

### 10. Manual Testing (if applicable)
- ✓ Feature works as expected
- ✓ No console errors
- ✓ Mobile responsive (frontend)
- ✓ Accessibility standards met

## Final Checklist

Before creating PR, confirm:
- [ ] All tests passing
- [ ] All builds successful
- [ ] Linting clean
- [ ] Type checking clean
- [ ] Architecture compliant
- [ ] Skills compliant (see `.claude/skills/`)
- [ ] Manual testing complete
- [ ] Ready for code review

## Create PR
Once all checks pass:
```bash
git add .
git commit -m "feat: [description]"
git push
gh pr create
```

Or ask Claude to create the PR for you.
