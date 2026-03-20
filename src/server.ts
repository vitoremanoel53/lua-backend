import { buildApp } from "./app.js";
import { getConfig } from "./config/env.js";

async function start() {
  const config = getConfig();
  const app = await buildApp();

  try {
    await app.listen({
      port: config.PORT,
      host: "0.0.0.0"
    });
    app.log.info({ port: config.PORT }, "backend-lua started");
  } catch (error) {
    app.log.error({ err: error }, "failed to start backend-lua");
    process.exit(1);
  }
}

void start();
