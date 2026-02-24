import { FastifyPluginAsync } from "fastify";
import { register, login } from "../services/auth.services.js"

const authPlugin: FastifyPluginAsync = async (app) => {
    app.post("/register", async (req, reply) => {
        const { email, password } = req.body as {
            email: string
            password: string
        }

        const user = await register(email, password)

        return { id: user.id, email: user.email }
    })

    app.post("/login", async (req, reply) => {
        const { email, password } = req.body as {
            email: string,
            password: string
        }

        const user = await login(email, password)

        const token = app.jwt.sign({ userId: user.id })

        return { token }
    })
}

export default authPlugin