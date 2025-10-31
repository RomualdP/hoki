---
description: Run backend tests with coverage report
---

# Backend Testing

Execute the complete backend test suite with coverage analysis.

## Commands to run:

```bash
cd volley-app-backend
yarn test:cov
```

## What this does:
- Runs all Jest unit tests
- Generates coverage report
- Shows detailed test results
- Highlights untested code

## Expected output:
- Test results summary
- Coverage percentages by file
- Failed tests with detailed errors (if any)

## Next steps after running:
- Review coverage report in `volley-app-backend/coverage/`
- Fix failing tests if any
- Add tests for uncovered critical code paths
