import { describe, it, beforeAll, afterAll, expect, beforeEach } from "vitest";
import request from "supertest";
import { FastifyInstance } from "fastify";
import { buildServer } from "../src/server.js";
import { prisma } from "../src/lib/prisma.js";

let app: FastifyInstance;

describe("Users API", () => {
    // Build Fastify instance before testing
    beforeAll(async () => {
        // load .env for vitest
        import('dotenv/config');

        app = await buildServer();
        await app.ready();
    });

    beforeEach(async () => {
        // This now wipes the isolated worker schema, not the public one
        await prisma.user.deleteMany();
    });

    afterAll(async () => {
        await app.close();
    });

    it("POST /users should create a user", async () => {
        const res = await request(app.server)
            .post("/auth/register")
            .send({ email: "test1@example.com", password: "password" })
            .expect(201);

        expect(res.body).toHaveProperty("id");
        expect(res.body.email).toBe("test1@example.com");
    });


    it("POST /users duplicate email should return 409", async () => {
        const dupEmail = "duplicate@example.com";

        await prisma.user.create({
            data: { email: dupEmail, password: "hashed_password" }
        });

        const res = await request(app.server)
            .post("/auth/register")
            .send({ email: dupEmail, password: "password" })
            .expect(409);

        expect(res.body.error).toBe("Email already in use");
    });

    it("GET /users should return all users", async () => {
        // create new user
        const uniqueEmail = `login-test-${Date.now()}@example.com`;
        await prisma.user.create({
            data: { email: uniqueEmail, password: "hashed_password" }
        });

        // get all users
        const res = await request(app.server)
            .get("/users")
            .expect(200);

        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(1); // id and email
        expect(res.body[0].email).toBe(uniqueEmail);
    });
});
