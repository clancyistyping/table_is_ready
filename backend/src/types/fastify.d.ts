import "@fastify/jwt";
import { JwtPayload } from "./auth.js";

// 1. Augment the JWT module specifically
declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: JwtPayload; // types for app.jwt.sign
    user: JwtPayload;    // types for request.user
  }
}

// 2. Augment the Fastify module for your custom decorator
declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      request: import("fastify").FastifyRequest,
      reply: import("fastify").FastifyReply
    ) => Promise<void>;
    isAdmin: (
      request: import("fastify").FastifyRequest,
      reply: import("fastify").FastifyReply
    ) => Promise<void>;
  }
}

```
app.authenticate is known

request.user is typed

No any in route handlers
```