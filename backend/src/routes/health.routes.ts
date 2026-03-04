import { FastifyPluginAsync } from "fastify";

const healthRoutes: FastifyPluginAsync = async (app) => {
  // Simple health check
  app.get("/health", async () => {
    return { status: "ok" };
  });
};

// Wrap with fastify-plugin to avoid scope issues
export default healthRoutes;