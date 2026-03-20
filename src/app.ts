import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import Fastify, { FastifyInstance } from "fastify";
import { createLogger } from "./config/logger.js";
import { getConfig } from "./config/env.js";
import { assistantRoutes } from "./routes/assistantRoutes.js";
import { AssistantController } from "./controllers/assistantController.js";
import { AssistantProcessService } from "./services/assistantProcessService.js";
import { OpenAiClient, OpenAiClientPort } from "./clients/openAiClient.js";
import { LuaAssistantPromptBuilder } from "./prompts/luaAssistantPromptBuilder.js";

export interface BuildAppOverrides {
  openAiClient?: OpenAiClientPort;
}

export async function buildApp(
  overrides: BuildAppOverrides = {}
): Promise<FastifyInstance<any, any, any, any>> {
  const config = getConfig();
  const logger = createLogger();

  const app = Fastify({
    loggerInstance: logger
  });

  await app.register(cors, {
    origin: config.CORS_ORIGIN === "*" ? true : config.CORS_ORIGIN
  });

  await app.register(helmet, {
    global: true
  });

  const openAiClient = overrides.openAiClient ?? new OpenAiClient();
  const promptBuilder = new LuaAssistantPromptBuilder();
  const assistantService = new AssistantProcessService(openAiClient, promptBuilder, app.log);
  const assistantController = new AssistantController(assistantService);

  await assistantRoutes(app as FastifyInstance<any, any, any, any>, assistantController);

  app.setErrorHandler((error, request, reply) => {
    request.log.error({ err: error }, "unhandled route error");
    void reply.status(500).send({
      error: "INTERNAL_SERVER_ERROR",
      message: "O backend encontrou uma falha inesperada."
    });
  });

  return app;
}
