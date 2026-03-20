import test from "node:test";
import assert from "node:assert/strict";
import {
  assistantEnvelopeSchema,
  assistantProcessRequestSchema
} from "../src/schemas/assistantProcessSchemas.js";

test("assistant request schema validates valid payload", () => {
  const parsed = assistantProcessRequestSchema.safeParse({
    text: "abrir youtube",
    context: {
      locale: "pt-BR",
      app_version: "1.0.0",
      device_info: "Android",
      last_user_utterance: "abrir youtube",
      conversation_summary: "home"
    }
  });

  assert.equal(parsed.success, true);
});

test("assistant request schema rejects empty text", () => {
  const parsed = assistantProcessRequestSchema.safeParse({
    text: "",
    context: {
      locale: "pt-BR",
      app_version: "1.0.0",
      device_info: "Android",
      last_user_utterance: "",
      conversation_summary: ""
    }
  });

  assert.equal(parsed.success, false);
});

test("assistant envelope schema validates valid response", () => {
  const parsed = assistantEnvelopeSchema.safeParse({
    mode: "ACTION",
    spoken_response: "Abrindo o YouTube.",
    chat_response: "Comando reconhecido.",
    requires_confirmation: false,
    confidence: 0.9,
    commands: [
      {
        type: "OPEN_APP",
        target: "youtube",
        payload: {
          package: "com.google.android.youtube"
        },
        requires_confirmation: false,
        preconditions: [],
        fallback: null
      }
    ],
    metadata: {
      request_id: "req-1",
      timestamp: new Date().toISOString()
    },
    error: null
  });

  assert.equal(parsed.success, true);
});
