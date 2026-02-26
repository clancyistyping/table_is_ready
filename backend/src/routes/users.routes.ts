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
        async (req) => {
            const users = await getAllUsers();
            return users; // Defaults to 200 OK
        })
};

export default usersRoutes;