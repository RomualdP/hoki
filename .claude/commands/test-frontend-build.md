---
description: Build frontend to verify production readiness
---

# Frontend Production Build

Build the frontend application to verify it's ready for production deployment.

## Commands to run:

```bash
cd volley-app-frontend
yarn build
```

## What this does:
- Compiles Next.js application
- Optimizes assets and bundles
- Performs type checking
- Validates all pages and routes
- Generates production-ready build

## Expected output:
- Build statistics (bundle sizes, page counts)
- Any build errors or warnings
- Performance insights

## Next steps after running:
- Review bundle sizes for optimization opportunities
- Fix any build errors
- Test production build locally with `yarn start`
