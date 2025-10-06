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

// Definimos um tipo para os detalhes do imóvel que vamos buscar
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

  const [imovelDetalhes, setImovelDetalhes] = useState<ImovelDetalhes | null>(null)
  const [loadingImovel, setLoadingImovel] = useState(false)

  useEffect(() => {
    const fetchImovelDetalhes = async () => {
      if (imovelId) {
        setLoadingImovel(true)
        
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

    // AQUI ESTÁ A LÓGICA PRINCIPAL - MONTANDO A MENSAGEM FINAL
    let mensagemFinal = formData.mensagem

    if (imovelDetalhes && imovelId) {
      const infoImovel = `Imóvel de Interesse:\n- ID: ${imovelId}\n- Nome: ${imovelDetalhes.titulo}\n- Localização: ${imovelDetalhes.localizacao}\n\n---\n\n`
      mensagemFinal = infoImovel + formData.mensagem
    }

    try {
      const { error } = await supabase.from("contatos").insert([
        {
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          mensagem: mensagemFinal, // Enviamos a mensagem formatada
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

  // O resto do JSX (parte visual) continua o mesmo
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
            <div className="space-y-6">
              <Card className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium">Telefone</div>
                    <a
                      href="tel:+5535988077707"
                      className="text-sm text-muted-foreground hover:text-accent transition-colors block"
                    >
                      (35) 99880-7707
                    </a>
                    <p className="text-xs text-muted-foreground">Seg - Sex: 9h às 18h</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium">E-mail</div>
                    <a
                      href="mailto:marcusmfreire@gmail.com"
                      className="text-sm text-muted-foreground hover:text-accent transition-colors block break-all"
                    >
                      marcusmfreire@gmail.com
                    </a>
                    <p className="text-xs text-muted-foreground">Respondo em até 24h</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium">Localização</div>
                    <p className="text-sm text-muted-foreground">
                      Pouso Alegre - MG
                      <br />
                      Atendimento em toda região
                    </p>
                  </div>
                </div>
              </Card>
            </div>
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
                    placeholder={
                      loadingImovel
                        ? "A carregar detalhes do imóvel..."
                        : "Conte-me sobre o imóvel que você procura ou qualquer dúvida que tenha..."
                    }
                    rows={6}
                    required
                    disabled={sending || loadingImovel}
                  />
                </div>
                <Button type="submit" size="lg" className="w-full gap-2" disabled={sending || loadingImovel}>
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