import { randomUUID } from "node:crypto";

export function createRequestId(): string {
  return `lua_${randomUUID()}`;
}
