#!/usr/bin/env node

/**
 * Script pour synchroniser les issues avec GitHub Projects v2
 *
 * Usage:
 *   node .github/scripts/sync-project.js
 *   node .github/scripts/sync-project.js --project-url=https://github.com/users/RomualdP/projects/4
 *   node .github/scripts/sync-project.js --add-issue=RomualdP/volley_app_back#45
 *
 * Prérequis:
 *   - GitHub CLI installé (gh)
 *   - Authentifié avec gh auth login
 *   - Token avec scope 'project'
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const PLANNING_FILE = path.join(__dirname, "../../ISSUES_PLANNING.yaml");
const DEFAULT_PROJECT_URL = "https://github.com/users/RomualdP/projects/4";

// ANSI colors
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
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

function extractProjectNumber(projectUrl) {
  // Extract project number from URL like:
  // https://github.com/users/RomualdP/projects/4
  // or https://github.com/orgs/MyOrg/projects/5
  const match = projectUrl.match(/projects\/(\d+)/);
  if (match) {
    return parseInt(match[1]);
  }
  return null;
}

function getProjectId(projectUrl, owner) {
  console.log(color("📋 Fetching project ID...", colors.blue));

  const projectNumber = extractProjectNumber(projectUrl);
  if (!projectNumber) {
    console.error(color(`❌ Invalid project URL: ${projectUrl}`, colors.red));
    process.exit(1);
  }

  // GraphQL query to get project ID
  const query = `query {
    user(login: "${owner}") {
      projectV2(number: ${projectNumber}) {
        id
        title
      }
    }
  }`;

  try {
    const result = execSync(`gh api graphql -f query='${query}'`, {
      stdio: "pipe",
    });
    const data = JSON.parse(result.toString());

    if (data.data && data.data.user && data.data.user.projectV2) {
      const project = data.data.user.projectV2;
      console.log(
        `  ${color("✓", colors.green)} Project: ${color(project.title, colors.bright)}`,
      );
      console.log(`  ${color("✓", colors.green)} ID: ${project.id}`);
      return project.id;
    } else {
      console.error(
        color("❌ Project not found. Check URL and permissions.", colors.red),
      );
      process.exit(1);
    }
  } catch (error) {
    console.error(
      color(`❌ Failed to get project ID: ${error.message}`, colors.red),
    );
    process.exit(1);
  }
}

function getIssueNodeId(repo, issueNumber) {
  try {
    const [owner, repoName] = repo.split("/");
    const query = `query {
      repository(owner: "${owner}", name: "${repoName}") {
        issue(number: ${issueNumber}) {
          id
          title
        }
      }
    }`;

    const result = execSync(`gh api graphql -f query='${query}'`, {
      stdio: "pipe",
    });
    const data = JSON.parse(result.toString());

    if (data.data && data.data.repository && data.data.repository.issue) {
      return {
        id: data.data.repository.issue.id,
        title: data.data.repository.issue.title,
      };
    }
  } catch (error) {
    console.error(
      color(
        `❌ Failed to get node ID for ${repo}#${issueNumber}: ${error.message}`,
        colors.red,
      ),
    );
  }
  return null;
}

function addIssueToProject(projectId, issueNodeId, issueTitle, repo, number) {
  console.log(
    `  ${color("➕", colors.yellow)} Adding ${repo}#${number}: ${issueTitle}`,
  );

  const mutation = `mutation {
    addProjectV2ItemById(input: {
      projectId: "${projectId}"
      contentId: "${issueNodeId}"
    }) {
      item {
        id
      }
    }
  }`;

  try {
    execSync(`gh api graphql -f query='${mutation}'`, { stdio: "pipe" });
    console.log(`     ${color("✓", colors.green)} Added successfully`);
    return true;
  } catch (error) {
    // Check if error is "already exists"
    if (error.message.includes("already exists")) {
      console.log(
        `     ${color("○", colors.yellow)} Already in project (skipped)`,
      );
      return true;
    }
    console.error(`     ${color("✗", colors.red)} Failed: ${error.message}`);
    return false;
  }
}

function getAllIssues(planning) {
  const allIssues = [];
  const repo = planning.metadata.repo;

  // Backend issues
  if (planning.backend) {
    planning.backend.forEach((issue) => {
      if (issue.github_issue_number) {
        allIssues.push({
          repo: repo,
          number: issue.github_issue_number,
          id: issue.id,
          title: issue.title,
        });
      }
    });
  }

  // Frontend issues
  if (planning.frontend) {
    planning.frontend.forEach((issue) => {
      if (issue.github_issue_number) {
        allIssues.push({
          repo: repo,
          number: issue.github_issue_number,
          id: issue.id,
          title: issue.title,
        });
      }
    });
  }

  // Shared issues (backend + frontend)
  if (planning.shared) {
    planning.shared.forEach((issue) => {
      if (issue.backend_issue && issue.backend_issue.github_issue_number) {
        allIssues.push({
          repo: repo,
          number: issue.backend_issue.github_issue_number,
          id: `${issue.id}-backend`,
          title: issue.backend_issue.title,
        });
      }
      if (issue.frontend_issue && issue.frontend_issue.github_issue_number) {
        allIssues.push({
          repo: repo,
          number: issue.frontend_issue.github_issue_number,
          id: `${issue.id}-frontend`,
          title: issue.frontend_issue.title,
        });
      }
    });
  }

  return allIssues;
}

function syncAllIssues(projectUrl, owner) {
  console.log(
    "\n" + color("📊 GitHub Project Sync", colors.bright + colors.cyan),
  );
  console.log(color("═════════════════════", colors.cyan));
  console.log("");

  // Read planning
  const planning = readPlanning();

  // Get project ID
  const projectId = getProjectId(projectUrl, owner);
  console.log("");

  // Get all issues
  const issues = getAllIssues(planning);

  if (issues.length === 0) {
    console.log(
      color(
        "⚠️  No issues with GitHub issue numbers found in planning.",
        colors.yellow,
      ),
    );
    console.log("   Create issues first with /create-issues");
    return;
  }

  console.log(color(`📝 Found ${issues.length} issue(s) to sync`, colors.blue));
  console.log("");

  // Add issues to project
  let added = 0;
  let skipped = 0;
  let failed = 0;

  issues.forEach((issue) => {
    const issueData = getIssueNodeId(issue.repo, issue.number);
    if (issueData) {
      const success = addIssueToProject(
        projectId,
        issueData.id,
        issueData.title,
        issue.repo,
        issue.number,
      );
      if (success) {
        if (
          issueData.title.includes("already exists") ||
          issueData.title.includes("skipped")
        ) {
          skipped++;
        } else {
          added++;
        }
      } else {
        failed++;
      }
    } else {
      console.log(
        `  ${color("✗", colors.red)} ${issue.repo}#${issue.number}: Not found`,
      );
      failed++;
    }
  });

  console.log("");
  console.log(color("═════════════════════", colors.cyan));
  console.log("");

  // Summary
  console.log(color("📈 Summary:", colors.bright));
  console.log(`  ${color("✓", colors.green)} Added: ${added}`);
  console.log(
    `  ${color("○", colors.yellow)} Skipped (already exists): ${skipped}`,
  );
  console.log(`  ${color("✗", colors.red)} Failed: ${failed}`);
  console.log("");

  console.log(color("🌐 Project URL:", colors.bright));
  console.log(`  ${projectUrl}`);
  console.log("");
}

function main() {
  const args = process.argv.slice(2);

  // Check if gh CLI is available
  try {
    execSync("gh --version", { stdio: "pipe" });
  } catch (error) {
    console.error(
      color(
        "❌ GitHub CLI (gh) not found. Please install it first:",
        colors.red,
      ),
    );
    console.error("   https://cli.github.com/");
    process.exit(1);
  }

  // Check if authenticated
  try {
    execSync("gh auth status", { stdio: "pipe" });
  } catch (error) {
    console.error(
      color("❌ Not authenticated with GitHub CLI. Run:", colors.red),
    );
    console.error("   gh auth login");
    process.exit(1);
  }

  // Parse arguments
  let projectUrl = DEFAULT_PROJECT_URL;
  args.forEach((arg) => {
    if (arg.startsWith("--project-url=")) {
      projectUrl = arg.substring(14);
    }
  });

  // Extract owner from URL
  const ownerMatch = projectUrl.match(/users\/([^/]+)/);
  const owner = ownerMatch ? ownerMatch[1] : "RomualdP";

  // Sync all issues
  syncAllIssues(projectUrl, owner);
}

if (require.main === module) {
  main();
}

module.exports = {
  syncAllIssues,
  getProjectId,
  addIssueToProject,
  getAllIssues,
};
