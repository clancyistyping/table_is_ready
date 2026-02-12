import "dotenv/config";
import { buildApp } from "./app.js";

const app = buildApp();

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? "0.0.0.0";

app.listen({ port, host }).catch((err) => {
    app.log.error(err);
    process.exit(1);
})


/*
'??' is a nullish coalescing operator. If the left side is null or undefined, it returns the right side.

0.0.0.0
A special address that tells the server to listen on all available network interfaces
making it future-proof for Docker and cloud hosting providers

*/