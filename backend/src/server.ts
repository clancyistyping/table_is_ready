// Fastify instance + route registration
import Fastify from "fastify";
import jwt from "@fastify/jwt";
import sensible from "@fastify/sensible";

export const buildServer = () => {
    const app = Fastify({ logger: true });

    app.register(sensible);
    app.register(jwt, {
        secret: process.env.JWT_SECRET!
    })

    return app;
}

/*
health.js?
.js extension is used because tsc compiler transforms the file to JavaScript

We're wrapping the Fastify instance in a function so that we can test it in isolation.

app.register(healthRoutes) is the same as app.use(healthRoutes) but creates a new scope, kind of like an import


*/
