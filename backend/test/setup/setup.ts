import { execSync } from 'child_process';
import { prisma } from '../../src/lib/prisma.js';

export default async function () {
  const workerId = process.env.VITEST_POOL_ID || '0';
  const schemaName = `test_schema_${workerId}`;
  
  // Construct the URL with the dynamic schema
  const baseUrl = (process.env.DATABASE_URL || "postgresql://user:pass@localhost:5432/db").split('?')[0];
  const urlWithSchema = `${baseUrl}?schema=${schemaName}`;
  
  // Set the environment variable so the next commands use it
  process.env.DATABASE_URL = urlWithSchema;

  console.log(`[Worker ${workerId}] 🏗️  Syncing database for ${schemaName}...`);

  try {
    // 1. Push the schema to create the tables
    execSync(`npx prisma db push --accept-data-loss`, {
      env: { ...process.env, DATABASE_URL: urlWithSchema },
      stdio: 'inherit' 
    });

    // 2. IMPORTANT: Generate the client specifically for this environment
    // This ensures the "ColumnNotFound" error (P2022) disappears
    execSync(`npx prisma generate`, {
      env: { ...process.env, DATABASE_URL: urlWithSchema },
      stdio: 'inherit'
    });

    // 3. Force the client to connect to the new schema
    await prisma.$connect();
    
  } catch (err) {
    console.error(`[Worker ${workerId}] ❌ Setup failed:`, err);
    throw err;
  }
}