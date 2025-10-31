import { config } from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

const isCI = process.env.CI === 'true';

if (!isCI) {
  const envPath = path.resolve(__dirname, '..', '.env.test');

  if (fs.existsSync(envPath)) {
    const envConfig = config({ path: envPath });

    if (envConfig.parsed) {
      Object.assign(process.env, envConfig.parsed);
    }
  } else {
    throw new Error(
      `Could not find .env.test file at ${envPath}. ` +
        'Tests cannot run without DATABASE_URL.',
    );
  }
}
