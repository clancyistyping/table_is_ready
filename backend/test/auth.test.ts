import 'dotenv/config';
import { describe, it, beforeAll, afterAll, expect, beforeEach } from "vitest";
import { login } from "../src/services/auth.services.js"
import { prisma } from "../src/lib/prisma.js";
import { AppError } from "../src/utils/AppError.js"

import { buildServer } from "../src/server.js";
import { FastifyInstance } from "fastify";

import request from "supertest";

let app: FastifyInstance;
let uniqueEmail: string;

describe("login service", () => {
    beforeAll(async () => {
        // load .env for vitest

        app = await buildServer();
        await app.ready();

        // db clean reset
        await prisma.user.deleteMany();
    });

    beforeEach(async () => {
        await prisma.user.deleteMany();

        uniqueEmail = `login-test-${Date.now()}@example.com`;
        await request(app.server)
            .post("/auth/register")
            .send({ email: uniqueEmail, password: "password" });;
    })

    afterAll(async () => {
        await app.close();
    });

    // Refactor to use request() rather than expect
    it("non-existing user: throws AppError", async () => {
        await expect(login("userThatDNE@example.com", "1231313")).rejects.toBeInstanceOf(AppError);
    })

    it("wrong password: throws AppError", async () => {
        await expect(login(uniqueEmail, "incorrectPW")).rejects.toBeInstanceOf(AppError);
    })

    it("Returns user for correct cred", async () => {
        const res = await login(uniqueEmail, "password")
        expect(res.email).toBe(uniqueEmail);
    });
})