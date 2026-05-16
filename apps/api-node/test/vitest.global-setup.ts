import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { execSync } from 'child_process';

declare global {
  var postgresContainer: StartedPostgreSqlContainer | undefined;
}

export default async function () {
  console.log('🚢 Pulling and starting PostgreSQL container');

  const container = await new PostgreSqlContainer('postgres:16').start();

  const connectionUri = container.getConnectionUri();
  process.env.DATABASE_URL = connectionUri;

  // Store container globally so teardown can access it
  globalThis.postgresContainer = container;

  console.log('✅ PostgreSQL container started');
  console.log(`Connection URI: ${connectionUri}`);

  console.log('⏳ Running migrations...');
  execSync('pnpm db:migrate', { stdio: 'inherit' });
  console.log('✅ Migrations completed!');

  // Return teardown function
  return async () => {
    if (globalThis.postgresContainer) {
      console.log('🛑 Stopping PostgreSQL container...');
      await globalThis.postgresContainer.stop({ removeVolumes: true });
      console.log('✅ PostgreSQL container stopped');
      globalThis.postgresContainer = undefined;
    }
  };
}
