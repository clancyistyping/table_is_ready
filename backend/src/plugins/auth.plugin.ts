import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

const authPlugin: FastifyPluginAsync = async (app) => {
    // Decorate so other routes can use it
    app.decorate("authenticate", async function (req, reply) {
        try {
            await req.jwtVerify();
        } catch (err) {
            return reply.unauthorized();
        }
    });

    app.decorate("isAdmin", async function (req, reply) {
        if (req.user.role !== "ADMIN") {
            return reply.forbidden();
        }
    })
}

export default fp(authPlugin, { name: "auth-plugin" })
// naming "auth-plugin" for debug purposes