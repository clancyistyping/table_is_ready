import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { FastifyReply } from "fastify";

//FIXME: use the function to handle prisma errors
export function handlePrismaError(err: unknown, reply: FastifyReply) {
    // Handling Prisma errors
    if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            return reply.status(409).send({
                error: "Email already exists",
            });
        }
    }

    console.error(err);

    return reply.status(500).send({
        error: "Internal Server Error",
    });
}