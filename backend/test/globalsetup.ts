import { execSync } from 'child_process';
import dotenv from 'dotenv';
import path from 'path';

export async function setup() {
  console.log('🚀 Global Setup: Synchronizing database schema...');
  
  try {
    // db push is faster for tests and avoids the P3005 "not empty" error
    execSync('npx prisma db push --accept-data-loss', { 
      stdio: 'inherit',
      shell: true,
      env: process.env 
    });
    console.log('✅ Global Setup: Schema sync complete.');
  } catch (error) {
    console.error('❌ Global Setup: Sync failed!');
    throw error;
  }
}