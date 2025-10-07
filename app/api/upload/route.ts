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

    // --- CORREÇÃO APLICADA AQUI ---
    // Alterado de "logo-watermark.png" para "logo.png" para corresponder ao seu arquivo.
    const watermarkPath = path.join(process.cwd(), "public", "logo.png")

    if (!fs.existsSync(watermarkPath)) {
      console.error("Arquivo da marca d'água não encontrado em:", watermarkPath)
      return NextResponse.json({ error: "Erro interno: Marca d'água não encontrada." }, { status: 500 })
    }

    const imageBuffer = Buffer.from(await file.arrayBuffer())

    const watermarkedImageBuffer = await sharp(imageBuffer)
      .composite([
        {
          input: watermarkPath,
          gravity: "southeast",
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