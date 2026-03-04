import { FastifyPluginAsync } from "fastify";
import { getAllUsers } from "../services/user.services.js";

const usersRoutes: FastifyPluginAsync = async (app) => {
    app.get(
        "/me",
        { preHandler: [app.authenticate] },
        async (req) => {
            return req.user;
        }
    );

    app.get(
        "/",
        { preHandler: [app.authenticate] }, // only jwt authenticated users for now
        async (req) => {
            return getAllUsers();
        });
}

export default usersRoutes;