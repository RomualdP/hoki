---
description: Verify architectural rules compliance
---

# Architecture Compliance Check

Verify that the codebase follows the architectural rules defined in `.claude/skills/ddd-bounded-context/` (backend) and `.claude/skills/atomic-component/` (frontend).

## Architecture Rules to Check:

### Backend (Clean Architecture):
- ✓ Domain layer is framework-agnostic
- ✓ Dependencies point inward only
- ✓ Use cases are in Application layer
- ✓ Controllers use DTOs
- ✓ Infrastructure isolated from business logic

### Frontend (Feature-Based Architecture):
- ✓ Code organized by business feature
- ✓ Features in `features/` directory
- ✓ Smart/dumb component separation
- ✓ Co-located components, hooks, state per feature
- ✓ Shared code in shared folders

## Manual Verification Steps:

1. **Check Backend Structure:**
   - Review `volley-app-backend/src/` organization
   - Verify domain entities are framework-free
   - Check repository pattern implementation
   - Validate DTOs at layer boundaries

2. **Check Frontend Structure:**
   - Review `volley-app-frontend/src/features/` organization
   - Verify feature isolation
   - Check component separation (smart vs dumb)
   - Validate state management location

3. **Common Issues to Look For:**
   - Business logic in controllers
   - Direct database access from services
   - Shared state in feature components
   - Mixed concerns in single files

## Report Findings:
List any architectural violations found and suggest corrections based on Skills from `.claude/skills/`.
