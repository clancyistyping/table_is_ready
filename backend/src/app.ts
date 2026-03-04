// Production entrypoint, starts the server
import { buildServer } from "./server.js";

async function start() {
    console.log("🚀 Initializing Server...");

    try {
        const app = await buildServer();

        // This line is key: it waits for all plugins (including JWT) to load
        await app.ready();
        console.log("📦 Plugins loaded successfully");

        const port = Number(process.env.PORT || 3000);
        const host = process.env.HOST || "0.0.0.0";

        await app.listen({ port, host });
        console.log(`✅ Server listening on http://${host}:${port}`);

    } catch (err) {
        console.error("❌ CRITICAL CRASH DURING BOOT:");
        console.error(err);
        process.exit(1); // Force Code 1 so Docker knows it failed
    }
}

start();

// console.log("Starting server...");
// app.listen({ port, host })
//   .then((address) => {
//     console.log(`Server successfully started at ${address}`);
//   })
//   .catch((err) => {
//     console.error("FATAL ERROR DURING LISTEN:", err);
//     process.exit(1);
//   });

// console.log("End of app.ts reached.");

// app.listen({ port, host }).catch((err) => {
//     app.log.error(err);
//     process.exit(1);
// })

/*
'??' is a nullish coalescing operator. If the left side is null or undefined, it returns the right side.

0.0.0.0
A special address that tells the server to listen on all available network interfaces
making it future-proof for Docker and cloud hosting providers

*/