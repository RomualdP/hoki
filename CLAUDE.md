# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a full-stack volleyball team management application with:
- **Backend**: NestJS API with PostgreSQL database (Prisma ORM)
- **Frontend**: Next.js 16 with React 19 and Tailwind CSS
- **Database**: PostgreSQL with comprehensive schema for volleyball management

## Directory Structure

```
volley_app/
├── volley-app-backend/    # NestJS API backend (DDD + CQRS architecture)
│   └── src/
│       ├── [bounded-context]/  # DDD Bounded Contexts (club-management, training-management)
│       │   ├── domain/         # Entities, Value Objects, Repository Interfaces
│       │   ├── application/    # Commands, Queries, Handlers, Read Models (CQRS)
│       │   ├── infrastructure/ # Repositories, Mappers, External Services
│       │   └── presentation/   # Controllers
│       └── prisma/             # Database service
└── volley-app-frontend/   # Next.js 16 frontend (Feature-based architecture)
    └── src/
        ├── app/               # ⚠️ ROUTING ONLY - NO BUSINESS COMPONENTS
        │   └── [route]/
        │       └── page.tsx   # Max 50 lines, orchestration only
        ├── features/          # ✅ ALL BUSINESS COMPONENTS GO HERE
        │   └── [feature]/
        │       ├── components/    # Atomic design (Smart/Dumb pattern)
        │       ├── hooks/         # Custom hooks
        │       ├── actions/       # Server Actions
        │       ├── stores/        # Zustand stores
        │       ├── api/           # Server-side API functions (*.server.ts)
        │       └── types/         # TypeScript types
        └── components/        # Shared UI components (shadcn/ui)
```

### ⚠️ CRITICAL ARCHITECTURE RULE

**NEVER create components in `app/` folder!**

```
❌ BAD: app/players/components/PlayerCard.tsx
✅ GOOD: features/players/components/PlayerCard.tsx

❌ BAD: app/teams/[id]/components/TeamDetails.tsx
✅ GOOD: features/teams/components/TeamDetails.tsx
```

**Why?**
- `app/` is for **routing only** (Next.js App Router)
- `features/` is for **business logic and components**
- Keeps clear separation between routing and business concerns
- Enables code reuse across multiple routes

## Development Commands

### Backend (NestJS)
```bash
cd volley-app-backend

yarn start:dev          # Development server with watch mode
yarn build              # Build for production
yarn test               # Run unit tests
yarn test:cov           # Run tests with coverage
npx prisma migrate dev  # Run database migrations
npx prisma studio       # Open database GUI
yarn lint               # Run ESLint
```

### Frontend (Next.js)
```bash
cd volley-app-frontend

yarn dev                # Development server with Turbopack
yarn build              # Build for production
yarn lint               # Run Next.js linting
```

## Architecture Overview

### Backend: DDD + CQRS

The backend follows **Domain-Driven Design** with **bounded contexts** and **CQRS** pattern:

- **Bounded Contexts**: Each major feature is an isolated bounded context (club-management, training-management)
- **Layered Architecture**: Domain → Application → Infrastructure → Presentation
- **CQRS**: Commands (writes) vs Queries (reads) separation
- **Rich Domain Models**: Business logic encapsulated in entities

**📚 For detailed implementation:**
- **DDD Architecture**: See `.claude/skills/ddd-bounded-context/`
- **CQRS Pattern**: See `.claude/skills/cqrs-command-query/`
- **Mappers (Domain ↔ Prisma)**: See `.claude/skills/prisma-mapper/`
- **API Contracts (DTOs, Swagger)**: See `.claude/skills/api-contracts/`
- **Testing Standards**: See `.claude/skills/ddd-testing/`

**Example Bounded Context**: `club-management`
- **Domain**: Club, Subscription, Invitation entities with business logic
- **Application**: create-club, subscribe-to-plan, get-club commands/queries
- **Infrastructure**: ClubRepository, SubscriptionMapper, Stripe integration
- **Presentation**: ClubsController, SubscriptionsController

### Frontend: Feature-Based + Next.js 16

The frontend uses **feature-based architecture** with **Next.js 16 modern patterns**:

- **Feature-Based**: Code organized by business features in `src/features/`
- **Atomic Design**: Components decomposed into atomic units (Smart/Dumb pattern)
- **Server Actions**: Thin orchestration layer calling NestJS backend
- **Modern Next.js**: View Transitions, Parallel Routes, useOptimistic, Suspense, PPR

**📚 For detailed implementation:**
- **Server-First Pattern**: See `.claude/skills/server-components/` (MANDATORY - read first!)
- **API Contracts (Types, Validation)**: See `.claude/skills/api-contracts/`
- **Atomic Components**: See `.claude/skills/atomic-component/`
- **Server Actions**: See `.claude/skills/server-actions/`
- **View Transitions**: See `.claude/skills/view-transitions/`
- **Next.js Patterns**: See `.claude/skills/parallel-routes/`, `.claude/skills/use-optimistic/`, `.claude/skills/suspense-streaming/`
- **State Management**: See `.claude/skills/react-state-management/` (CLIENT state only!)
- **Mobile-First Design**: See `.claude/skills/mobile-first/`

**Example Feature**: `club-management`
- **Components**: ClubCreationForm (smart), ClubInfoStep (dumb)
- **Actions**: createClubAction, subscribeT oPlanAction (Server Actions)
- **Hooks**: useClub, useSubscription
- **Stores**: clubStore (Zustand)

### Technical Stack

