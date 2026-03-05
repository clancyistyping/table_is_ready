import 'dotenv/config';
import { describe, it, beforeAll, afterAll, expect, beforeEach } from "vitest";
import request from "supertest";
import { FastifyInstance } from "fastify";
import { buildServer } from "../src/server.js";
import { prisma } from "../src/lib/prisma.js";
import { login } from "../src/services/auth.services.js";

let app: FastifyInstance;

describe("Users API", () => {
    // Build Fastify instance before testing
    beforeAll(async () => {

        app = await buildServer();
        await app.ready();
    });

    beforeEach(async () => {
        // This now wipes the isolated worker schema, not the public one
        await prisma.user.deleteMany();
    });

    afterAll(async () => {
        await prisma.user.deleteMany();
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

        await request(app.server)
            .post("/auth/register")
            .send({ email: dupEmail, password: "someRandomPassword" })
            .expect(201);

        const res = await request(app.server)
            .post("/auth/register")
            .send({ email: dupEmail, password: "password" })
            .expect(409);

        expect(res.body.error).toBe("Email already in use");
    });

    it("GET /users should return all users", async () => {
        // create new user
        const uniqueEmail = `login-test-${Date.now()}@example.com`;
        const password = "someUniquePassword";

        await request(app.server)
            .post("/auth/register")
            .send({ email: uniqueEmail, password: password })
            .expect(201);

        // login first to access token
        const loginRes = await request(app.server)
            .post("/auth/login")
            .send({ email: uniqueEmail, password: password })
            .expect(200);


        const token = loginRes.body.token;

        // get all users
        const res = await request(app.server)
            .get("/users")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);

        expect(Array.isArray(res.body)).toBe(true);
        const myUser = res.body.find((u: any) => u.email === uniqueEmail);
        expect(myUser).toBeDefined();
    });
});
