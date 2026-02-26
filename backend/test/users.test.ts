import { describe, it, beforeAll, afterAll, expect } from "vitest";
import request from "supertest";
import { FastifyInstance } from "fastify";
import { prisma } from "../src/lib/prisma.js";
import { buildServer } from "../src/server.js";

let app: FastifyInstance;

describe("Users API", () => {
    // Build Fastify instance before testing
    beforeAll(async () => {
        // load .env for vitest
        import('dotenv/config');

        app = await buildServer();
        await app.ready();

        try {
            // Reset database
            await prisma.user.deleteMany();
            console.log("✅ Database reset successful");
        } catch (e: any) {
            console.error("❌ Database reset failed!");
            console.error("Error Code:", e.code); // Look for P2021 or P2002
            console.error("Message:", e.message);
            throw e;
        }
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
        const res = await request(app.server)
            .post("/auth/register")
            .send({ email: "test1@example.com", password: "password" })
            .expect(409);

        expect(res.body.error).toBe("Email already in use");
    });

    it("GET /users should return all users", async () => {
        const res = await request(app.server)
            .get("/users")
            .expect(200);


        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(1);
        expect(res.body[0].email).toBe("test1@example.com");
    });
});
