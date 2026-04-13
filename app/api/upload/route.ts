import { NextResponse } from "next/server"
import cloudinary from "@/lib/cloudinary"

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

    if (file.size > 10 * 1024 * 1024) { // Cloudinary permite arquivos maiores, ajustei para 10MB
      return NextResponse.json({ error: "Imagem muito grande. Máximo 10MB" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload para o Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "imoveis",
          // Adicionando transformação automática de marca d'água no upload (eager)
          // ou simplesmente salvando o original e aplicando na URL depois.
          // Aqui vamos salvar o original e retornar a URL com a transformação aplicada.
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    }) as any

    // Gerar URL com marca d'água usando transformações automáticas do Cloudinary
    // l_system:site_logo -> sobrepõe a imagem 'system/site_logo'
    // g_south -> posiciona no sul (baixo)
    // w_0.2 -> escala a logo para 20% da largura da imagem original
    // o_70 -> opacidade de 70%
    const watermarkedUrl = cloudinary.url(uploadResponse.public_id, {
      transformation: [
        { width: 1200, crop: "limit" }, // Redimensionamento básico para otimização
        { overlay: "system:site_logo", gravity: "south", width: "0.2", opacity: 70, y: 20 },
        { fetch_format: "auto", quality: "auto" } // Otimização automática
      ]
    })

    return NextResponse.json({ url: watermarkedUrl, public_id: uploadResponse.public_id })
  } catch (error) {
    console.error("Erro no upload:", error)
    return NextResponse.json({ error: "Erro ao fazer upload da imagem" }, { status: 500 })
  }
}