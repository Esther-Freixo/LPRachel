import { describe, it, expect } from "vitest";
import { parseEnv } from "./env.js";

describe("parseEnv", () => {
  it("retorna config válida quando DATABASE_URL e JWT_SECRET existem", () => {
    const env = parseEnv({
      DATABASE_URL: "postgresql://u:p@localhost:5432/db",
      JWT_SECRET: "x".repeat(16),
      PORT: "3333",
    });
    expect(env.PORT).toBe(3333);
    expect(env.DATABASE_URL).toContain("postgresql://");
  });

  it("lança erro quando falta DATABASE_URL", () => {
    expect(() => parseEnv({ JWT_SECRET: "x".repeat(16) })).toThrow();
  });
});
