import OpenAI from "openai";

export class BackendServiceError extends Error {
  constructor(
    public readonly code:
      | "OPENAI_TIMEOUT"
      | "OPENAI_MISSING_KEY"
      | "OPENAI_INVALID_RESPONSE"
      | "OPENAI_UPSTREAM"
      | "REQUEST_INVALID"
      | "UNEXPECTED",
    message: string,
    public readonly statusCode = 200,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "BackendServiceError";
  }
}

export function mapOpenAiError(error: unknown): BackendServiceError {
  if (error instanceof BackendServiceError) {
    return error;
  }

  if (error instanceof OpenAI.APIConnectionTimeoutError) {
    return new BackendServiceError(
      "OPENAI_TIMEOUT",
      "A conexao com a OpenAI demorou mais que o esperado."
    );
  }

  if (error instanceof OpenAI.AuthenticationError) {
    return new BackendServiceError(
      "OPENAI_MISSING_KEY",
      "A chave da OpenAI nao foi configurada corretamente no servidor."
    );
  }

  if (error instanceof OpenAI.APIError) {
    return new BackendServiceError(
      "OPENAI_UPSTREAM",
      "Nao consegui obter uma resposta valida da OpenAI.",
      200,
      {
        status: error.status,
        type: error.type
      }
    );
  }

  if (error instanceof SyntaxError) {
    return new BackendServiceError(
      "OPENAI_INVALID_RESPONSE",
      "A OpenAI retornou uma resposta invalida."
    );
  }

  return new BackendServiceError(
    "UNEXPECTED",
    "O backend encontrou uma falha inesperada."
  );
}
