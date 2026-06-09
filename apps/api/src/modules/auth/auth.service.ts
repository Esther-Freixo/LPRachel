import argon2 from "argon2";
import crypto from "node:crypto";
import { prisma } from "../../db/prisma.js";

const RESET_TTL_MS = 60 * 60 * 1000; // 1 hora

export interface Credenciais {
  email: string;
  senha: string;
}

export interface UsuarioAutenticado {
  id: number;
  email: string;
  papel: string;
}

// Retorna o usuário se as credenciais conferem; senão null.
export async function validarCredenciais(c: Credenciais): Promise<UsuarioAutenticado | null> {
  const usuario = await prisma.usuario.findUnique({ where: { email: c.email } });
  if (!usuario) return null;
  const ok = await argon2.verify(usuario.senhaHash, c.senha);
  if (!ok) return null;
  return { id: usuario.id, email: usuario.email, papel: usuario.papel };
}

export async function buscarPorEmail(email: string) {
  return prisma.usuario.findUnique({ where: { email } });
}

// Token de reset stateless e single-use: assinado com JWT_SECRET + senhaHash atual.
// Ao trocar a senha, o hash muda e qualquer token anterior deixa de valer.
function segredoReset(senhaHash: string): string {
  const base = process.env.JWT_SECRET;
  if (!base) throw new Error("[auth] JWT_SECRET ausente");
  return `${base}:${senhaHash}`;
}

export function gerarTokenReset(usuario: { id: number; senhaHash: string }): string {
  const payload = Buffer.from(
    JSON.stringify({ uid: usuario.id, exp: Date.now() + RESET_TTL_MS }),
  ).toString("base64url");
  const sig = crypto.createHmac("sha256", segredoReset(usuario.senhaHash)).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export async function verificarTokenReset(token: string) {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  let dados: { uid?: number; exp?: number };
  try {
    dados = JSON.parse(Buffer.from(payload, "base64url").toString());
  } catch {
    return null;
  }
  if (!dados.uid || !dados.exp || Date.now() > dados.exp) return null;
  const usuario = await prisma.usuario.findUnique({ where: { id: dados.uid } });
  if (!usuario) return null;
  const esperado = crypto.createHmac("sha256", segredoReset(usuario.senhaHash)).update(payload).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(esperado);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return usuario;
}

export async function atualizarSenha(id: number, novaSenha: string): Promise<void> {
  const senhaHash = await argon2.hash(novaSenha);
  await prisma.usuario.update({ where: { id }, data: { senhaHash } });
}
