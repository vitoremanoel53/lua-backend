import { FastifyInstance } from "fastify";
import { AssistantController } from "../controllers/assistantController.js";

export async function assistantRoutes(
  fastify: FastifyInstance<any, any, any, any>,
  controller: AssistantController
) {
  fastify.get("/health", controller.health);
  fastify.post("/assistant/process", controller.process);
}
