#!/usr/bin/env node

/**
 * Script pour afficher le planning des issues
 *
 * Usage:
 *   node .github/scripts/show-planning.js
 *   node .github/scripts/show-planning.js --filter=status:in-progress
 *   node .github/scripts/show-planning.js --repo=backend
 */

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const PLANNING_FILE = path.join(__dirname, "../../ISSUES_PLANNING.yaml");

// ANSI colors
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

function color(text, colorCode) {
  return `${colorCode}${text}${colors.reset}`;
}

function readPlanning() {
  if (!fs.existsSync(PLANNING_FILE)) {
    console.error(color("❌ ISSUES_PLANNING.yaml not found!", colors.red));
    console.error(`Expected at: ${PLANNING_FILE}`);
    process.exit(1);
  }

  try {
    const fileContents = fs.readFileSync(PLANNING_FILE, "utf8");
    return yaml.load(fileContents);
  } catch (e) {
    console.error(color("❌ Error parsing ISSUES_PLANNING.yaml:", colors.red));
    console.error(e.message);
    process.exit(1);
  }
}

function getAllIssues(planning) {
  const allIssues = [];

  // Backend issues
  if (planning.backend) {
    planning.backend.forEach((issue) => {
      allIssues.push({ ...issue, repo: "backend" });
    });
  }

  // Frontend issues
  if (planning.frontend) {
    planning.frontend.forEach((issue) => {
      allIssues.push({ ...issue, repo: "frontend" });
    });
  }

  // Shared issues (cross-repo)
  if (planning.shared) {
    planning.shared.forEach((issue) => {
      allIssues.push({
        ...issue,
        repo: "shared",
        backend_issue: issue.backend_issue || {},
        frontend_issue: issue.frontend_issue || {},
      });
    });
  }

  return allIssues;
}

function getStatistics(issues) {
  const stats = {
    total: issues.length,
    byStatus: {},
    byRepo: {},
    byPriority: {},
  };

  issues.forEach((issue) => {
    // Count by status
    const status = issue.status || "unknown";
    stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;

    // Count by repo
    stats.byRepo[issue.repo] = (stats.byRepo[issue.repo] || 0) + 1;

    // Count by priority
    const priority = issue.priority || "unknown";
    stats.byPriority[priority] = (stats.byPriority[priority] || 0) + 1;
  });

  return stats;
}

function displayDashboard(planning, issues, stats) {
  console.log(
    "\n" + color("📊 Issues Planning Dashboard", colors.bright + colors.cyan),
  );
  console.log(color("════════════════════════════════════", colors.cyan));
  console.log("");

  const lastSync = planning.metadata?.last_sync || "Never";
  console.log(`Last sync: ${color(lastSync, colors.dim)}`);
  console.log("");

  console.log(color("📈 Statistics:", colors.bright));
  console.log(`- Total issues: ${color(stats.total, colors.bright)}`);
  console.log(
    `- Planned: ${color(stats.byStatus.planned || 0, colors.yellow)}`,
  );
  console.log(`- Ready: ${color(stats.byStatus.ready || 0, colors.green)}`);
  console.log(
    `- In Progress: ${color(stats.byStatus["in_progress"] || 0, colors.cyan)}`,
  );
  console.log(`- Blocked: ${color(stats.byStatus.blocked || 0, colors.red)}`);
  console.log(
    `- Completed: ${color(stats.byStatus.completed || 0, colors.dim)}`,
  );
  console.log("");

  console.log(
    `🔙 Backend: ${color(stats.byRepo.backend || 0, colors.blue)} issues`,
  );
  console.log(
    `🎨 Frontend: ${color(stats.byRepo.frontend || 0, colors.magenta)} issues`,
  );
  console.log(
    `🔗 Shared: ${color(stats.byRepo.shared || 0, colors.yellow)} issues`,
  );
  console.log("");
}

