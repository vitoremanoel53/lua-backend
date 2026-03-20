import pino from "pino";
import { getConfig } from "./env.js";

export function createLogger() {
  const config = getConfig();

  return pino({
    level: config.LOG_LEVEL,
    base: undefined,
    redact: {
      paths: ["req.headers.authorization", "headers.authorization", "openai.apiKey"],
      censor: "[REDACTED]"
    }
  });
}
