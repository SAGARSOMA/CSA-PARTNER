import type { Env } from './config/env';
import { getEnv } from './config/env';
import { createApp } from './app';
import { logger } from './lib/logger';

let env: Env;
try {
  env = getEnv();
} catch (e) {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
}

createApp(env).listen(env.PORT, () => {
  logger.info({ port: env.PORT }, 'CSA API started');
});
