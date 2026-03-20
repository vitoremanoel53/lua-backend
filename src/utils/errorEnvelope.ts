import { AssistantEnvelope } from "../types/lua-assistant.js";
import { createRequestId } from "./requestId.js";

export function createErrorEnvelope(message: string): AssistantEnvelope {
  return {
    mode: "ERROR",
    spoken_response: message,
    chat_response: message,
    requires_confirmation: false,
    confidence: 0,
    commands: [],
    metadata: {
      request_id: createRequestId(),
      timestamp: new Date().toISOString()
    },
    error: message
  };
}
