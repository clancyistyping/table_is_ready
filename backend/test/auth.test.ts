import { describe, it, expect } from "vitest";
import { login } from "../src/services/auth.services.js"
import { Prisma } from "../src/generated/prisma/client.js"
import { AppError } from "../src/utils/AppError.js"

describe("login service", () => {
    it("non-existing user: throws AppError", async () => {
        await expect(login("userThatDNE@example.com", "1231313")).rejects.toBeInstanceOf(AppError);
    })

    it("wrong password: throws AppError", async () => {
        await expect(login("test1@example.com", "incorrectPW")).rejects.toBeInstanceOf(AppError);
    })

    it("Returns user for correct cred", async () => {
        const user = await login("test1@example.com", "password");
        expect(user.email).toBe("test1@example.com")
    })
})