"use server"

import { sql } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

async function checkAuth() {
  const session = await auth()
  if (!session) throw new Error("Não autorizado")
  return session
}

export async function getImoveis() {
  await checkAuth()
  try {
    const data = await sql`
      SELECT * FROM imoveis ORDER BY created_at DESC
    `
    return { data }
  } catch (error) {
    console.error("Erro ao buscar imóveis:", error)
    return { error: "Erro ao buscar imóveis" }
  }
}

export async function getContatos() {
  await checkAuth()
  try {
    const data = await sql`
      SELECT * FROM contatos ORDER BY created_at DESC
    `
    return { data }
  } catch (error) {
    console.error("Erro ao buscar contatos:", error)
    return { error: "Erro ao buscar contatos" }
  }
}

export async function saveImovel(data: any, id?: string) {
  await checkAuth()
  try {
    if (id) {
      await sql`
        UPDATE imoveis SET
          titulo = ${data.titulo},
          tipo = ${data.tipo},
          preco = ${data.preco},
          localizacao = ${data.localizacao},
          quartos = ${data.quartos},
          banheiros = ${data.banheiros},
          area = ${data.area},
          imagem = ${data.imagem},
          imagens = ${data.imagens},
          destaque = ${data.destaque},
          garagem_coberta = ${data.garagem_coberta},
          suites = ${data.suites},
          informacoes_adicionais = ${data.informacoes_adicionais},
          contato_proprietario = ${data.contato_proprietario},
          updated_at = NOW()
        WHERE id = ${id}
      `
    } else {
      await sql`
        INSERT INTO imoveis (
          titulo, tipo, preco, localizacao, quartos, banheiros, area, imagem, imagens, destaque, garagem_coberta, suites, informacoes_adicionais, contato_proprietario
        ) VALUES (
          ${data.titulo}, ${data.tipo}, ${data.preco}, ${data.localizacao}, ${data.quartos}, ${data.banheiros}, ${data.area}, ${data.imagem}, ${data.imagens}, ${data.destaque}, ${data.garagem_coberta}, ${data.suites}, ${data.informacoes_adicionais}, ${data.contato_proprietario}
        )
      `
    }
    revalidatePath("/admin/dashboard")
    revalidatePath("/imoveis")
    return { success: true }
  } catch (error) {
    console.error("Erro ao salvar imóvel:", error)
    return { error: "Erro ao salvar imóvel" }
  }
}

export async function deleteImovel(id: string) {
  await checkAuth()
  try {
    await sql`DELETE FROM imoveis WHERE id = ${id}`
    revalidatePath("/admin/dashboard")
    revalidatePath("/imoveis")
    return { success: true }
  } catch (error) {
    console.error("Erro ao excluir imóvel:", error)
    return { error: "Erro ao excluir imóvel" }
  }
}

export async function markContatoAsRead(id: string) {
  await checkAuth()
  try {
    await sql`UPDATE contatos SET lida = true WHERE id = ${id}`
    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Erro ao marcar contato como lida:", error)
    return { error: "Erro ao marcar contato como lida" }
  }
}

export async function deleteContato(id: string) {
  await checkAuth()
  try {
    await sql`DELETE FROM contatos WHERE id = ${id}`
    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Erro ao excluir contato:", error)
    return { error: "Erro ao excluir contato" }
  }
}
