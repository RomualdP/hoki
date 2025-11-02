#!/usr/bin/env node

/**
 * Script pour lier des issues backend ↔ frontend dans le monorepo
 *
 * Usage:
 *   node .github/scripts/link-issues.js --backend=45 --frontend=19
 *   node .github/scripts/link-issues.js --repo=RomualdP/hoki --backend=45 --frontend=19
 *
 * Prérequis:
 *   - GitHub CLI installé (gh)
 *   - Authentifié avec gh auth login
 */

const { execSync } = require("child_process");

const DEFAULT_REPO = "RomualdP/hoki";

// ANSI colors
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function color(text, colorCode) {
  return `${colorCode}${text}${colors.reset}`;
}

function parseArgs(args) {
  const parsed = {
    repo: DEFAULT_REPO,
    backendIssue: null,
    frontendIssue: null,
  };

  args.forEach((arg) => {
    if (arg.startsWith("--repo=")) {
      parsed.repo = arg.substring(7);
    } else if (arg.startsWith("--backend=")) {
      parsed.backendIssue = parseInt(arg.substring(10));
    } else if (arg.startsWith("--frontend=")) {
      parsed.frontendIssue = parseInt(arg.substring(11));
    }
  });

  return parsed;
}

function getIssueUrl(repo, issueNumber) {
  try {
    const result = execSync(
      `gh issue view ${issueNumber} --repo ${repo} --json url`,
      { stdio: "pipe" },
    );
    const data = JSON.parse(result.toString());
    return data.url;
  } catch (error) {
    console.error(
      color(
        `❌ Failed to get URL for ${repo}#${issueNumber}: ${error.message}`,
        colors.red,
      ),
    );
    return null;
  }
}

function getIssueTitle(repo, issueNumber) {
  try {
    const result = execSync(
      `gh issue view ${issueNumber} --repo ${repo} --json title`,
      { stdio: "pipe" },
    );
    const data = JSON.parse(result.toString());
    return data.title;
  } catch (error) {
    console.error(
      color(
        `❌ Failed to get title for ${repo}#${issueNumber}: ${error.message}`,
        colors.red,
      ),
    );
    return null;
  }
}

function addComment(repo, issueNumber, comment) {
  try {
    execSync(
      `gh issue comment ${issueNumber} --repo ${repo} --body "${comment}"`,
      { stdio: "pipe" },
    );
    return true;
  } catch (error) {
    console.error(
      color(
        `❌ Failed to add comment to ${repo}#${issueNumber}: ${error.message}`,
        colors.red,
      ),
    );
    return false;
  }
}

function linkIssues(repo, backendIssue, frontendIssue) {
  console.log("\n" + color("🔗 Linking Issues", colors.bright + colors.cyan));
  console.log(color("═══════════════════", colors.cyan));
  console.log("");

  // Get issue details
  console.log(color("📝 Fetching issue details...", colors.blue));

  const backendUrl = getIssueUrl(repo, backendIssue);
  const backendTitle = getIssueTitle(repo, backendIssue);
  const frontendUrl = getIssueUrl(repo, frontendIssue);
  const frontendTitle = getIssueTitle(repo, frontendIssue);

  if (!backendUrl || !backendTitle || !frontendUrl || !frontendTitle) {
    console.error(
      color("\n❌ Failed to fetch issue details. Aborting.", colors.red),
    );
    process.exit(1);
  }

  console.log(`  Backend: ${color(backendTitle, colors.bright)}`);
  console.log(`  Frontend: ${color(frontendTitle, colors.bright)}`);
  console.log("");

  // Create link comments
  const backendComment = `🔗 **Related Frontend Issue**

This backend issue is linked to the following frontend issue:
- **Frontend**: #${frontendIssue}
- **URL**: ${frontendUrl}
- **Title**: ${frontendTitle}

Both issues should be implemented together to maintain consistency between backend and frontend.`;

  const frontendComment = `🔗 **Related Backend Issue**

This frontend issue is linked to the following backend issue:
- **Backend**: #${backendIssue}
- **URL**: ${backendUrl}
- **Title**: ${backendTitle}

Both issues should be implemented together to maintain consistency between backend and frontend.`;

  // Add comments
  console.log(color("💬 Adding link comments...", colors.blue));

  const backendSuccess = addComment(repo, backendIssue, backendComment);
  const frontendSuccess = addComment(repo, frontendIssue, frontendComment);

  console.log("");

  if (backendSuccess && frontendSuccess) {
    console.log(color("✅ Issues successfully linked!", colors.green));
    console.log("");
    console.log(color("📋 Summary:", colors.bright));
    console.log(`  Backend:  ${color(`${repo}#${backendIssue}`, colors.blue)}`);
    console.log(
      `  Frontend: ${color(`${repo}#${frontendIssue}`, colors.blue)}`,
    );
    console.log("");
    console.log(color("🌐 URLs:", colors.bright));
    console.log(`  Backend:  ${backendUrl}`);
    console.log(`  Frontend: ${frontendUrl}`);
    console.log("");
    return true;
  } else {
    console.error(
      color("❌ Failed to link issues. Check errors above.", colors.red),
    );
    process.exit(1);
  }
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
  const parsed = parseArgs(args);

  if (!parsed.backendIssue || !parsed.frontendIssue) {
    console.error(color("❌ Missing required arguments", colors.red));
    console.error("");
    console.error(color("Usage:", colors.bright));
    console.error(
      "  node .github/scripts/link-issues.js --backend=45 --frontend=19",
    );
    console.error("");
    console.error(color("Optional arguments:", colors.bright));
    console.error(`  --repo=REPO   (default: ${DEFAULT_REPO})`);
    console.error("");
    process.exit(1);
  }

  // Link issues
  linkIssues(parsed.repo, parsed.backendIssue, parsed.frontendIssue);
}

if (require.main === module) {
  main();
}

module.exports = {
  linkIssues,
  getIssueUrl,
  getIssueTitle,
  addComment,
};
