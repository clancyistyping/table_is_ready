import { execSync } from 'child_process';
import { prisma } from '../../src/lib/prisma.js';

export default async function () {
  const workerId = process.env.VITEST_POOL_ID || '0';
  const schemaName = `test_schema_${workerId}`;
  
  // 1. Update the process env IMMEDIATELY
  const baseUrl = process.env.DATABASE_URL?.split('?')[0];
  const urlWithSchema = `${baseUrl}?schema=${schemaName}`;
  process.env.DATABASE_URL = urlWithSchema;

  console.log(`\n [Worker ${workerId}] Syncing: ${schemaName}`);

  // 2. Run push AND generate in the same shell to ensure sync
  // Standard 'npx prisma generate' is required because of your custom 'output' path
  execSync(`npx prisma db push --accept-data-loss && npx prisma generate`, {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: urlWithSchema }
  });

  // 3. IMPORTANT: Tell the prisma instance to re-read the URL
  // This prevents the "ColumnNotFound" error by ensuring the client
  // knows exactly which schema it is talking to.
  await prisma.$connect();
}