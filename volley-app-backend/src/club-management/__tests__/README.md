# Test Utilities - Builders & Factories

This directory contains reusable test utilities to simplify and standardize test setup across the `club-management` bounded context.

## Directory Structure

```
__tests__/
├── builders/           # Entity builders with fluent API
│   ├── club.builder.ts
│   ├── subscription.builder.ts
│   ├── invitation.builder.ts
│   └── member.builder.ts
├── factories/          # Test infrastructure factories
│   ├── repository.factory.ts
│   └── test-module.factory.ts
└── README.md          # This file
```

## Usage Guide

### 1. Repository Factories

**Purpose**: Eliminate repetitive mock repository creation code.

**Before**:
```typescript
const mockClubRepository: jest.Mocked<IClubRepository> = {
  save: jest.fn(),
  findById: jest.fn(),
  findByOwnerId: jest.fn(),
  findAll: jest.fn(),
  existsByName: jest.fn(),
  getAllClubNames: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
};
```

**After**:
```typescript
import { TestRepositoryFactory } from '../../../__tests__/factories/repository.factory';

const clubRepository = TestRepositoryFactory.createMockClubRepository();
```

**Available Factories**:
- `createMockClubRepository()` - All IClubRepository methods
- `createMockSubscriptionRepository()` - All ISubscriptionRepository methods
- `createMockInvitationRepository()` - All IInvitationRepository methods
- `createMockMemberRepository()` - All IMemberRepository methods

---

### 2. Test Module Factory

**Purpose**: Simplify NestJS test module setup.

**Before**:
```typescript
const module: TestingModule = await Test.createTestingModule({
  providers: [
    CreateClubHandler,
    {
      provide: CLUB_REPOSITORY,
      useValue: mockClubRepository,
    },
  ],
}).compile();

handler = module.get<CreateClubHandler>(CreateClubHandler);
```

**After**:
```typescript
import { TestModuleFactory } from '../../../__tests__/factories/test-module.factory';

const { handler } = await TestModuleFactory.createForHandler(CreateClubHandler, [
  { provide: CLUB_REPOSITORY, useValue: clubRepository },
]);
```

**Available Methods**:
- `createForHandler<T>(handlerClass, dependencies)` - For command/query handlers
- `createForService<T>(serviceClass, dependencies)` - For domain services

---

### 3. Entity Builders

**Purpose**: Create test entities with sensible defaults and fluent API for customization.

#### ClubBuilder

```typescript
import { ClubBuilder } from '../../../__tests__/builders/club.builder';

// Minimal (uses defaults)
const club = new ClubBuilder().build();

// Customized
const club = new ClubBuilder()
  .withId('my-club')
  .withName('Paris Volleyball Club')
  .withOwnerId('owner-1')
  .withDescription('Best club in Paris')
  .build();

// All fields populated
const club = new ClubBuilder().withAllFields().build();

// Reconstituted (for persistence tests)
const club = new ClubBuilder()
  .withTimestamps(createdAt, updatedAt)
  .build();
```

**Default Values**:
- `id`: 'club-1'
- `name`: 'Test Volleyball Club'
- `ownerId`: 'owner-1'
- `description`: null
- `logo`: null
- `location`: null

---

#### SubscriptionBuilder

```typescript
import { SubscriptionBuilder } from '../../../__tests__/builders/subscription.builder';

// STARTER plan (default)
const subscription = new SubscriptionBuilder().build();

// PRO plan preset
const subscription = new SubscriptionBuilder()
  .withProPlan()
  .withClubId('my-club')
  .build();

// BETA plan preset
const subscription = new SubscriptionBuilder()
  .withBetaPlan()
  .build();

// Custom status
const subscription = new SubscriptionBuilder()
  .withStarterPlan()
  .withCanceledStatus()
  .withCancelAtPeriodEnd(true)
  .build();

// Reconstituted
const subscription = new SubscriptionBuilder()
  .withProPlan()
  .withCurrentPeriod(startDate, endDate)
  .withTimestamps(createdAt, updatedAt)
  .build();
```

**Plan Presets**:
- `withBetaPlan()` - Free, unlimited teams, no Stripe
- `withStarterPlan()` - €5/month, 1 team
- `withProPlan()` - €15/month, 5 teams

**Status Methods**:
- `withActiveStatus()`
- `withCanceledStatus()`
- `withInactiveStatus()`
- `withPaymentFailedStatus()`

**Default Values**:
- `id`: 'subscription-1'
- `clubId`: 'club-1'
- `planId`: STARTER
- `maxTeams`: 1
- `price`: 500
- `stripeCustomerId`: 'cus_123'
- `stripeSubscriptionId`: 'sub_123'

---

#### InvitationBuilder

