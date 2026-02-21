import { type FastifyPluginAsync } from "fastify";
import { prisma } from "../lib/prisma.js";

import { handlePrismaError } from "../lib/error.js";

interface CreateUserBody {
    email: string;
}

export const userRoutes: FastifyPluginAsync = async (app) => {
    app.post<{ Body: CreateUserBody }>(
        "/users",
        {
            schema: {
                body: {
                    type: "object",
                    required: ["email"],
                    properties: {
                        email: { type: "string", format: "email" },
                    },
                },
                response: {
                    201: {
                        type: "object",
                        properties: {
                            id: { type: "string" },
                            email: { type: "string" },
                            createdAt: { type: "string" },
                        },
                    },
                },
            },
        },
        async (req, reply) => {
            const { email } = req.body;

            try {
                const user = await prisma.user.create({
                    data: { email },
                });
                return reply.status(201).send(user);
            } catch (err) {
                handlePrismaError(err, reply);
            }
        }
    );

    app.get(
        "/users",
        {
            schema: {
                response: {
                    200: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { type: "string" },
                                email: { type: "string" },
                                createdAt: { type: "string" },
                            },
                        },
                    },
                },
            },
        },
        async (_, reply) => {
            // Paginate and filter users
            // Potentially preventing large DB response.
            const users = await prisma.user.findMany({
                take: 50,          // limit
                orderBy: { createdAt: 'desc' }
            });
            return reply.status(200).send(users);
        }
    );
};