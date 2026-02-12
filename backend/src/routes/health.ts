import { type FastifyPluginAsync } from "fastify";

export const healthRoutes: FastifyPluginAsync = async (app) => {
    app.get("/health", async () => {
        return { status: "ok" };
    })
}


/*

1. what is { type FastifyPluginAsync }
tells the IDE that 'app' is a Fastify instance

2. why are we using async?
Fastify treats the return of the promise as a signal that the request is complete

The Outer async (plugin level): Used to tell Fastify the route registration is complete.
The Inner async (route level): Used to handle the specific HTTP request. Fastify is smart—if a route handler returns a value (like your object), it automatically sends it as a JSON response with a 200 OK status.

*/