function displayIssue(issue) {
  const priorityColor =
    {
      critical: colors.red,
      high: colors.yellow,
      medium: colors.cyan,
      low: colors.green,
    }[issue.priority] || colors.white;

  const statusEmoji =
    {
      in_progress: "🔄",
      blocked: "🚫",
      ready: "✅",
      planned: "📝",
      completed: "✓",
    }[issue.status] || "•";

  // For shared issues, show both backend and frontend
  if (issue.repo === "shared") {
    console.log(
      `${statusEmoji} ${color(issue.id, colors.bright)} ${color("🔗", colors.cyan)} ${issue.title}`,
    );
    console.log(`│ Repo: ${color("shared (backend + frontend)", colors.dim)}`);
    console.log(
      `│ Priority: ${color(issue.priority || "N/A", priorityColor)} | Effort: ${color(issue.effort || "N/A", colors.dim)}`,
    );
    console.log(`│ Status: ${color(issue.status, colors.dim)}`);

    // Backend issue
    if (issue.backend_issue && issue.backend_issue.github_issue_number) {
      console.log(
        `│ ${color("Backend", colors.blue)}: ${color(`#${issue.backend_issue.github_issue_number}`, colors.blue)} ${color(issue.backend_issue.github_url || "", colors.dim)}`,
      );
    } else {
      console.log(
        `│ ${color("Backend", colors.blue)}: ${color("Not created", colors.yellow)}`,
      );
    }

    // Frontend issue
    if (issue.frontend_issue && issue.frontend_issue.github_issue_number) {
      console.log(
        `│ ${color("Frontend", colors.magenta)}: ${color(`#${issue.frontend_issue.github_issue_number}`, colors.magenta)} ${color(issue.frontend_issue.github_url || "", colors.dim)}`,
      );
    } else {
      console.log(
        `│ ${color("Frontend", colors.magenta)}: ${color("Not created", colors.yellow)}`,
      );
    }

    console.log(`└─ ${color("cross-repo", colors.dim)}`);
  } else {
    // Regular backend or frontend issue
    console.log(
      `${statusEmoji} ${color(issue.id, colors.bright)} ${issue.title}`,
    );
    console.log(`│ Repo: ${color(issue.repo, colors.dim)}`);
    console.log(
      `│ Priority: ${color(issue.priority || "N/A", priorityColor)} | Effort: ${color(issue.effort || "N/A", colors.dim)}`,
    );
    console.log(`│ Status: ${color(issue.status, colors.dim)}`);

    if (issue.github_issue_number) {
      console.log(
        `│ GitHub: ${color(`#${issue.github_issue_number}`, colors.blue)} ${color(issue.github_url || "", colors.dim)}`,
      );
    } else {
      console.log(`│ GitHub: ${color("Not created", colors.yellow)}`);
    }

    if (issue.blocked_by && issue.blocked_by.length > 0) {
      console.log(
        `│ ${color("⚠️  Blocked by:", colors.red)} ${issue.blocked_by.join(", ")}`,
      );
    }

    const context = issue.bounded_context || issue.feature || "N/A";
    console.log(`└─ ${color(context, colors.dim)}`);
  }

  console.log("");
}

function displayIssuesByStatus(issues, status, title, separator = true) {
  const filtered = issues.filter((i) => i.status === status);

  if (filtered.length === 0) return;

  if (separator) {
    console.log(color("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", colors.dim));
    console.log("");
  }

  console.log(
    color(
      `${title} (${filtered.length} issue${filtered.length > 1 ? "s" : ""})`,
      colors.bright,
    ),
  );
  console.log("");

  filtered.forEach((issue) => displayIssue(issue));
}

function applyFilters(issues, args) {
  let filtered = [...issues];

  // Parse command line arguments
  const filters = {};
  args.forEach((arg) => {
    if (arg.startsWith("--")) {
      const [key, value] = arg.substring(2).split("=");
      filters[key] = value;
    }
  });

  // Filter by status
  if (filters.filter && filters.filter.startsWith("status:")) {
    const status = filters.filter.substring(7);
    filtered = filtered.filter((i) => i.status === status);
  }

  // Filter by repo
  if (filters.repo) {
    filtered = filtered.filter((i) => i.repo === filters.repo);
  }

  // Filter by priority
  if (filters.priority) {
    filtered = filtered.filter((i) => i.priority === filters.priority);
  }

  return filtered;
}

function main() {
  const args = process.argv.slice(2);

  // Read planning
  const planning = readPlanning();
  let issues = getAllIssues(planning);

  // Apply filters
  issues = applyFilters(issues, args);

  // Get statistics
  const stats = getStatistics(issues);

  // Display dashboard
  displayDashboard(planning, issues, stats);

  // Display issues by status (priority order)
  displayIssuesByStatus(issues, "in_progress", "🔄 IN PROGRESS", false);
  displayIssuesByStatus(issues, "blocked", "🚫 BLOCKED");
  displayIssuesByStatus(issues, "ready", "✅ READY");
  displayIssuesByStatus(issues, "planned", "📝 PLANNED");

  // Show tip for planned issues
  const plannedCount = stats.byStatus.planned || 0;
  if (plannedCount > 0) {
    console.log(
      color("💡 Tip:", colors.yellow) +
        " Run " +
        color("/create-issues", colors.bright) +
        " in Claude Code to create these on GitHub",
    );
    console.log("");
  }

  displayIssuesByStatus(issues, "completed", "✓ COMPLETED");

  console.log(color("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", colors.dim));
  console.log("");

  // Show usage examples
  if (args.length === 0) {
    console.log(color("Usage examples:", colors.dim));
    console.log(
      color(
        "  node .github/scripts/show-planning.js --filter=status:in-progress",
        colors.dim,
      ),
    );
    console.log(
      color(
        "  node .github/scripts/show-planning.js --repo=backend",
        colors.dim,
      ),
    );
    console.log(
      color(
        "  node .github/scripts/show-planning.js --priority=high",
        colors.dim,
      ),
    );
    console.log("");
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  readPlanning,
  getAllIssues,
  getStatistics,
};
