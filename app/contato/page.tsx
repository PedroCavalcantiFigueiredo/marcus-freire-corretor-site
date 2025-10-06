"use client"

import type React from "react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Send } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

// 1. Definimos um tipo para os detalhes do imóvel que vamos buscar
type ImovelDetalhes = {
  titulo: string
  localizacao: string
}

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
  })
  const [sending, setSending] = useState(false)
  const supabase = getSupabaseBrowserClient()

  const searchParams = useSearchParams()
  const imovelId = searchParams.get("imovel")

  // 2. Usamos um único estado para guardar os detalhes do imóvel
  const [imovelDetalhes, setImovelDetalhes] = useState<ImovelDetalhes | null>(null)
  const [loadingImovel, setLoadingImovel] = useState(false)

  useEffect(() => {
    const fetchImovelDetalhes = async () => {
      if (imovelId) {
        setLoadingImovel(true)
        
        // 3. Buscamos o título E a localização
        const { data: imovel, error } = await supabase
          .from("imoveis")
          .select("titulo, localizacao") 
          .eq("id", imovelId)
          .single()

        if (error) {
          console.error("Erro ao buscar detalhes do imóvel:", error)
        } else if (imovel) {
          setImovelDetalhes(imovel)
        }
        setLoadingImovel(false)
      }
    }

    fetchImovelDetalhes()
  }, [imovelId, supabase])

  useEffect(() => {
    if (imovelDetalhes) {
      setFormData((prevData) => ({
        ...prevData,
        mensagem: `Olá, tenho interesse no imóvel "${imovelDetalhes.titulo}". Gostaria de mais informações.`,
      }))
    }
  }, [imovelDetalhes])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)

    // 4. Montamos a mensagem final com o título E a localização
    const mensagemFinal = imovelDetalhes
      ? `Imóvel de Interesse: ${imovelDetalhes.titulo} - ${imovelDetalhes.localizacao} (ID: ${imovelId})\n\n---\n\n${formData.mensagem}`
      : formData.mensagem

    try {
      const { error } = await supabase.from("contatos").insert([
        {
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          mensagem: mensagemFinal,
        },
      ])

      if (error) throw error

      alert("Mensagem enviada com sucesso! Em breve entrarei em contato.")
      setFormData({ nome: "", email: "", telefone: "", mensagem: "" })
      // Limpa os detalhes do imóvel também, se necessário, embora o redirect resolva
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error)
      alert("Erro ao enviar mensagem. Tente novamente.")
    } finally {
      setSending(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // O resto do JSX continua exatamente igual
  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 space-y-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-balance">Entre em Contato</h1>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Tem interesse em algum imóvel ou precisa de ajuda? Preencha o formulário abaixo e entrarei em contato o
              mais breve possível.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="space-y-6">{/* Cards de Informação */}</div>

            <Card className="lg:col-span-2 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* O JSX do formulário não precisa de alterações */}
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* ... campos nome e email ... */}
                </div>
                {/* ... campo telefone ... */}
                <div className="space-y-2">
                  <Label htmlFor="mensagem">Mensagem *</Label>
                  <Textarea
                    id="mensagem"
                    name="mensagem"
                    value={formData.mensagem}
                    onChange={handleChange}
                    placeholder={loadingImovel ? "A carregar detalhes do imóvel..." : "Conte-me sobre o imóvel que você procura ou qualquer dúvida que tenha..."}
                    rows={6}
                    required
                    disabled={sending || loadingImovel}
                  />
                </div>
                <Button type="submit" size="lg" className="w-full gap-2" disabled={sending || loadingImovel}>
                  <Send className="w-4 h-4" />
                  {sending ? "Enviando..." : "Enviar Mensagem"}
                </Button>
                {/* ... resto do formulário ... */}
              </form>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}