**Backend**:
- NestJS, TypeScript, PostgreSQL, Prisma ORM
- Passport.js (Google OAuth, JWT, Local auth)
- Jest (testing), ESLint, Prettier

**Frontend**:
- Next.js 16, React 19, TypeScript
- Zustand (state), Tailwind CSS, shadcn/ui
- Server Actions, View Transitions API

## Core Data Models

- **Users**: Profiles, skills, statistics, achievements
- **Teams**: Members, roles (captain, coach, player, substitute)
- **Matches**: Sets, events, statistics, comments
- **Skills**: Categorized competencies with levels
- **Clubs**: Subscriptions, invitations, members
- **Tournaments**: Registration, matches

## Code Quality Standards

⚠️ **CRITICAL**: This project follows strict development standards via **Skills**.

**Always use the appropriate Skill** when working on:
- **Backend DDD/CQRS**: `.claude/skills/ddd-bounded-context/`, `.claude/skills/cqrs-command-query/`, `.claude/skills/prisma-mapper/`, `.claude/skills/ddd-testing/`
- **Frontend Next.js**: `.claude/skills/atomic-component/`, `.claude/skills/server-actions/`, `.claude/skills/view-transitions/`, `.claude/skills/parallel-routes/`, `.claude/skills/use-optimistic/`, `.claude/skills/suspense-streaming/`, `.claude/skills/react-state-management/`, `.claude/skills/mobile-first/`
- **Testing**: `.claude/skills/ddd-testing/`
- **Debugging**: `.claude/skills/debugger/`, `.claude/skills/bug-finder/`
- **Refactoring**: `.claude/skills/refactoring/`

**Core Principles** (always apply):
- **Clean Code**: Max 30 lines/function, max 5 params, no comments (self-documenting code)
- **Strict Typing**: No `any`, no `unknown`, explicit types
- **Zero Warnings**: NEVER `eslint-disable`, NEVER `@ts-ignore`, FIX the root cause (See `.claude/skills/zero-warnings/`)
- **DRY**: Eliminate duplication
- **Single Responsibility**: One responsibility per file/function
- **TDD**: Tests before implementation (Domain Layer 100% coverage)

## MCP Tools Integration

### Context7 MCP
- **Purpose**: Up-to-date documentation for NestJS, Next.js, React, Prisma, etc.
- **Usage**: Add "use context7" in prompts for official docs
- **When to use**: Working with external libraries, verifying best practices

### Figma MCP
- **Purpose**: Convert Figma designs to code
- **Usage**: Provide Figma URLs for component generation
- **When to use**: Implementing UI from designs, extracting design tokens

## Available Skills

### Backend Skills (Created)
- **ddd-bounded-context**: Complete DDD bounded context generator with layered architecture
- **cqrs-command-query**: CQRS Commands, Queries, Handlers, Read Models generator
- **prisma-mapper**: Domain ↔ Prisma mappers for persistence layer isolation
- **ddd-testing**: Comprehensive testing standards (Domain 100%, Application 95%, Integration)

### Full-Stack Skills (Created)
- **api-contracts**: Frontend ↔ Backend synchronization (DTOs, Types, Validation, Error Handling)

### Code Quality Skills (Created)
- **zero-warnings**: Broken Window philosophy, ESLint/TypeScript error corrections (NEVER disable rules)

### Frontend Skills (Created)
- **server-components**: Server-First pattern with Next.js 16, Server Components by default, data fetching server-side (MANDATORY for all pages and widgets)
- **atomic-component**: Atomic design pattern, Server/Client components separation, maximum decomposition (Pages max 50 lines, Smart components max 100 lines, Dumb components max 80 lines)
- **server-actions**: Next.js Server Actions as thin orchestration layer, revalidatePath for cache management, Zod validation
- **view-transitions**: View Transitions API for smooth page transitions (MANDATORY for all navigations)
- **parallel-routes**: Parallel Routes (@modal slot) for modals without layout shifts (MANDATORY for modals)
- **use-optimistic**: useOptimistic hook with Server Component + revalidatePath for automatic rollback (MANDATORY for deletes)
- **suspense-streaming**: Suspense & Streaming for progressive rendering (MANDATORY for async Server Components)
- **react-state-management**: Zustand stores for CLIENT state only, custom hooks, useEffect cleanup patterns (MANDATORY cleanup for all useEffect). CRITICAL: useEffect NOT for initial data fetch.
- **mobile-first**: Mobile-first design principles with Tailwind breakpoints (MANDATORY for all pages)

### Methodology Skills (Created)
- **bug-finder**: 6-step systematic bug finding methodology (Résumé → Flow → Examiner → Top 3 Causes → Confirmation → Plan de vérification)
- **debugger**: 10-step systematic debugging process (Define → Reproduce → Formulate → Prioritize → Log → Binary Search → Test → Fix → Verify → Protect)
- **refactoring**: TDD/BDD refactoring best practices (RED → GREEN → REFACTOR, Given-When-Then pattern for frontend tests)

## Git Commit Guidelines

- **DO NOT** add Claude Code signature to commits
- **DO NOT** add "Co-Authored-By: Claude" to commit messages
- Keep commit messages clean and professional
- Use conventional commits format: `type(scope): description`

## Important Notes

- Backend uses French documentation but English code
- Database migrations managed through Prisma
- Frontend uses custom fonts including Anime Ace
- Authentication supports multiple providers (Google OAuth, JWT, Local)
- Role-based access control implemented throughout
- The application supports both individual and team-based volleyball activities

---

**For detailed implementation guidance, always consult the appropriate Skill in `.claude/skills/`**
