import Fastify, { type FastifyInstance } from "fastify";
import { healthRoutes } from "./routes/health.js";

export function buildApp(): FastifyInstance {
    const app = Fastify({ logger: true });
    app.register(healthRoutes);
    return app;
}

/*
health.js?
.js extension is used because tsc compiler transforms the file to JavaScript

We're wrapping the Fastify instance in a function so that we can test it in isolation.

app.register(healthRoutes) is the same as app.use(healthRoutes) but creates a new scope, kind of like an import
*/
