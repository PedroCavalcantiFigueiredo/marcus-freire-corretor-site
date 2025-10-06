"use client"

import type React from "react"
// 1. Importações necessárias do React e Next.js
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

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
  })
  const [sending, setSending] = useState(false)
  const supabase = getSupabaseBrowserClient()

  // 2. Lógica para ler o ID da URL e buscar o título
  const searchParams = useSearchParams()
  const imovelId = searchParams.get("imovel")
  const [imovelTitulo, setImovelTitulo] = useState("")

  useEffect(() => {
    const fetchImovelTitulo = async () => {
      if (imovelId) {
        setImovelTitulo("Carregando nome do imóvel...")
        const { data: imovel, error } = await supabase
          .from("imoveis")
          .select("titulo")
          .eq("id", imovelId)
          .single()

        if (error) {
          console.error("Erro ao buscar imóvel:", error)
          setImovelTitulo("Imóvel não encontrado")
        } else if (imovel) {
          setImovelTitulo(imovel.titulo)
        }
      }
    }
    fetchImovelTitulo()
  }, [imovelId, supabase])

  // 3. Lógica para preencher a mensagem para o usuário
  useEffect(() => {
    if (imovelTitulo && imovelTitulo !== "Carregando nome do imóvel...") {
      setFormData((prevData) => ({
        ...prevData,
        mensagem: `Olá, tenho interesse no imóvel "${imovelTitulo}". Gostaria de mais informações.`,
      }))
    }
  }, [imovelTitulo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)

    // 4. Preparar a mensagem final para o administrador
    const mensagemFinal = imovelTitulo
      ? `Imóvel de Interesse: ${imovelTitulo} (ID: ${imovelId})\n\n---\n\n${formData.mensagem}`
      : formData.mensagem

    try {
      const { error } = await supabase.from("contatos").insert([
        {
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          mensagem: mensagemFinal, // Envia a mensagem com os detalhes do imóvel
        },
      ])

      if (error) throw error

      alert("Mensagem enviada com sucesso! Em breve entrarei em contato.")
      setFormData({ nome: "", email: "", telefone: "", mensagem: "" })
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

  // O JSX (parte visual) continua o mesmo
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
            {/* Informações de Contato */}
            <div className="space-y-6">
              <Card className="p-6 space-y-4">
                {/* ... conteúdo do card ... */}
              </Card>
              {/* ... outros cards ... */}
            </div>

            {/* Formulário */}
            <Card className="lg:col-span-2 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      placeholder="Seu nome"
                      required
                      disabled={sending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="seu@email.com"
                      required
                      disabled={sending}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input
                    id="telefone"
                    name="telefone"
                    type="tel"
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="(35) 99999-9999"
                    required
                    disabled={sending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mensagem">Mensagem *</Label>
                  <Textarea
                    id="mensagem"
                    name="mensagem"
                    value={formData.mensagem}
                    onChange={handleChange}
                    placeholder="Conte-me sobre o imóvel que você procura ou qualquer dúvida que tenha..."
                    rows={6}
                    required
                    disabled={sending}
                  />
                </div>
                <Button type="submit" size="lg" className="w-full gap-2" disabled={sending}>
                  <Send className="w-4 h-4" />
                  {sending ? "Enviando..." : "Enviar Mensagem"}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Ao enviar este formulário, você concorda em ser contatado por Marcus Freire sobre imóveis e serviços
                  relacionados.
                </p>
              </form>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}