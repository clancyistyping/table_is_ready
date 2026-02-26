import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
// import { JwtPayload } from "../types/auth.js";

// This module is a "messenger/controller" that delivers messages to other modules

const authPlugin: FastifyPluginAsync = async (app) => {
    app.decorate("authenticate", async function (req, reply) {
        try {
            await req.jwtVerify();
        } catch (err) {
            reply.unauthorized();
        }
    });
}

export default fp(authPlugin)