import { z } from "zod";

export const assistantModeValues = ["CHAT", "ACTION", "MIXED", "ERROR"] as const;
export const commandTypeValues = [
  "OPEN_APP",
  "WEB_SEARCH",
  "SEARCH_IN_APP",
  "OPEN_DEEP_LINK",
  "SHARE_TEXT",
  "NAVIGATE_TO",
  "PLAY_MEDIA",
  "OPEN_APP_SECTION",
  "OPEN_SCREEN",
  "CREATE_REMINDER",
  "SEND_MESSAGE",
  "MAKE_CALL",
  "MEDIA_CONTROL",
  "SET_DEVICE_SETTING",
  "UNKNOWN"
] as const;

export const assistantProcessRequestSchema = z.object({
  text: z.string().trim().min(1, "text e obrigatorio"),
  context: z.object({
    locale: z.string().trim().default("pt-BR"),
    app_version: z.string().trim().default("unknown"),
    device_info: z.string().trim().default("unknown"),
    last_user_utterance: z.string().trim().default(""),
    conversation_summary: z.string().trim().default("")
  })
});

export const assistantCommandSchema = z.object({
  type: z.enum(commandTypeValues),
  target: z.string().trim().default(""),
  payload: z.record(z.unknown()).default({}),
  requires_confirmation: z.boolean().default(false),
  preconditions: z.array(z.string()).default([]),
  fallback: z.string().nullable().default(null)
});

export const assistantEnvelopeSchema = z.object({
  mode: z.enum(assistantModeValues),
  spoken_response: z.string().default(""),
  chat_response: z.string().default(""),
  requires_confirmation: z.boolean().default(false),
  confidence: z.number().min(0).max(1).default(0),
  commands: z.array(assistantCommandSchema).default([]),
  metadata: z.object({
    request_id: z.string().default(""),
    timestamp: z.string().default("")
  }),
  error: z.string().nullable().default(null)
});

export type AssistantProcessRequest = z.infer<typeof assistantProcessRequestSchema>;
export type AssistantEnvelope = z.infer<typeof assistantEnvelopeSchema>;
export type AssistantCommand = z.infer<typeof assistantCommandSchema>;
