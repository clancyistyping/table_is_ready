import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

const healthPlugin: FastifyPluginAsync = async (app) => {
  // Simple health check
  app.get("/health", async () => {
    return { status: "ok" };
  });
};

// Wrap with fastify-plugin to avoid scope issues
export default fp(healthPlugin);