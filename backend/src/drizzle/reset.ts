import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

async function main() {
  console.log('Dropping all tables...');

  // Haal alle tabellen op
  const tables = await sql`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  `;

  // Drop ze allemaal
  for (const { tablename } of tables) {
    await sql.unsafe(`DROP TABLE IF EXISTS "${tablename}" CASCADE`);
    console.log(`Dropped ${tablename}`);
  }

  console.log('All tables dropped!');
  await sql.end();
}

main().catch((err) => {
  console.error('Reset failed:', err);
  process.exit(1);
});
