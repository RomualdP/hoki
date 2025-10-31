# AGENTS.md

This file provides guidance to AI agents (including opencode) when working with code in this repository.

## Project Structure

This is a full-stack volleyball team management application (mono-repo) with:
- **Project Name**: Hoki
- **Repository**: https://github.com/RomualdP/hoki.git
- **Backend**: NestJS API with PostgreSQL database (Prisma ORM)
- **Frontend**: Next.js 16 with React 19 and Tailwind CSS
- **Database**: PostgreSQL with comprehensive schema for volleyball management
- **Structure**: Mono-repo (Option A - Simple structure)

**Note**: This is a mono-repo structure. Both backend and frontend are in separate directories within the same repository. This allows for:
- Full-stack features in a single branch/PR
- Git worktrees for multiple agents
- Unified versioning and documentation

## Directory Structure

```
volley_app/
├── volley-app-backend/    # NestJS API backend
│   ├── src/
│   │   ├── auth/          # Authentication (Google OAuth, JWT, Local)
│   │   ├── users/         # User management and profiles
│   │   ├── teams/         # Team management
│   │   ├── matches/       # Match management and statistics
│   │   ├── skills/        # Skills and competencies
│   │   ├── news/          # News and content management
│   │   ├── activities/    # Activity feed
│   │   ├── notifications/ # Notification system
│   │   ├── tournaments/   # Tournament management
│   │   └── prisma/        # Database service
│   ├── prisma/           # Database schema and migrations
│   └── test/             # E2E tests
└── volley-app-frontend/   # Next.js frontend
    ├── src/
    │   ├── app/           # App router pages
    │   ├── components/    # Reusable UI components
    │   ├── features/      # Feature-specific components and hooks
    │   ├── store/         # Zustand state management
    │   └── types/         # TypeScript type definitions
    └── public/           # Static assets
```

## Development Commands

### Root Level (Mono-repo scripts)
```bash
# From the root directory
yarn dev:front          # Start frontend development server
yarn dev:back           # Start backend development server
yarn build:front        # Build frontend for production
yarn build:back         # Build backend for production
yarn lint:front         # Lint frontend code
yarn lint:back          # Lint backend code
yarn test:back          # Run backend tests
```

### Backend (NestJS)
```bash
cd volley-app-backend

# Development
yarn install
yarn start:dev          # Start development server with watch mode
yarn start:debug        # Start with debug mode

# Building & Production
yarn build              # Build for production
yarn start:prod         # Start production server

# Database
npx prisma generate     # Generate Prisma client
npx prisma migrate dev  # Run database migrations
npx prisma studio       # Open database GUI

# Testing
yarn test               # Run unit tests
yarn test:watch         # Run tests in watch mode
yarn test:cov           # Run tests with coverage
yarn test:e2e           # Run E2E tests

# Code Quality
yarn lint               # Run ESLint
yarn format             # Format code with Prettier
```

### Frontend (Next.js)
```bash
cd volley-app-frontend

# Development
yarn install
yarn dev                # Start development server with Turbopack

# Building & Production
yarn build              # Build for production
yarn start              # Start production server

# Code Quality
yarn lint               # Run Next.js linting
```

## Architecture Overview

### Backend Architecture
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Multiple strategies (Local, JWT, Google OAuth)
- **Guards**: JwtAuthGuard protects routes
- **Roles**: USER, ADMIN with role-based access
- **Interceptors**: Global response formatting
- **Filters**: Global exception handling

### Core Data Models
- **Users**: Complete profiles with skills, statistics, achievements
- **Teams**: With member roles (CAPTAIN, COACH, PLAYER, SUBSTITUTE)
- **Matches**: Full match management with sets, events, statistics
- **Skills**: Categorized competencies with skill levels
- **News**: Content management with media gallery
- **Activities**: Activity feed system
- **Notifications**: Multi-channel notification system
- **Tournaments**: Tournament management with team registration

### Frontend Architecture
- **Framework**: Next.js 16 with App Router
- **State Management**: Zustand for global state
- **Styling**: Tailwind CSS with custom fonts
- **Components**: Organized by features with shared UI components
- **API Integration**: Custom hooks for API calls
- **Authentication**: AuthProvider with JWT tokens

## Mono-Repo Structure

