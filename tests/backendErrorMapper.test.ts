import test from "node:test";
import assert from "node:assert/strict";
import OpenAI from "openai";
import { mapOpenAiError } from "../src/mappers/backendErrorMapper.js";

test("maps timeout error", () => {
  const mapped = mapOpenAiError(new OpenAI.APIConnectionTimeoutError({ message: "timeout" }));
  assert.equal(mapped.message, "A conexao com a OpenAI demorou mais que o esperado.");
});

test("maps authentication error", () => {
  const mapped = mapOpenAiError(
    new OpenAI.AuthenticationError(401, undefined, "invalid_api_key", {})
  );
  assert.equal(mapped.message, "A chave da OpenAI nao foi configurada corretamente no servidor.");
});

test("maps unexpected error", () => {
  const mapped = mapOpenAiError(new Error("boom"));
  assert.equal(mapped.message, "O backend encontrou uma falha inesperada.");
});
