import 'dotenv/config';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '../src/drizzle/schema';
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });
const connection = postgres(process.env.DATABASE_URL as string, { max: 5 });
const db = drizzle(connection, { schema });

async function main() {
  console.log('Resetting database...');
  await sql.unsafe(`DROP SCHEMA public CASCADE`);
  await sql.unsafe(`DROP SCHEMA IF EXISTS drizzle CASCADE`);
  await sql.unsafe(`CREATE SCHEMA public`);
  await sql.unsafe(`GRANT ALL ON SCHEMA public TO public`);
  console.log('Schema reset complete.');

  await migrate(db, { migrationsFolder: './migrations' });
  console.log('Migrations applied.');
}

main()
  .then(async () => {
    await sql.end();
    await connection.end();
  })
  .catch(async (err) => {
    console.error('Reset failed:', err);
    await sql.end();
    await connection.end();
    process.exit(1);
  });
