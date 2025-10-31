---
description: Run frontend linting and type checking
---

# Frontend Testing

Execute frontend code quality checks and type validation.

## Commands to run:

```bash
cd volley-app-frontend
yarn lint
yarn type-check || npx tsc --noEmit
```

## What this does:
- Runs Next.js ESLint checks
- Performs TypeScript type checking
- Validates code quality standards

## Expected output:
- Linting errors and warnings
- Type errors if any
- Suggestions for fixes

## Next steps after running:
- Fix linting errors with `yarn lint --fix`
- Resolve TypeScript type errors
- Review and address warnings
