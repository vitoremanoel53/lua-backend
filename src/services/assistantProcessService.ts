import { FastifyBaseLogger } from "fastify";
import { OpenAiClientPort } from "../clients/openAiClient.js";
import { mapOpenAiError } from "../mappers/backendErrorMapper.js";
import { LuaAssistantPromptBuilder } from "../prompts/luaAssistantPromptBuilder.js";
import {
  AssistantEnvelope,
  AssistantProcessRequest,
  assistantEnvelopeSchema
} from "../types/lua-assistant.js";
import { createErrorEnvelope } from "../utils/errorEnvelope.js";
import { safeJsonParse } from "../utils/json.js";

export class AssistantProcessService {
  constructor(
    private readonly openAiClient: OpenAiClientPort,
    private readonly promptBuilder: LuaAssistantPromptBuilder,
    private readonly logger: FastifyBaseLogger
  ) {}

  async process(request: AssistantProcessRequest): Promise<AssistantEnvelope> {
    const startedAt = Date.now();

    try {
      this.logger.info(
        {
          textLength: request.text.length,
          locale: request.context.locale
        },
        "assistant process started"
      );

      const openAiResponse = await this.openAiClient.processAssistantText({
        systemInstructions: this.promptBuilder.buildSystemInstructions(),
        userInput: this.promptBuilder.buildUserInput(request)
      });

      this.logger.debug(
        {
          responseId: openAiResponse.responseId,
          durationMs: Date.now() - startedAt
        },
        "openai response received"
      );

      const parsed = safeJsonParse(openAiResponse.rawText);
      const validated = assistantEnvelopeSchema.safeParse(parsed);

      if (!validated.success) {
        this.logger.error(
          {
            issues: validated.error.issues,
            rawText: openAiResponse.rawText
          },
          "openai response failed final schema validation"
        );

        return createErrorEnvelope("O servidor retornou uma resposta invalida.");
      }

      return sanitizeEnvelope(validated.data);
    } catch (error) {
      const mapped = mapOpenAiError(error);

      this.logger.error(
        {
          code: mapped.code,
          message: mapped.message,
          details: mapped.details,
          durationMs: Date.now() - startedAt
        },
        "assistant process failed"
      );

      return createErrorEnvelope(mapped.message);
    }
  }
}

function sanitizeEnvelope(envelope: AssistantEnvelope): AssistantEnvelope {
  const normalizedCommands = envelope.commands.map((command) => ({
    ...command,
    target: command.target ?? "",
    payload: command.payload ?? {},
    preconditions: command.preconditions ?? [],
    fallback: command.fallback ?? null,
    requires_confirmation: command.requires_confirmation ?? false
  }));

  return {
    ...envelope,
    spoken_response: envelope.spoken_response ?? "",
    chat_response: envelope.chat_response ?? "",
    commands: normalizedCommands,
    metadata: {
      request_id: envelope.metadata.request_id || "unknown_request",
      timestamp: envelope.metadata.timestamp || new Date().toISOString()
    },
    error: envelope.error ?? null
  };
}
