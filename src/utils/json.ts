export function safeJsonParse(value: string): unknown {
  return JSON.parse(value);
}
