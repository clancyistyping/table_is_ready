import "dotenv/config";
import fs from 'fs';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from "../generated/prisma/client.js"; // Note: Use client.js for the main entry

// Check if we are in CI or Docker. If not, we MUST use localhost.
const isCI = process.env.CI === 'true';
const isDocker = fs.existsSync('/.dockerenv');

let connectionString: string;

if (isCI || isDocker) {
  // Use the Docker internal hostname
  connectionString = process.env.DATABASE_URL || "";
} else {
  // You are on your physical machine (D:/Coding projects/)
  // Use localhost or 127.0.0.1
  connectionString = process.env.LOCAL_DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/app";
}

console.log("Environment:", isDocker ? "DOCKER" : isCI ? "CI" : "LOCAL");
console.log("Target Host:", connectionString.split('@')[1]); // Logs only the "host:port/db" part

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });
