#!/usr/bin/env node

/**
 * Script de synchronisation des labels GitHub
 *
 * Usage:
 *   node .github/scripts/sync-labels.js
 *
 * Prérequis:
 *   - GitHub CLI installé (gh)
 *   - Authentifié avec gh auth login
 */

const { execSync } = require("child_process");

const repos = {
  backend: "RomualdP/volley_app_back",
  frontend: "RomualdP/volley_app_front",
};

// Labels communs aux deux repos
const commonLabels = [
  // Type
  { name: "feature", description: "New feature", color: "0E8A16" },
  { name: "bug", description: "Something isn't working", color: "D73A4A" },
  {
    name: "enhancement",
    description: "Improvement to existing feature",
    color: "A2EEEF",
  },
  { name: "refactoring", description: "Code refactoring", color: "FEF2C0" },
  {
    name: "documentation",
    description: "Documentation improvements",
    color: "0075CA",
  },
  { name: "testing", description: "Testing improvements", color: "BFD4F2" },
  { name: "security", description: "Security-related", color: "EE0701" },
  {
    name: "performance",
    description: "Performance optimization",
    color: "FBCA04",
  },
  {
    name: "technical-debt",
    description: "Technical debt to address",
    color: "D93F0B",
  },

  // Priority
  {
    name: "priority:critical",
    description: "Critical priority",
    color: "B60205",
  },
  { name: "priority:high", description: "High priority", color: "D93F0B" },
  { name: "priority:medium", description: "Medium priority", color: "FBCA04" },
  { name: "priority:low", description: "Low priority", color: "0E8A16" },

  // Status
  {
    name: "status:planned",
    description: "Planned for future sprint",
    color: "C5DEF5",
  },
  {
    name: "status:in-progress",
    description: "Currently being worked on",
    color: "FEF2C0",
  },
  {
    name: "status:blocked",
    description: "Blocked by dependencies",
    color: "D93F0B",
  },
  {
    name: "status:review",
    description: "Awaiting code review",
    color: "FBCA04",
  },
  {
    name: "status:ready",
    description: "Ready for development",
    color: "0E8A16",
  },

  // Effort
  {
    name: "effort:small",
    description: "Small effort (1-2 hours)",
    color: "C2E0C6",
  },
  {
    name: "effort:medium",
    description: "Medium effort (3-6 hours)",
    color: "FEF2C0",
  },
  {
    name: "effort:large",
    description: "Large effort (1-2 days)",
    color: "FBCA04",
  },
  {
    name: "effort:extra-large",
    description: "Extra large effort (3+ days)",
    color: "D93F0B",
  },

  // Milestone
  { name: "milestone:mvp", description: "MVP v1.0", color: "5319E7" },
  { name: "milestone:v1.1", description: "Version 1.1", color: "5319E7" },
  { name: "milestone:v2.0", description: "Version 2.0", color: "5319E7" },

  // Cross-repo
  {
    name: "api-contracts",
    description: "API contracts sync (DTOs, Types)",
    color: "FBCA04",
  },
  { name: "breaking-change", description: "Breaking change", color: "D73A4A" },
  {
    name: "dependencies",
    description: "Dependencies between repos",
    color: "C5DEF5",
  },
  {
    name: "question",
    description: "Further information requested",
    color: "D876E3",
  },
  { name: "wontfix", description: "Won't be fixed", color: "FFFFFF" },
  { name: "duplicate", description: "Duplicate issue", color: "CFD3D7" },
  {
    name: "good-first-issue",
    description: "Good for newcomers",
    color: "7057FF",
  },
  {
    name: "help-wanted",
    description: "Extra attention needed",
    color: "008672",
  },
];

// Labels backend spécifiques
const backendLabels = [
  // Architecture DDD
  { name: "ddd", description: "DDD Architecture", color: "0052CC" },
  { name: "cqrs", description: "CQRS Pattern", color: "0052CC" },
  {
    name: "bounded-context",
    description: "Bounded Context related",
    color: "006B75",
  },

  // Bounded Contexts
  {
    name: "bounded-context:club-management",
    description: "Club Management context",
    color: "006B75",
  },
  {
    name: "bounded-context:training-management",
    description: "Training Management context",
    color: "006B75",
  },
  {
    name: "bounded-context:match-management",
    description: "Match Management context",
    color: "006B75",
  },
  {
    name: "bounded-context:tournament-management",
    description: "Tournament Management context",
    color: "006B75",
  },
  {
    name: "bounded-context:user-management",
    description: "User Management context",
    color: "006B75",
  },
  {
    name: "bounded-context:shared",
    description: "Shared context",
    color: "006B75",
  },

  // Layers
  {
    name: "layer:domain",
    description: "Domain Layer (Entities, VOs)",
    color: "5319E7",
  },
  {
    name: "layer:application",
    description: "Application Layer (Commands, Queries)",
    color: "5319E7",
  },
  {
    name: "layer:infrastructure",
    description: "Infrastructure Layer (Repos, Mappers)",
    color: "5319E7",
  },
  {
    name: "layer:presentation",
    description: "Presentation Layer (Controllers, DTOs)",
    color: "5319E7",
  },

  // Technical Backend
  { name: "database", description: "Database related", color: "1D76DB" },
  { name: "prisma", description: "Prisma ORM", color: "1D76DB" },
  { name: "api", description: "API endpoints", color: "0075CA" },
  { name: "swagger", description: "Swagger documentation", color: "0075CA" },
  {
    name: "auth",
    description: "Authentication/Authorization",
    color: "EE0701",
  },
  { name: "validation", description: "Validation logic", color: "BFD4F2" },
];

