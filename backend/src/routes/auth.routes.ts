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
            }
        },
        async (req, reply) => {
            const { email, password } = req.body as {
                email: string,
                password: string
            }

            const user = await login(email, password)

            const token = app.jwt.sign({ userId: user.id,
                role: user.role
             })

            return reply.code(200).send({ token });
        })

}

export default authRoutes;