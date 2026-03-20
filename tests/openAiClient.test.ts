import test from "node:test";
import assert from "node:assert/strict";
import { buildResponsesRequest } from "../src/clients/openAiClient.js";
import { luaAssistantJsonSchema } from "../src/schemas/luaAssistantSchema.js";

test("builds responses api payload with instructions input and text.format", () => {
  const payload = buildResponsesRequest("gpt-4.1", {
    systemInstructions: "instrucao de sistema",
    userInput: "abrir youtube"
  });

  assert.equal(payload.model, "gpt-4.1");
  assert.equal(payload.instructions, "instrucao de sistema");
  assert.equal(payload.input, "abrir youtube");
  assert.equal(payload.text.format.type, "json_schema");
  assert.equal(payload.text.format.name, "lua_assistant");
});

test("lua assistant schema name is compatible", () => {
  assert.match(luaAssistantJsonSchema.name, /^[A-Za-z0-9_-]+$/);
  assert.ok(luaAssistantJsonSchema.name.length <= 64);
});

test("payload schema keeps strict top level object", () => {
  assert.equal(luaAssistantJsonSchema.strict, true);
  assert.equal(luaAssistantJsonSchema.schema.type, "object");
  assert.equal(luaAssistantJsonSchema.schema.additionalProperties, false);
});
