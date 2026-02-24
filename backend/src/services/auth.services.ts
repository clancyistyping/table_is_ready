import { prisma } from "../lib/prisma.js";
import { comparePassword, hashPassword } from "../utils/hash.js";

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

export async function login(email: string, password: string) {
    // See if email exists
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) throw new Error("Email and/or password is invalid")

    // See if password matches
    const isValid = await comparePassword(password, user.password)
    if (!isValid) throw new Error("Email and/or password is invalid")

    return user
    // We don't need to issue JWT inside service since Fastify already has it. Intentionally leaving framework logic out services.
}