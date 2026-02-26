import "dotenv/config";
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from "../generated/prisma/client.js";

const getConnectionString = () => {
  let url = process.env.DATABASE_URL || process.env.LOCAL_DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is missing!");

  // SIMPLE FIX: If the URL points to 'postgres' but we are running on Windows/Mac host
  // we swap it to localhost so the DB can be reached.
  if (url.includes('@postgres:') && !process.env.CI) {
    url = url.replace('@postgres:', '@localhost:');
  }
  return url;
};

const pool = new pg.Pool({ connectionString: getConnectionString() });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });