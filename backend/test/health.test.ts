import { describe, it, expect } from "vitest";
import { buildServer } from "../src/server.js";
import { FastifyInstance } from "fastify";
import request from "supertest";

let app: FastifyInstance;

describe("GET /health", () => {
    it("returns ok", async () => {
        app = await buildServer();

        const res = await request(app.server)
            .get("/health")
            .expect((res) => {
                expect(res.statusCode).toBe(200);
                expect(res.body).toEqual({ status: "ok" });
            })
    });

})
