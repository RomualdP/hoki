import * as dotenv from 'dotenv';
import * as path from 'path';

/**
 * Setup environment variables for tests
 *
 * This file is automatically loaded by Jest before running tests.
 * It loads the appropriate .env file based on the environment:
 * - In CI (GitHub Actions): Uses environment variables set in the workflow
 * - In local development: Loads .env.test
 */

const isCI = process.env.CI === 'true';

if (!isCI) {
  // Load .env.test for local testing
  const envPath = path.resolve(__dirname, '..', '.env.test');
  const result = dotenv.config({ path: envPath });

  if (result.error) {
    console.warn(
      `Warning: Could not load .env.test file from ${envPath}. ` +
        'Tests may fail if DATABASE_URL is not set.',
    );
  } else {
    console.log('✓ Loaded .env.test for local testing');
  }
} else {
  console.log('✓ Running in CI - using environment variables from workflow');
}
