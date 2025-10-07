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

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Apenas imagens são permitidas" }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Imagem muito grande. Máximo 5MB" }, { status: 400 })
    }

    const watermarkPath = path.join(process.cwd(), "public", "logo.png")

    if (!fs.existsSync(watermarkPath)) {
      console.error("Arquivo da marca d'água não encontrado em:", watermarkPath)
      return NextResponse.json({ error: "Erro interno: Marca d'água não encontrada." }, { status: 500 })
    }

    const imageBuffer = Buffer.from(await file.arrayBuffer())

    // --- LÓGICA DE REDIMENSIONAMENTO AUTOMÁTICO DA LOGO ---

    // 1. Pega as dimensões da imagem principal que o usuário enviou
    const imageMetadata = await sharp(imageBuffer).metadata()
    const imageWidth = imageMetadata.width

    if (!imageWidth) {
      throw new Error("Não foi possível ler as dimensões da imagem enviada.")
    }

    // 2. Calcula a largura máxima que a logo deve ter (ex: 35% da imagem principal)
    const watermarkMaxWidth = Math.floor(imageWidth * 0.35)

    // 3. Cria um buffer da logo, redimensionando-a para o tamanho calculado.
    // O 'fit: "inside"' garante que a logo só será diminuída, nunca aumentada.
    const watermarkBuffer = await sharp(watermarkPath)
      .resize({
        width: watermarkMaxWidth,
        fit: "inside",
      })
      .toBuffer()

    // --- FIM DA NOVA LÓGICA ---

    // 4. Aplica a logo JÁ REDIMENSIONADA na imagem principal
    const watermarkedImageBuffer = await sharp(imageBuffer)
      .composite([
        {
          input: watermarkBuffer, // Usamos o buffer da logo redimensionada
          gravity: "northwest",
        },
      ])
      .toBuffer()

    const blob = await put(file.name, watermarkedImageBuffer, {
      access: "public",
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("Erro no upload:", error)
    return NextResponse.json({ error: "Erro ao fazer upload da imagem" }, { status: 500 })
  }
}