import "dotenv/config";
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from "../generated/prisma/client.js"; // Note: Use client.js for the main entry

const connectionString = process.env.DATABASE_URL;

// if (!connectionString) {
//     throw new Error("DATABASE_URL is not defined! Check your Docker environment.");
// }

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
