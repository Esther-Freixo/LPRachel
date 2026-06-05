type Modulo = "Server" | "DB" | "Auth" | "Storage" | "Timeline";

function emit(level: "info" | "warn" | "error", modulo: Modulo, msg: string): void {
  const line = `[${modulo}] ${msg}`;
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  info: (modulo: Modulo, msg: string) => emit("info", modulo, msg),
  warn: (modulo: Modulo, msg: string) => emit("warn", modulo, msg),
  error: (modulo: Modulo, msg: string) => emit("error", modulo, msg),
};
