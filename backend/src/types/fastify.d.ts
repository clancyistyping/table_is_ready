import "fastify";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (request: any, reply: any) => Promise<void>;
  }

  interface FastifyRequest {
    user: {
      userId: string;
      iat: number;
      exp: number;
    };
  }
}

```
app.authenticate is known

request.user is typed

No any in route handlers
```