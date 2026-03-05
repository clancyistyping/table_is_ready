import { FastifyPluginAsync } from "fastify";
import { register, login } from "../services/auth.services.js";

const authRoutes: FastifyPluginAsync = async (app) => {
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

            return reply.status(201).send({ id: user.id, email: user.email })
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
            },
            config: {
                rateLimit: {
                    // limit api call
                    max: 5,
                    timeWindow: "1 minute"
                }
            }
        },
        async (req, reply) => {
            const { email, password } = req.body as {
                email: string,
                password: string
            }

            const user = await login(email, password)

            if (!user) {
                return reply.status(401).send({ error: "Invalid credentials" });
            }

            const token = await reply.jwtSign({
                userId: user.id,
                role: user.role
            })

            return reply.code(200).send({ token });
        })

}

export default authRoutes;