import OpenAI from "openai";
import { getConfig, getOpenAiApiKey } from "../config/env.js";
import { luaAssistantJsonSchema } from "../schemas/luaAssistantSchema.js";
import { BackendServiceError } from "../mappers/backendErrorMapper.js";

export interface OpenAiProcessInput {
  systemInstructions: string;
  userInput: string;
}

export interface OpenAiProcessOutput {
  rawText: string;
  responseId?: string;
}

export interface OpenAiClientPort {
  processAssistantText(input: OpenAiProcessInput): Promise<OpenAiProcessOutput>;
}

export function buildResponsesRequest(
  model: string,
  input: OpenAiProcessInput
) {
  return {
    model,
    instructions: input.systemInstructions,
    input: input.userInput,
    text: {
      format: {
        type: "json_schema" as const,
        name: luaAssistantJsonSchema.name,
        schema: luaAssistantJsonSchema.schema,
        strict: luaAssistantJsonSchema.strict
      }
    }
  };
}

export class OpenAiClient implements OpenAiClientPort {
  private readonly client: OpenAI | null;
  private readonly model: string;

  constructor() {
    const config = getConfig();
    const apiKey = getOpenAiApiKey();
    this.model = config.OPENAI_MODEL;
    this.client = apiKey
      ? new OpenAI({
          apiKey,
          timeout: config.REQUEST_TIMEOUT_MS
        })
      : null;
  }

  async processAssistantText(input: OpenAiProcessInput): Promise<OpenAiProcessOutput> {
    if (!this.client) {
      throw new BackendServiceError(
        "OPENAI_MISSING_KEY",
        "A chave da OpenAI nao foi configurada no servidor."
      );
    }

    const requestPayload = buildResponsesRequest(this.model, input);

    try {
      const response = await this.client.responses.create(requestPayload);
      const rawText = response.output_text?.trim();

      if (!rawText) {
        throw new BackendServiceError(
          "OPENAI_INVALID_RESPONSE",
          "A OpenAI retornou uma resposta vazia."
        );
      }

      return {
        rawText,
        responseId: response.id
      };
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        throw new BackendServiceError(
          "OPENAI_UPSTREAM",
          "Nao consegui obter uma resposta valida da OpenAI.",
          200,
          {
            status: error.status,
            type: error.type,
            requestMethod: "responses.create",
            model: this.model,
            schemaName: luaAssistantJsonSchema.name,
            payloadKeys: Object.keys(requestPayload),
            textFormatKeys: Object.keys(requestPayload.text.format),
            errorMessage: sanitizeErrorMessage(error.message)
          }
        );
      }

      throw error;
    }
  }
}

function sanitizeErrorMessage(message: string): string {
  return message.replace(/sk-[A-Za-z0-9_-]+/g, "sk-[REDACTED]");
}
