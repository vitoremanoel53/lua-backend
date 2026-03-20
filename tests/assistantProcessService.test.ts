import test from "node:test";
import assert from "node:assert/strict";
import pino from "pino";
import { AssistantProcessService } from "../src/services/assistantProcessService.js";
import { LuaAssistantPromptBuilder } from "../src/prompts/luaAssistantPromptBuilder.js";
import { OpenAiClientPort } from "../src/clients/openAiClient.js";

test("service returns validated envelope on success", async () => {
  const client: OpenAiClientPort = {
    async processAssistantText() {
      return {
        rawText: JSON.stringify({
          mode: "CHAT",
          spoken_response: "Oi. Eu sou a Lua.",
          chat_response: "Oi. Eu sou a Lua.",
          requires_confirmation: false,
          confidence: 0.98,
          commands: [],
          metadata: {
            request_id: "req-1",
            timestamp: new Date().toISOString()
          },
          error: null
        })
      };
    }
  };

  const service = new AssistantProcessService(
    client,
    new LuaAssistantPromptBuilder(),
    pino({ enabled: false })
  );

  const result = await service.process({
    text: "oi lua",
    context: {
      locale: "pt-BR",
      app_version: "1.0.0",
      device_info: "Android",
      last_user_utterance: "oi lua",
      conversation_summary: ""
    }
  });

  assert.equal(result.mode, "CHAT");
  assert.equal(result.error, null);
});

test("service returns controlled error when openai returns invalid payload", async () => {
  const client: OpenAiClientPort = {
    async processAssistantText() {
      return {
        rawText: JSON.stringify({
          mode: "BROKEN"
        })
      };
    }
  };

  const service = new AssistantProcessService(
    client,
    new LuaAssistantPromptBuilder(),
    pino({ enabled: false })
  );

  const result = await service.process({
    text: "abrir youtube",
    context: {
      locale: "pt-BR",
      app_version: "1.0.0",
      device_info: "Android",
      last_user_utterance: "abrir youtube",
      conversation_summary: ""
    }
  });

  assert.equal(result.mode, "ERROR");
  assert.equal(result.error, "O servidor retornou uma resposta invalida.");
});
