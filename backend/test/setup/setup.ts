import { execSync } from 'child_process';

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
  execSync(`npx prisma db push --skip-generate`, {
    env: { ...process.env, DATABASE_URL: urlWithSchema }
  });
  
  console.log(`[Thread ${threadId}] ✅ Ready.`);
}