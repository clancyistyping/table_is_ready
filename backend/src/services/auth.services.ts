import { prisma } from "../lib/prisma.js";
import { comparePassword, hashPassword } from "../utils/hash.js";

import { AppError } from "../utils/AppError.js";



export async function register(email: string, password: string) {
    const userExists = await prisma.user.findUnique({ where: { email } })
    // Check existing user
    if (userExists) {
        throw new AppError("Email already in use", 409, "AUTH_EMAIL_EXISTS");
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
    if (!user) {
        // We throw the same error for security (don't reveal if email exists)
        throw new AppError("Email or password is incorrect", 401, "AUTH_INVALID");
    }

    // See if password matches
    const isValid = await comparePassword(password, user.password)

    if (!isValid) {
        throw new AppError("Email or password is incorrect", 401, "AUTH_INVALID");
    }

    return user
    // We don't need to issue JWT inside service since Fastify already has it. Intentionally leaving framework logic out services.
}