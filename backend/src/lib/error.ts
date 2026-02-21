import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { FastifyReply } from "fastify";

export function handlePrismaError(err: unknown, reply: FastifyReply) {
    if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            return reply.status(409).send({ error: "Email already exists" });
        }
    }
    throw err;
}