"use server"

import { sql } from "@/lib/db"

export async function getImovelDetalhes(id: string) {
  try {
    const data = await sql`
      SELECT titulo, localizacao FROM imoveis WHERE id = ${id}
    `
    return { data: data[0] }
  } catch (error) {
    console.error("Erro ao buscar detalhes do imóvel:", error)
    return { error: "Erro ao buscar detalhes do imóvel" }
  }
}

export async function sendContato(data: { nome: string; email: string; telefone: string; mensagem: string }) {
  try {
    await sql`
      INSERT INTO contatos (nome, email, telefone, mensagem)
      VALUES (${data.nome}, ${data.email}, ${data.telefone}, ${data.mensagem})
    `
    return { success: true }
  } catch (error) {
    console.error("Erro ao enviar contato:", error)
    return { error: "Erro ao enviar contato" }
  }
}
