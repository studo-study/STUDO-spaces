import 'dotenv/config';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';

const connection = postgres(process.env.DATABASE_URL!, { max: 1 });
const db = drizzle(connection);

async function main() {
  await db.execute(sql`CREATE EXTENSION IF NOT EXISTS pg_trgm;`);
  await connection.end();
}

main().catch((err) => {
  void err;
  process.exit(1);
});
