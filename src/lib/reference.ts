import { randomBytes } from "node:crypto";

export function createOrderReference() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `LRDA-${date}-${randomBytes(4).toString("hex").toUpperCase()}`;
}
