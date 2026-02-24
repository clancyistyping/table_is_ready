import "dotenv/config";
import fs from 'fs';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from "../generated/prisma/client.js"; // Note: Use client.js for the main entry

// Check if the /.dockerenv file exists (standard for Docker)
const isDocker = fs.existsSync('/.dockerenv');

// Decide which URL to use
const connectionString = isDocker
  ? process.env.DATABASE_URL       // Uses @postgres (Docker Network)
  : process.env.LOCAL_DATABASE_URL; // Uses @localhost (Host Machine)

console.log(`running in ${isDocker ? 'DOCKER' : 'LOCAL'} mode`);
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
