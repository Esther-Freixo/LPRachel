import argon2 from "argon2";
import { prisma } from "../../db/prisma.js";

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
