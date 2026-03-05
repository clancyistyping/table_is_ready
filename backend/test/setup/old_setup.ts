import { execSync } from 'child_process';
import { prisma } from '../../src/lib/prisma.js';

export default async function () {
  const threadId = process.env.VITEST_POOL_ID || '0';
  const schemaName = `test_schema_${threadId}`;
  const baseUrl = process.env.DATABASE_URL?.split('?')[0];
  const urlWithSchema = `${baseUrl}?schema=${schemaName}`;
  
  // Set the environment for the current process
  process.env.DATABASE_URL = urlWithSchema;

  try {
    // 1. Create the schema and tables
    execSync(`npx prisma db push --accept-data-loss`, {
      env: { ...process.env, DATABASE_URL: urlWithSchema }
    });

    // 2. REGENERATE the client so the custom output matches the DB
    execSync(`npx prisma generate`, {
      env: { ...process.env, DATABASE_URL: urlWithSchema }
    });

    // 3. Force the global prisma instance to connect to this new schema
    await prisma.$connect();
  } catch (err) {
    console.error(`Error during setup for ${schemaName}:`, err);
    throw err;
  }
}