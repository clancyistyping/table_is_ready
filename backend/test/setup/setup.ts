import { execSync } from 'child_process';
import { prisma } from '../../src/lib/prisma';

export default async function () {
  const workerId = process.env.VITEST_POOL_ID || '0';
  const schemaName = `test_schema_${workerId}`;
  
  // 1. Force the env var update BEFORE anything else
  const baseUrl = process.env.DATABASE_URL?.split('?')[0];
  process.env.DATABASE_URL = `${baseUrl}?schema=${schemaName}`;

  console.log(`\n🏗️  [Worker ${workerId}] Setting up ${schemaName}...`);

  try {
    // 2. Sync the schema
    execSync(`npx prisma db push --accept-data-loss`, {
      stdio: 'inherit',
      env: { ...process.env }
    });

    // 3. IMPORTANT: Re-generate the client in CI
    execSync(`npx prisma generate`, {
      stdio: 'inherit',
      env: { ...process.env }
    });

    // 4. Force a connection check
    await prisma.$connect();
    console.log(`✅ [Worker ${workerId}] Database ready.`);
  } catch (e) {
    console.error(`❌ [Worker ${workerId}] Setup failed!`, e);
    throw e;
  }
}