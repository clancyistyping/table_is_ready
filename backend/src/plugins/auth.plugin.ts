import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

const authPlugin: FastifyPluginAsync = async (app) => {
    // Decorate so other routes can use it
    app.decorate("authenticate", async function (req, reply) {
        try {
            await req.jwtVerify();
        } catch (err) {
            // fastify/sensible standard
            return reply.status(401).send({
                error: "Unauthorized",
                message: "Authentication required"
            });
        }
    });

    app.decorate("isAdmin", async function (req, reply) {
        // Safety check: ensure authenticate was called first
        if (!req.user) {
            return reply.status(401).send({ error: "Unauthorized" });
        }

        if (req.user.role !== "ADMIN") {
            return reply.status(403).send({ error: "Forbidden: Admin access required" });
        }
    })
}

export default fp(authPlugin, {
    name: "auth-plugin",
    dependencies: ["@fastify/jwt"] // Ensures JWT is loaded before this runs
});
// naming "auth-plugin" for debug purposes