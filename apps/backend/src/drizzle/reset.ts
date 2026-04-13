import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

async function main() {
  console.log('Dropping all tables...');

  // Haal alle tabellen op
  const tables = await sql`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  `;

  // Drop ze allemaal
  // Drop ze allemaal
  for (const { tablename } of tables) {
    await sql.unsafe(`DROP TABLE IF EXISTS "${tablename}" CASCADE`);
    console.log(`Dropped ${tablename}`);
  }

  // Drop enums
  const enums = await sql`
    SELECT typname FROM pg_type 
    WHERE typcategory = 'E' 
    AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
`;

  for (const { typname } of enums) {
    await sql.unsafe(`DROP TYPE IF EXISTS "${typname}" CASCADE`);
    console.log(`Dropped enum ${typname}`);
  }
}

main().catch((err) => {
  console.error('Reset failed:', err);
  process.exit(1);
});
