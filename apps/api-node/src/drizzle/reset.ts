import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

async function main() {
  // Haal alle tabellen op
  const tables = await sql`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  `;

  // Drop ze allemaal
  // Drop ze allemaal
  for (const { tablename } of tables) {
    await sql.unsafe(`DROP TABLE IF EXISTS "${tablename}" CASCADE`);
  }

  // Drop enums
  const enums = await sql`
    SELECT typname FROM pg_type 
    WHERE typcategory = 'E' 
    AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
`;

  for (const { typname } of enums) {
    await sql.unsafe(`DROP TYPE IF EXISTS "${typname}" CASCADE`);
  }
}

main()
  .then(async () => {
    await sql.end();
  })
  .catch(async (err) => {
    await sql.end();
    process.exit(1);
  });
