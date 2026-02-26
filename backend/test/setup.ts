import { beforeAll } from 'vitest';
import { execSync } from 'child_process';
import 'dotenv/config';

beforeAll(async () => {
  // Use the same logic to ensure the CLI can reach the DB
  const url = process.env.DATABASE_URL || process.env.LOCAL_DATABASE_URL;
  const targetUrl = (!process.env.CI && url?.includes('@postgres:')) 
    ? url.replace('@postgres:', '@localhost:') 
    : url;

  execSync('npx prisma db push --accept-data-loss', {
    env: { ...process.env, DATABASE_URL: targetUrl },
    stdio: 'inherit'
  });
});