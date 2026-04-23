import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';

const connection = postgres(process.env.DATABASE_URL!, { max: 1 });
const db = drizzle(connection);

async function main() {
  console.log('initializing db...');
  await db.execute(sql`CREATE EXTENSION IF NOT EXISTS pg_trgm;`);
  console.log('✅ pg_trgm extension enabled');
  await connection.end();
}

main().catch((err) => {
  console.error('Init failed:', err);
  process.exit(1);
});