This project uses a simple mono-repo structure (Option A):
- **No workspaces**: Each package manages its own dependencies independently
- **Shared scripts**: Root `package.json` provides convenience scripts
- **Unified CI/CD**: GitHub Actions workflows with path filters trigger only relevant builds
- **Git history**: Complete history preserved from both original repositories

### Deployment
- **Backend (Railway)**: Configured with Root Directory `volley-app-backend`
- **Frontend (Vercel)**: Configured with Root Directory `volley-app-frontend`
- **CI/CD**: Separate workflows for backend and frontend, triggered by path changes

## Key Features

### Authentication System
- Google OAuth integration
- Local username/password authentication
- JWT token-based session management
- Role-based access control

### Match Management
- Complete match lifecycle (scheduled → in progress → completed)
- Real-time match events (points, aces, blocks, errors)
- Set-by-set scoring
- Player statistics tracking
- Match comments and discussions
- Weather conditions and court information

### Team Management
- Team creation and member management
- Role assignments (captain, coach, player, substitute)
- Team statistics and match history

### User Profiles
- Complete player profiles with physical stats
- Skills assessment by categories (attack, defense, serving, etc.)
- Achievement system
- Performance statistics

### News & Content
- News articles with rich media support
- Comment system with threading
- Like and view tracking
- Category-based organization

## Database Schema Notes

The Prisma schema includes comprehensive models for:
- User authentication and profiles
- Team and match management
- Skills and achievements
- News and content
- Activities and notifications
- Tournament system
- Privacy and notification settings

## Testing

### Backend Testing
- Unit tests using Jest
- E2E tests with Supertest
- Test configuration in `jest-e2e.json`
- Coverage reports generated in `coverage/`

### Frontend Testing
- Next.js built-in testing with ESLint
- Component testing setup ready for implementation

## Key Dependencies

### Backend
- NestJS framework and modules
- Prisma ORM with PostgreSQL
- Passport.js for authentication
- JWT for tokens
- bcrypt for password hashing
- TypeScript and ESLint for code quality

### Frontend
- Next.js 15 with App Router
- React 19
- Zustand for state management
- Tailwind CSS for styling
- TypeScript for type safety

## Code Quality and Development Rules

⚠️ **CRITICAL**: This project follows strict development rules defined in `Skills (`.claude/skills/`)`. These rules must be systematically applied when working on this codebase.

**Before making any code changes, always:**
1. Read and follow the rules in `Skills (`.claude/skills/`)`
2. Apply context-specific rules based on file type and location
3. Ensure all "Always Apply" rules are followed
4. Reference the appropriate testing, refactoring, and debugging methodologies

Key rule categories:
- **Architecture**: Clean Architecture (backend), Feature-Based Architecture (frontend)
- **Code Quality**: Clean code principles, strict typing, naming conventions
- **Testing**: Comprehensive testing standards for unit, integration, and frontend tests
- **Workflows**: Bug finding methodology, debugging process, refactoring best practices

## Agent-Specific Guidelines

### When Working with This Project
- **NEVER commit changes** unless explicitly asked by the user
- **ALWAYS run lint and typecheck commands** after code changes (yarn lint, yarn format, etc.)
- **Use the Task tool** for complex multi-step tasks requiring research or extensive searching
- **Batch tool calls** when multiple independent pieces of information are needed
- **Follow existing code conventions** - mimic style, use existing libraries, follow patterns
- **Check package.json** before using any library to ensure it's already in the project
- **Use absolute paths** for all file operations
- **Be concise** in responses - keep under 4 lines unless detail is requested

### Security Best Practices
- Never introduce code that exposes or logs secrets/keys
- Never commit secrets or keys to repository
- Always follow authentication and authorization patterns
- Use role-based access control appropriately

### File Organization
- Backend: Follow NestJS module structure
- Frontend: Use feature-based organization in `/features`
- Keep shared components in `/components`
- Use TypeScript types from `/types`

## Important Notes

- The backend uses French language documentation but English code
- Database migrations are managed through Prisma
- The frontend uses custom fonts including Anime Ace
- Global interceptors handle response formatting
- Authentication supports multiple providers
- Role-based access control is implemented throughout
- The application supports both individual and team-based volleyball activities

## Agent Commands Reference

When the user asks you to perform tasks, remember:
- Use `yarn lint` and `yarn format` after code changes
- Use `npx prisma generate` after schema changes
- Use `yarn test` to run tests
- Use `yarn build` before production deployment
- Document any new commands you discover in this file for future reference