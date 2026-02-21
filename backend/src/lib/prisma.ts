import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

// We made a separate file so that we get:
// single DB connection
// a place for logging and middleware plugging
// cleaner route files
