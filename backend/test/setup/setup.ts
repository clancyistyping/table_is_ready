import { execSync } from 'child_process';

export default async function () {
  const workerId = process.env.VITEST_POOL_ID || '0';
  const schemaName = `test_schema_${workerId}`;
  const url = `${process.env.DATABASE_URL?.split('?')[0]}?schema=${schemaName}`;
  
  process.env.DATABASE_URL = url;

  console.log(`[Worker ${workerId}] 🏗️  Syncing database...`);

  // 1. Push the schema
  execSync(`npx prisma db push --accept-data-loss`, {
    env: { ...process.env, DATABASE_URL: url }
  });

  // 2. IMPORTANT: Regenerate the client to match the schema in the custom output folder
  execSync(`npx prisma generate`, {
    env: { ...process.env, DATABASE_URL: url }
  });
}