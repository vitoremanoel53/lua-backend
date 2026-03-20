import { FastifyReply, FastifyRequest } from "fastify";
import { AssistantProcessService } from "../services/assistantProcessService.js";
import { assistantProcessRequestSchema } from "../types/lua-assistant.js";

export class AssistantController {
  constructor(private readonly service: AssistantProcessService) {}

  process = async (request: FastifyRequest, reply: FastifyReply) => {
    const parsed = assistantProcessRequestSchema.safeParse(request.body);

    if (!parsed.success) {
      request.log.warn({ issues: parsed.error.issues }, "invalid assistant request");
      return reply.status(400).send({
        error: "INVALID_REQUEST",
        message: "O corpo da requisicao esta invalido.",
        issues: parsed.error.issues
      });
    }

    const result = await this.service.process(parsed.data);
    return reply.status(200).send(result);
  };

  health = async (_request: FastifyRequest, reply: FastifyReply) => {
    return reply.status(200).send({
      status: "ok",
      service: "backend-lua",
      timestamp: new Date().toISOString()
    });
  };
}
