// Fastify instance + route registration
import Fastify, { FastifyError } from "fastify";
import jwt from "@fastify/jwt";
import sensible from "@fastify/sensible";

import authPlugin from "./plugins/auth.plugin.js";
import usersPlugin from "./plugins/users.plugin.js";
import healthPlugin from "./plugins/health.plugin.js";

export const buildServer = () => {
    const app = Fastify({ logger: true });

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("FATAL: JWT_SECRET is missing from environment variables!");
    }

    // Global error handler
    app.setErrorHandler((error, request, reply) => {
        // 1. Cast or check if it's a Fastify-compatible error
        const err = error as FastifyError;

        // 2. Check for statusCode (FastifyError always has this potential)
        if (err.statusCode) {
            return reply.status(err.statusCode).send({
                message: err.message,
                // Fallback to 'UNKNOWN' if code is missing
                code: err.code || "UNKNOWN_ERROR",
            });
        }

        // Handle unexpected errors (500s)
        request.log.error(error);

        return reply.status(500).send({
            message: "Internal Server Error",
            code: "INTERNAL_ERROR",
        });
    });

    // Register plugins
    app.register(sensible);
    app.register(jwt, {
        secret: process.env.JWT_SECRET!
    })
    app.register(healthPlugin);
    app.register(authPlugin, { prefix: "/auth" })
    app.register(usersPlugin, { prefix: "/users" })

    return app;
}

/*
health.plugin.js?
.js extension is used because tsc compiler transforms the file to JavaScript

We're wrapping the Fastify instance in a function so that we can test it in isolation.

app.register(healthRoutes) is the same as app.use(healthRoutes) but creates a new scope, kind of like an import


*/
