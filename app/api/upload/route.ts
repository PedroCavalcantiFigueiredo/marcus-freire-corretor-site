import { put } from "@vercel/blob"
import { NextResponse } from "next/server"
import sharp from "sharp"
import path from "path"
import fs from "fs"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 })
    }

    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Apenas imagens são permitidas" }, { status: 400 })
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Imagem muito grande. Máximo 5MB" }, { status: 400 })
    }

    // --- INÍCIO DA LÓGICA DA MARCA D'ÁGUA ---

    // 1. Define o caminho para a sua logo de marca d'água
    const watermarkPath = path.join(process.cwd(), "public", "logo.png")

    // Medida de segurança: verifica se o arquivo da logo realmente existe
    if (!fs.existsSync(watermarkPath)) {
      console.error("Arquivo da marca d'água não encontrado em:", watermarkPath)
      return NextResponse.json({ error: "Erro interno: Marca d'água não encontrada." }, { status: 500 })
    }

    // 2. Converte o arquivo enviado para um buffer (formato que o Sharp consegue ler)
    const imageBuffer = Buffer.from(await file.arrayBuffer())

    // 3. Usa a biblioteca Sharp para aplicar a marca d'água
    const watermarkedImageBuffer = await sharp(imageBuffer)
      .composite([
        {
          input: watermarkPath,
          gravity: "southeast", // Posição no canto inferior direito
        },
      ])
      .toBuffer()

    // --- FIM DA LÓGICA DA MARCA D'ÁGUA ---

    // 4. Fazer upload do buffer da imagem COM marca d'água para o Vercel Blob
    const blob = await put(file.name, watermarkedImageBuffer, {
      access: "public",
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("Erro no upload:", error)
    return NextResponse.json({ error: "Erro ao fazer upload da imagem" }, { status: 500 })
  }
}