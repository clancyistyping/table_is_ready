// config
import { config } from "./config/index.js";

// Fastify instance + route registration
import Fastify, { FastifyError } from "fastify";
import jwt from "@fastify/jwt";
import sensible from "@fastify/sensible";

// Routes
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import healthRoutes from "./routes/health.routes.js";

// Plugins
import authPlugin from "./plugins/auth.plugin.js";

import { AppError } from "./utils/AppError.js";
import { request } from "node:http";

export const buildServer = async () => {
    const app = Fastify({
        logger: true,
    });

    // Checking JWT
    await app.register(jwt, {
        secret: config.jwtSecret,
    });

    // Global error handler
    app.setErrorHandler((error, _request, reply) => {
        // If it's our custom error, use its status code
        if (error instanceof AppError) {
            return reply.code(error.statusCode).send({
                error: error.message,
                code: error.code // e.g., "AUTH_EMAIL_EXISTS"
            });
        }

        // Otherwise, send a generic 500
        reply.code(500).send({ error: "Internal Server Error" });
    });

    // Register plugins
    await app.register(sensible);
    await app.register(authPlugin)

    // Register routes
    await app.register(healthRoutes);
    await app.register(authRoutes, { prefix: "/auth" });
    await app.register(usersRoutes, { prefix: "/users" })

    await app.ready();

    // console.log(app.printRoutes());

    return app;
}

/*
health.plugin.js?
.js extension is used because tsc compiler transforms the file to JavaScript

We're wrapping the Fastify instance in a function so that we can test it in isolation.

app.register(healthRoutes) is the same as app.use(healthRoutes) but creates a new scope, kind of like an import


*/
