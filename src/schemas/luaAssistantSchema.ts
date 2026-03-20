export const luaAssistantJsonSchema = {
  name: "lua_assistant",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: [
      "mode",
      "spoken_response",
      "chat_response",
      "requires_confirmation",
      "confidence",
      "commands",
      "metadata",
      "error"
    ],
    properties: {
      mode: {
        type: "string",
        enum: ["CHAT", "ACTION", "MIXED", "ERROR"]
      },
      spoken_response: {
        type: "string"
      },
      chat_response: {
        type: "string"
      },
      requires_confirmation: {
        type: "boolean"
      },
      confidence: {
        type: "number",
        minimum: 0,
        maximum: 1
      },
      commands: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: [
            "type",
            "target",
            "payload",
            "requires_confirmation",
            "preconditions",
            "fallback"
          ],
          properties: {
            type: {
              type: "string",
              enum: [
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
              ]
            },
            target: {
              type: "string"
            },
            payload: {
              type: "object",
              additionalProperties: false,
              required: [
                "package",
                "app_name",
                "query",
                "title",
                "note",
                "dueAt",
                "screen",
                "uri",
                "text",
                "destination",
                "section"
              ],
              properties: {
                package: {
                  type: ["string", "null"]
                },
                app_name: {
                  type: ["string", "null"]
                },
                query: {
                  type: ["string", "null"]
                },
                title: {
                  type: ["string", "null"]
                },
                note: {
                  type: ["string", "null"]
                },
                dueAt: {
                  type: ["string", "null"]
                },
                screen: {
                  type: ["string", "null"]
                },
                uri: {
                  type: ["string", "null"]
                },
                text: {
                  type: ["string", "null"]
                },
                destination: {
                  type: ["string", "null"]
                },
                section: {
                  type: ["string", "null"]
                }
              }
            },
            requires_confirmation: {
              type: "boolean"
            },
            preconditions: {
              type: "array",
              items: {
                type: "string"
              }
            },
            fallback: {
              type: ["string", "null"]
            }
          }
        }
      },
      metadata: {
        type: "object",
        additionalProperties: false,
        required: ["request_id", "timestamp"],
        properties: {
          request_id: {
            type: "string"
          },
          timestamp: {
            type: "string"
          }
        }
      },
      error: {
        type: ["string", "null"]
      }
    }
  }
} as const;
