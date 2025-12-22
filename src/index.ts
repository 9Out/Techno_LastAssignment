// index.ts
import { createServer } from "./server";

async function start() {
  try {
    const server = await createServer();
    await server.initialize();

    await server.start();
    console.log("Server running at:", server.info.uri);
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();