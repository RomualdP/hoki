# NEW FUNNEL TASKS - Volley App Backend

This document tracks all pending tasks identified in the codebase (TODOs, FIXMEs, etc.)

---

## 🔴 High Priority - Authentication & Authorization

### Implement JWT Token Extraction with @CurrentUser() Decorator

**Context**: Currently, all controllers use placeholder values for user/club IDs instead of extracting them from JWT tokens.

**Tasks**:

1. **Create @CurrentUser() decorator**
   - Location: `src/auth/decorators/current-user.decorator.ts`
   - Extract user ID and roles from JWT payload
   - Make it reusable across all controllers

2. **Update ClubsController**
   - File: `src/club-management/presentation/clubs.controller.ts`
   - Line 42: Replace `'user-id-from-jwt'` with `@CurrentUser()` decorator
   - Line 133: Replace `'user-id-from-jwt'` with `@CurrentUser()` for requesterId

3. **Update SubscriptionsController**
   - File: `src/club-management/presentation/subscriptions.controller.ts`
   - Line 36: Replace `'club-id-from-context'` with proper extraction from JWT or request context

4. **Update InvitationsController**
   - File: `src/club-management/presentation/invitations.controller.ts`
   - Line 45: Replace `'club-id-from-jwt'` and `'user-id-from-jwt'` with @CurrentUser() decorator
   - Line 89: Replace `'user-id-from-jwt'` with @CurrentUser() decorator
   - Line 129: Replace `'user-id-from-jwt'` with @CurrentUser() decorator for removerId

**Implementation Steps**:
- [ ] Create `@CurrentUser()` decorator
- [ ] Add proper types for user payload (UserPayload interface)
- [ ] Update all 6 controller methods to use the decorator
- [ ] Add proper guards to protect routes (JwtAuthGuard)
- [ ] Write unit tests for the decorator
- [ ] Write integration tests for protected routes

**Estimated Effort**: 4-6 hours

---

## 🟡 Medium Priority - Data Aggregation & Performance

### Implement Member/Team Count Aggregation

**Context**: The `list-clubs` query returns placeholder values for member/team counts and subscription info.

**Tasks**:

1. **Implement aggregation in ListClubsHandler**
   - File: `src/club-management/application/queries/list-clubs/list-clubs.handler.ts`
   - Line 35: Implement real member/team count aggregation from repositories
   - Line 38: Fetch subscription plan name from subscription repository
   - Line 39: Fetch subscription status from subscription repository

**Implementation Steps**:
- [ ] Add method to MemberRepository to count members by clubId
- [ ] Add method to count teams by clubId (requires team management implementation)
- [ ] Inject SubscriptionRepository into ListClubsHandler
- [ ] Create optimized query to fetch subscription data with club list
- [ ] Consider implementing database-level aggregation for performance
- [ ] Add caching layer if needed (Redis)
- [ ] Update ClubListReadModel with real data
- [ ] Write unit tests for aggregation logic
- [ ] Write integration tests for the complete query

**Technical Considerations**:
- Use database-level aggregation (Prisma aggregations) for better performance
- Consider N+1 query problem: fetch all related data in a single query
- Add indexes on clubId foreign keys if not already present
- Monitor query performance with large datasets

**Estimated Effort**: 3-4 hours

---

## 🟢 Low Priority - Code Quality

### Remove ESLint Disable Comments

**Context**: Some test files have ESLint disable comments that should be resolved properly.

**Tasks**:

1. **Review and fix ESLint issues in test mocks**
   - File: `src/training-management/tests/mocks/training.repository.mock.ts`
   - Line 22: Review and remove `eslint-disable` comment
   - Identify why ESLint was disabled
   - Fix the underlying issue properly

**Implementation Steps**:
- [ ] Read the file and identify the ESLint issue
- [ ] Apply proper typing or refactoring to fix the issue
- [ ] Remove the eslint-disable comment
- [ ] Verify tests still pass

**Estimated Effort**: 30 minutes - 1 hour

---

## 📋 Additional Recommendations

### 1. API Documentation
- [ ] Add Swagger/OpenAPI documentation for all endpoints
- [ ] Document DTO validation rules
- [ ] Add examples for request/response payloads

### 2. Error Handling
- [ ] Implement global exception filters
- [ ] Standardize error response format
- [ ] Add proper error codes for client handling

### 3. Testing
- [ ] Increase test coverage (current status unknown)
- [ ] Add E2E tests for critical flows
- [ ] Add integration tests for CQRS handlers

### 4. Security
- [ ] Implement rate limiting
- [ ] Add CORS configuration
- [ ] Implement API key validation for external integrations
- [ ] Add request validation middleware
- [ ] Implement CSRF protection

### 5. Performance
- [ ] Add database query logging in development
- [ ] Implement query result caching where appropriate
- [ ] Add database connection pooling configuration
- [ ] Monitor and optimize slow queries

### 6. Monitoring & Logging
- [ ] Implement structured logging
- [ ] Add application monitoring (APM)
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Add health check endpoints

---

## 🎯 Suggested Implementation Order

1. **Phase 1 - Authentication** (Week 1)
   - Implement @CurrentUser() decorator
   - Update all controllers
   - Add proper guards and tests

2. **Phase 2 - Data Aggregation** (Week 2)
   - Implement member/team count aggregation
   - Fetch subscription data properly
   - Optimize queries and add caching

3. **Phase 3 - Code Quality** (Week 2-3)
   - Remove ESLint disable comments
   - Add missing tests
   - Improve error handling

4. **Phase 4 - Infrastructure** (Week 3-4)
   - Add API documentation
   - Implement monitoring and logging
   - Add security features
   - Performance optimization

---

## 📝 Notes

- All tasks should follow the DDD/CQRS architecture patterns established in the project
- Refer to `CLAUDE.md` and `AI_RULES.md` for coding standards and best practices
- Each task should include proper unit and integration tests
- Update documentation after completing each task

---

**Last Updated**: 2025-10-19
**Total TODOs Found**: 9
**Critical Tasks**: 6 (Authentication)
**Medium Priority**: 3 (Data Aggregation)
**Low Priority**: 1 (Code Quality)
