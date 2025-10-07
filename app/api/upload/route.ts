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

    const imageMetadata = await sharp(imageBuffer).metadata()
    const imageWidth = imageMetadata.width

    if (!imageWidth) {
      throw new Error("Não foi possível ler as dimensões da imagem enviada.")
    }

    const watermarkMaxWidth = Math.floor(imageWidth * 0.20)

    const watermarkBuffer = await sharp(watermarkPath)
      .resize({
        width: watermarkMaxWidth,
        fit: "inside",
      })
      .toBuffer()

    const watermarkedImageBuffer = await sharp(imageBuffer)
      .composite([
        {
          input: watermarkBuffer,
          gravity: "northwest",
        },
      ])
      .toBuffer()

    const blob = await put(file.name, watermarkedImageBuffer, {
      access: "public",
      // --- SOLUÇÃO ADICIONADA AQUI ---
      // Garante que cada arquivo tenha um nome único, evitando o erro.
      addRandomSuffix: true,
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("Erro no upload:", error)
    return NextResponse.json({ error: "Erro ao fazer upload da imagem" }, { status: 500 })
  }
}