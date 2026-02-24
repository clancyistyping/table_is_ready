import { prisma } from "../lib/prisma.js";
import { hashPassword } from "../utils/hash.js";

export async function register(email: string, password: string) {
    const userExists = await prisma.user.findUnique({ where: { email } })
    // Check existing user
    if (userExists) {
        throw new Error("Email already in use.")
    }

    const hashed = await hashPassword(password)

    const user = await prisma.user.create({
        data: { email, password: hashed }
    })
    return user
}