```typescript
import { InvitationBuilder } from '../../../__tests__/builders/invitation.builder';

// PLAYER invitation (default)
const invitation = new InvitationBuilder().build();

// ASSISTANT_COACH invitation
const invitation = new InvitationBuilder()
  .forAssistantCoach()
  .withClubId('my-club')
  .build();

// Expired invitation
const invitation = new InvitationBuilder()
  .forPlayer()
  .expired()
  .build();

// Used invitation
const invitation = new InvitationBuilder()
  .forPlayer()
  .used('user-2')
  .build();

// Custom expiration
const invitation = new InvitationBuilder()
  .withExpiresInDays(14)
  .build();
```

**Type Methods**:
- `forPlayer()` - Player invitation
- `forAssistantCoach()` - Assistant coach invitation

**State Methods**:
- `expired()` - Set past expiration date
- `expiringSoon()` - Expires in 1 hour
- `used(userId)` - Mark as used by user

**Default Values**:
- `id`: 'invitation-1'
- `token`: 'token-123'
- `clubId`: 'club-1'
- `type`: PLAYER
- `createdBy`: 'coach-1'
- `expiresInDays`: 7

---

#### MemberBuilder

```typescript
import { MemberBuilder } from '../../../__tests__/builders/member.builder';

// PLAYER member (default)
const member = new MemberBuilder().build();

// COACH member
const member = new MemberBuilder()
  .asCoach()
  .withUserId('coach-1')
  .build();

// ASSISTANT_COACH member
const member = new MemberBuilder()
  .asAssistantCoach()
  .withClubId('my-club')
  .build();

// Inactive member (has left)
const member = new MemberBuilder()
  .asPlayer()
  .inactive()
  .build();

// Custom join date
const member = new MemberBuilder()
  .withJoinedAt(pastDate)
  .build();
```

**Role Methods**:
- `asCoach()` - Club owner (no inviter)
- `asAssistantCoach()` - Can manage teams
- `asPlayer()` - Regular player

**State Methods**:
- `inactive()` - Mark as left the club
- `withLeftAt(date)` - Custom left date

**Default Values**:
- `id`: 'member-1'
- `userId`: 'user-1'
- `clubId`: 'club-1'
- `role`: PLAYER
- `invitedBy`: 'coach-1'

---

## Complete Test Example

Here's a complete example showing how to use all utilities together:

```typescript
import { TestRepositoryFactory } from '../../../__tests__/factories/repository.factory';
import { TestModuleFactory } from '../../../__tests__/factories/test-module.factory';
import { ClubBuilder } from '../../../__tests__/builders/club.builder';
import { SubscriptionBuilder } from '../../../__tests__/builders/subscription.builder';

describe('MyHandler', () => {
  let handler: MyHandler;
  let clubRepository: jest.Mocked<IClubRepository>;
  let subscriptionRepository: jest.Mocked<ISubscriptionRepository>;

  beforeEach(async () => {
    // Create mock repositories
    clubRepository = TestRepositoryFactory.createMockClubRepository();
    subscriptionRepository = TestRepositoryFactory.createMockSubscriptionRepository();

    // Create test module
    const { handler: h } = await TestModuleFactory.createForHandler(MyHandler, [
      { provide: CLUB_REPOSITORY, useValue: clubRepository },
      { provide: SUBSCRIPTION_REPOSITORY, useValue: subscriptionRepository },
    ]);
    handler = h;
  });

  it('should do something', async () => {
    // Setup test data with builders
    const club = new ClubBuilder()
      .withName('Test Club')
      .build();

    const subscription = new SubscriptionBuilder()
      .withProPlan()
      .build();

    // Mock repository responses
    clubRepository.findById.mockResolvedValue(club);
    subscriptionRepository.findByClubId.mockResolvedValue(subscription);

    // Execute test
    const result = await handler.execute(command);

    // Assertions
    expect(result).toBeDefined();
  });
});
```

---

## Benefits

1. **Less Boilerplate**: ~70% reduction in test setup code
2. **Consistency**: Standardized test data across all tests
3. **Maintainability**: One place to update when interfaces change
4. **Readability**: Tests focus on what's being tested, not setup
5. **Reusability**: Builders can be composed for complex scenarios

---

## Migration Guide

To migrate existing tests:

1. Replace manual mock creation with `TestRepositoryFactory`
2. Replace manual module setup with `TestModuleFactory`
3. Replace entity creation with builders
4. Keep test logic unchanged

**Estimated time**: 5 minutes per test file

---

## Best Practices

1. **Use defaults when possible**: `new ClubBuilder().build()`
2. **Override only what matters**: `.withName('Custom Name')`
3. **Compose builders for related entities**: Club + Subscription + Members
4. **Add new builder methods as needed**: Follow the fluent API pattern
5. **Document new methods**: Add JSDoc comments for clarity
