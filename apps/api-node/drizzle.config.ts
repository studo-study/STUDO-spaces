import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

config({ path: '../../.env' }); // single monorepo-root .env

// Note: don't throw at module load — static analysis tools (e.g. knip) import
// this config without a DATABASE_URL. drizzle-kit itself fails loudly on an
// empty url when a command actually needs the connection.
const url = process.env.DATABASE_URL ?? '';

export default defineConfig({
  dialect: 'postgresql',
  schema: [
    './src/drizzle/schema.ts',
    './src/drizzle/relations.ts',
    './src/drizzle/enums.ts',
  ],
  out: './migrations',
  dbCredentials: {
    url,
  },
});
