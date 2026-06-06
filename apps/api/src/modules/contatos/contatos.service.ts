import type { Contato as ContatoRow } from "@prisma/client";
import type { Contato, ContatoCreate } from "@rf/shared";
import * as repo from "./contatos.repository.js";

// Converte a linha do banco (createdAt: Date) para o DTO (createdAt: string ISO).
function toDTO(c: ContatoRow): Contato {
  return {
    id: c.id,
    nome: c.nome,
    email: c.email,
    assunto: c.assunto,
    mensagem: c.mensagem,
    createdAt: c.createdAt.toISOString(),
  };
}

export async function criarContato(data: ContatoCreate): Promise<Contato> {
  return toDTO(await repo.criarContato(data));
}
export async function listarContatos(): Promise<Contato[]> {
  return (await repo.listarContatos()).map(toDTO);
}
export async function removerContato(id: number): Promise<void> {
  return repo.removerContato(id);
}
