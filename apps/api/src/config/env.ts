import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3333),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(16),
  CORS_ORIGIN: z.string().default("http://localhost:5174"),
  ADMIN_EMAIL: z.string().email().default("rachel@exemplo.com"),
  ADMIN_SENHA: z.string().min(6).default("trocar-no-deploy"),
  // E-mail (Resend) para recuperação de senha. Sem a key, o link é apenas logado (dev).
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM: z.string().default("Professora Esther <onboarding@resend.dev>"),
  APP_URL: z.string().url().default("http://localhost:5173"),
});

export type Env = z.infer<typeof envSchema>;

// Valida o ambiente. Em caso de erro, NÃO usa fallback — falha rápido.
export function parseEnv(source: NodeJS.ProcessEnv | Record<string, unknown>): Env {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`[env] configuração inválida — ${issues}`);
  }
  return result.data;
}

// Carrega a partir de process.env. Importado pelo server; encerra o processo se inválido.
export function loadEnv(): Env {
  try {
    return parseEnv(process.env);
  } catch (err) {
    console.error(String(err));
    process.exit(1);
  }
}
