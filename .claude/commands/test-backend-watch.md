---
description: Run backend tests in watch mode for development
---

# Backend Testing (Watch Mode)

Run backend tests in watch mode for continuous testing during development.

## Commands to run:

```bash
cd volley-app-backend
yarn test:watch
```

## What this does:
- Starts Jest in watch mode
- Re-runs tests automatically on file changes
- Provides interactive test filtering options

## Usage:
- Press `a` to run all tests
- Press `f` to run only failed tests
- Press `p` to filter by filename pattern
- Press `t` to filter by test name pattern
- Press `q` to quit watch mode