// Labels frontend spécifiques
const frontendLabels = [
  // Next.js Patterns
  { name: "nextjs", description: "Next.js 16 patterns", color: "000000" },
  {
    name: "server-components",
    description: "Server Components",
    color: "000000",
  },
  { name: "server-actions", description: "Server Actions", color: "000000" },
  {
    name: "view-transitions",
    description: "View Transitions API",
    color: "5319E7",
  },
  { name: "parallel-routes", description: "Parallel Routes", color: "5319E7" },
  { name: "suspense", description: "Suspense & Streaming", color: "0052CC" },
  {
    name: "use-optimistic",
    description: "useOptimistic hook",
    color: "0052CC",
  },

  // Feature Modules
  {
    name: "feature:club-management",
    description: "Club Management feature",
    color: "006B75",
  },
  {
    name: "feature:training-management",
    description: "Training Management feature",
    color: "006B75",
  },
  {
    name: "feature:match-management",
    description: "Match Management feature",
    color: "006B75",
  },
  {
    name: "feature:tournament-management",
    description: "Tournament Management feature",
    color: "006B75",
  },
  { name: "feature:players", description: "Players feature", color: "006B75" },
  { name: "feature:teams", description: "Teams feature", color: "006B75" },
  {
    name: "feature:profile",
    description: "User Profile feature",
    color: "006B75",
  },
  {
    name: "feature:shared",
    description: "Shared components/utilities",
    color: "006B75",
  },

  // UI/UX
  { name: "ui", description: "UI Components", color: "D4C5F9" },
  { name: "ux", description: "User Experience", color: "D4C5F9" },
  { name: "mobile-first", description: "Mobile-first design", color: "F9D0C4" },
  { name: "responsive", description: "Responsive design", color: "F9D0C4" },
  { name: "a11y", description: "Accessibility", color: "EE0701" },
  {
    name: "design-system",
    description: "Design system / shadcn/ui",
    color: "D4C5F9",
  },

  // State Management
  { name: "zustand", description: "Zustand state management", color: "0052CC" },
  {
    name: "state-management",
    description: "State management related",
    color: "0052CC",
  },
];

function createLabels(repo, labels, labelType = "common") {
  console.log(`\n📦 Creating ${labelType} labels for ${repo}...`);

  let successCount = 0;
  let errorCount = 0;

  labels.forEach((label) => {
    try {
      execSync(
        `gh label create "${label.name}" --repo "${repo}" --description "${label.description}" --color "${label.color}" --force`,
        { stdio: "pipe" },
      );
      console.log(`  ✅ ${label.name}`);
      successCount++;
    } catch (error) {
      console.error(`  ❌ ${label.name} - ${error.message}`);
      errorCount++;
    }
  });

  console.log(`\n  Summary: ${successCount} succeeded, ${errorCount} failed`);
}

function main() {
  console.log("🏷️  GitHub Labels Synchronization");
  console.log("==================================\n");

  // Check if gh CLI is available
  try {
    execSync("gh --version", { stdio: "pipe" });
  } catch (error) {
    console.error("❌ GitHub CLI (gh) not found. Please install it first:");
    console.error("   https://cli.github.com/");
    process.exit(1);
  }

  // Check if authenticated
  try {
    execSync("gh auth status", { stdio: "pipe" });
  } catch (error) {
    console.error("❌ Not authenticated with GitHub CLI. Run:");
    console.error("   gh auth login");
    process.exit(1);
  }

  console.log("✓ GitHub CLI authenticated\n");

  // Sync labels
  try {
    // Backend
    console.log("🔙 BACKEND REPO");
    createLabels(repos.backend, commonLabels, "common");
    createLabels(repos.backend, backendLabels, "backend-specific");

    // Frontend
    console.log("\n\n🎨 FRONTEND REPO");
    createLabels(repos.frontend, commonLabels, "common");
    createLabels(repos.frontend, frontendLabels, "frontend-specific");

    console.log("\n\n✅ Labels synchronization completed!");
    console.log("\n📋 Next steps:");
    console.log("   1. Verify labels at:");
    console.log(`      - https://github.com/${repos.backend}/labels`);
    console.log(`      - https://github.com/${repos.frontend}/labels`);
    console.log("   2. Start using them in your issues!");
  } catch (error) {
    console.error("\n❌ Error during synchronization:", error.message);
    process.exit(1);
  }
}

// Run
if (require.main === module) {
  main();
}

module.exports = { commonLabels, backendLabels, frontendLabels, repos };
