import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { register, login } from "../services/auth.services.js";

import { JwtPayload } from "../types/auth.js";


const authPlugin: FastifyPluginAsync = async (app) => {

    app.decorate("authenticate", async function (req, reply) {
        try {
            await req.jwtVerify();
        } catch (err) {
            reply.unauthorized();
        }
    });

    app.post("/register",
        {
            schema: {
                body: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: { type: "string", format: "email" },
                        password: { type: "string", minLength: 6 }
                    }
                }
            }
        },
        async (req, reply) => {
            const { email, password } = req.body as {
                email: string
                password: string
            }

            const user = await register(email, password)

            return { id: user.id, email: user.email }
        })

    app.post("/login",
        {
            schema: {
                body: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: { type: "string", format: "email" },
                        password: { type: "string", minLength: 6 }
                    }
                }
            }
        },
        async (req, reply) => {
            const { email, password } = req.body as {
                email: string,
                password: string
            }

            const user = await login(email, password)

            const token = app.jwt.sign({ userId: user.id })

            return { token }
        })
}

export default fp(authPlugin)