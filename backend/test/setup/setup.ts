import { execSync } from 'child_process';
import { prisma } from '../../src/lib/prisma.js';

export default async function () {
  // POOL_ID is the "Thread ID" (0, 1, 2, 3...)
  const threadId = process.env.VITEST_POOL_ID || '0';
  const schemaName = `test_schema_${threadId}`;

  // Update the URL for this specific worker
  const baseUrl = process.env.DATABASE_URL?.split('?')[0];
  const urlWithSchema = `${baseUrl}?schema=${schemaName}`;

  // Inject this into the environment so the Prisma Client picks it up
  process.env.DATABASE_URL = urlWithSchema;

  console.log(`[Thread ${threadId}] 🏗️  Building schema: ${schemaName}`);

  // Push the schema
  try {
    // We use --accept-data-loss for CI to ensure the push never hangs
    execSync(`npx prisma db push --accept-data-loss`, {
      env: { ...process.env, DATABASE_URL: urlWithSchema },
      stdio: 'inherit' // This allows you to see Prisma errors in your CI logs!
    });

    // Optional: Warm up the connection
    await prisma.$connect();
  } catch (err) {
    console.error(`[Worker ${threadId}] ❌ Schema sync failed:`, err);
    throw err;
  }

  console.log(`[Thread ${threadId}] ✅ Ready.`);
}