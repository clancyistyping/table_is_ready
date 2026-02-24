// Fastify instance + route registration
import Fastify from "fastify";
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
