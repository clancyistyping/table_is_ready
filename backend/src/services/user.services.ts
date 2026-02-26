import { prisma } from "../lib/prisma.js";

export async function getAllUsers() {
    // for now, return all users
    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            // password: false (This is the default if not included)
        }
    });
    return users;
}