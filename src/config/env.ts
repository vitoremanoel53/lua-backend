import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  OPENAI_API_KEY: z.string().trim().default(""),
  OPENAI_MODEL: z.string().trim().default("gpt-4.1"),
  REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().default(30000),
  CORS_ORIGIN: z.string().trim().default("*"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development")
});

export type AppConfig = z.infer<typeof envSchema>;

let cachedConfig: AppConfig | null = null;

export function getConfig(): AppConfig {
  if (cachedConfig) {
    return cachedConfig;
  }

  cachedConfig = envSchema.parse(process.env);
  return cachedConfig;
}

export function getOpenAiApiKey(): string {
  return (process.env.OPENAI_API_KEY ?? "").trim();
}
