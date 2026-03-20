import test from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../src/app.js";
import { OpenAiClientPort } from "../src/clients/openAiClient.js";

test("POST /assistant/process returns Lua schema payload", async () => {
  const client: OpenAiClientPort = {
    async processAssistantText() {
      return {
        rawText: JSON.stringify({
          mode: "ACTION",
          spoken_response: "Abrindo o YouTube.",
          chat_response: "Comando reconhecido: abrir YouTube.",
          requires_confirmation: false,
          confidence: 0.93,
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
        })
      };
    }
  };

  const app = await buildApp({ openAiClient: client });

  const response = await app.inject({
    method: "POST",
    url: "/assistant/process",
    payload: {
      text: "abrir youtube",
      context: {
        locale: "pt-BR",
        app_version: "1.0.0",
        device_info: "Android",
        last_user_utterance: "abrir youtube",
        conversation_summary: "home"
      }
    }
  });

  assert.equal(response.statusCode, 200);
  assert.equal(response.json().mode, "ACTION");

  await app.close();
});

test("POST /assistant/process rejects invalid request", async () => {
  const app = await buildApp();

  const response = await app.inject({
    method: "POST",
    url: "/assistant/process",
    payload: {
      text: "",
      context: {
        locale: "pt-BR",
        app_version: "1.0.0",
        device_info: "Android",
        last_user_utterance: "",
        conversation_summary: ""
      }
    }
  });

  assert.equal(response.statusCode, 400);
  assert.equal(response.json().error, "INVALID_REQUEST");

  await app.close();
});
