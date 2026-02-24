import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin"

const usersPlugin: FastifyPluginAsync = async (app) => {
    app.get(
        "/me",
        { preHandler: [app.authenticate] },
        async (req) => {
            return req.user;
        }
    );
};

export default fp(usersPlugin);