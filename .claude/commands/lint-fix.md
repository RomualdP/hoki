---
description: Fix linting issues across the entire project
---

# Lint and Format Project

Automatically fix linting and formatting issues across both backend and frontend.

## Commands to run:

```bash
# Backend linting and formatting
cd volley-app-backend
yarn lint
yarn format

# Frontend linting
cd ../volley-app-frontend
yarn lint --fix

# Format all files
npx prettier --write "**/*.{ts,tsx,js,jsx,json,md}"
```

## What this does:
- Runs ESLint with auto-fix on all TypeScript files
- Formats all code with Prettier
- Ensures consistent code style
- Fixes common linting violations

## Expected output:
- List of fixed linting issues
- List of files formatted
- Remaining issues that require manual intervention

## Next steps after running:
- Review remaining linting errors
- Commit formatted changes
- Verify code still works correctly
