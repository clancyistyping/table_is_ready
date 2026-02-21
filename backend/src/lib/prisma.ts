import "dotenv/config";
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from "../generated/prisma/client.js"; // Note: Use client.js for the main entry

// Use LOCAL_DATABASE_URL if we are on the host machine (like Vitest/Prisma Studio)
// Otherwise fallback to the Docker DATABASE_URL
const connectionString = process.env.LOCAL_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("No database connection string found in .env");
}

// Log it ONCE to verify it says 'postgres' and NOT 'localhost'
console.log("Connecting to:", connectionString);

// 1. Create the connection pool using your environment variable
const pool = new pg.Pool({ connectionString });

// 2. Create the adapters
const adapter = new PrismaPg(pool);

// 3. Pass the adapter to the constructor (This fixes your error!)
export const prisma = new PrismaClient({ adapter });

// We made a separate file so that we get:
// single DB connection
// a place for logging and middleware plugging
// cleaner route files
