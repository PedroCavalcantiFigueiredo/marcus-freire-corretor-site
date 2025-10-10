"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  LogOut,
  Plus,
  Pencil,
  Trash2,
  X,
  Bed,
  Bath,
  Square,
  MapPin,
  Upload,
  Car,
  Home,
  MessageSquare,
  Mail,
  Phone,
  Clock,
} from "lucide-react"
import Image from "next/image"
import { ImageCarousel } from "@/components/image-carousel"
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext, useSortable, rectSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

type Imovel = {
  id: string
  titulo: string
  tipo: string
  preco: string
  localizacao: string
  quartos: number
  banheiros: number
  area: number
  imagem: string | null
  imagens: string[] | null
  destaque: boolean
  garagem_coberta: boolean
  suites: number
  informacoes_adicionais?: string
}

type Contato = {
  id: string
  nome: string
  email: string
  telefone: string
  mensagem: string
  lida: boolean
  created_at: string
}

type SortableImageProps = {
  url: string
  index: number
  handleRemoveImage: (index: number) => void
}

const SortableImage = ({ url, index, handleRemoveImage }: SortableImageProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: url })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="relative aspect-video rounded-lg overflow-hidden bg-muted group touch-none"
    >
      <button
        {...listeners}
        className="absolute inset-0 w-full h-full z-10 cursor-grab active:cursor-grabbing"
        aria-label={`Mover imagem ${index + 1}`}
      >
        <img
          src={url || "/placeholder.svg"}
          alt={`Imagem ${index + 1}`}
          className="object-cover w-full h-full pointer-events-none"
        />
      </button>

      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7"
        onClick={() => handleRemoveImage(index)}
        aria-label={`Remover imagem ${index + 1}`}
      >
        <X className="w-4 h-4" />
      </Button>
      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded z-20 pointer-events-none">
        {index + 1}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"imoveis" | "contatos">("imoveis")
  const [imoveis, setImoveis] = useState<Imovel[]>([])
  const [contatos, setContatos] = useState<Contato[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState("")
  const [uploading, setUploading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const [formData, setFormData] = useState({
    titulo: "",
    tipo: "Apartamento",
    preco: "",
    localizacao: "",
    quartos: 1,
    banheiros: 1,
    area: 0,
    destaque: false,
    garagem_coberta: false,
    suites: 0,
    informacoes_adicionais: "",
  })

  useEffect(() => {
    checkUser()
    loadImoveis()
    loadContatos()
  }, [])

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      setUserEmail(user.email || "")
    }
  }

  const loadImoveis = async () => {
    try {
      const { data, error } = await supabase.from("imoveis").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setImoveis(data || [])
    } catch (error) {
      console.error("Erro ao carregar imóveis:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadContatos = async () => {
    try {
      const { data, error } = await supabase.from("contatos").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setContatos(data || [])
    } catch (error) {
      console.error("Erro ao carregar contatos:", error)
    }
  }

  const marcarComoLida = async (id: string) => {
    try {
      const { error } = await supabase.from("contatos").update({ lida: true }).eq("id", id)

      if (error) throw error
      loadContatos()
    } catch (error) {
      console.error("Erro ao marcar como lida:", error)
    }
  }

  const excluirContato = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta mensagem?")) return

    try {
      const { error } = await supabase.from("contatos").delete().eq("id", id)

      if (error) throw error
      loadContatos()
    } catch (error) {
      console.error("Erro ao excluir contato:", error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        alert("Por favor, selecione apenas arquivos de imagem")
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(`A imagem ${file.name} é muito grande. O tamanho máximo é 5MB`)
        return
      }
    }

    setUploading(true)

    try {
      const uploadedUrls: string[] = []

      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Erro ao fazer upload")
        }

        const { url } = await response.json()
        uploadedUrls.push(url)
      }

      setUploadedImages((prev) => [...prev, ...uploadedUrls])
    } catch (error) {
      console.error("Erro no upload:", error)
      alert("Erro ao fazer upload das imagens. Tente novamente.")
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setUploadedImages((items) => {
        const oldIndex = items.findIndex((url) => url === active.id)
        const newIndex = items.findIndex((url) => url === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (uploadedImages.length === 0) {
      alert("Por favor, adicione pelo menos uma imagem do imóvel")
      return
    }

    try {
      const imovelData = {
        ...formData,
        imagens: uploadedImages,
        imagem: uploadedImages[0],
      }

      if (editingId) {
        const { error } = await supabase
          .from("imoveis")
          .update({ ...imovelData, updated_at: new Date().toISOString() })
          .eq("id", editingId)

        if (error) throw error
      } else {
        const { error } = await supabase.from("imoveis").insert([imovelData])

        if (error) throw error
      }

      resetForm()
      loadImoveis()
    } catch (error) {
      console.error("Erro ao salvar imóvel:", error)
      alert("Erro ao salvar imóvel. Tente novamente.")
    }
  }

  const handleEdit = (imovel: Imovel) => {
    setFormData({
      titulo: imovel.titulo,
      tipo: imovel.tipo,
      preco: imovel.preco,
      localizacao: imovel.localizacao,
      quartos: imovel.quartos,
      banheiros: imovel.banheiros,
      area: imovel.area,
      destaque: imovel.destaque,
      garagem_coberta: imovel.garagem_coberta || false,
      suites: imovel.suites || 0,
      informacoes_adicionais: imovel.informacoes_adicionais || "",
    })
    setUploadedImages(imovel.imagens || (imovel.imagem ? [imovel.imagem] : []))
    setEditingId(imovel.id)
    setShowForm(true)

    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este imóvel?")) return

    try {
      const { error } = await supabase.from("imoveis").delete().eq("id", id)

      if (error) throw error
      loadImoveis()
    } catch (error) {
      console.error("Erro ao excluir imóvel:", error)
      alert("Erro ao excluir imóvel. Tente novamente.")
    }
  }

  const resetForm = () => {
    setFormData({
      titulo: "",
      tipo: "Apartamento",
      preco: "",
      localizacao: "",
      quartos: 1,
      banheiros: 1,
      area: 0,
      destaque: false,
      garagem_coberta: false,
      suites: 0,
      informacoes_adicionais: "",
    })
    setUploadedImages([])
    setEditingId(null)
    setShowForm(false)
  }

  const mensagensNaoLidas = contatos.filter((c) => !c.lida).length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image src="/logo.png" alt="Logo" width={120} height={48} />
              <h1 className="text-xl font-bold">Painel Administrativo</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{userEmail}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex gap-2 border-b">
            <Button
              variant={activeTab === "imoveis" ? "default" : "ghost"}
              onClick={() => setActiveTab("imoveis")}
              className="rounded-b-none"
            >
              Imóveis
            </Button>
            <Button
              variant={activeTab === "contatos" ? "default" : "ghost"}
              onClick={() => setActiveTab("contatos")}
              className="rounded-b-none relative"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Mensagens
              {mensagensNaoLidas > 0 && <Badge className="ml-2 bg-red-500 text-white">{mensagensNaoLidas}</Badge>}
            </Button>
          </div>

          {activeTab === "imoveis" && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Gerenciar Imóveis</h2>
                {!showForm && (
                  <Button onClick={() => setShowForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Imóvel
                  </Button>
                )}
              </div>

              {showForm && (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{editingId ? "Editar Imóvel" : "Novo Imóvel"}</h3>
                    <Button variant="ghost" size="sm" onClick={resetForm}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="titulo">Título</Label>
                        <Input
                          id="titulo"
                          value={formData.titulo}
                          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tipo">Tipo</Label>
                        <select
                          id="tipo"
                          value={formData.tipo}
                          onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                          className="w-full h-10 px-3 rounded-md border border-input bg-background"
                          required
                        >
                          <option>Apartamento</option>
                          <option>Casa</option>
                          <option>Cobertura</option>
                          <option>Studio</option>
                          <option>Sobrado</option>
                          <option>Loft</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="preco">Preço</Label>
                        <Input
                          id="preco"
                          value={formData.preco}
                          onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                          placeholder="R$ 850.000"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="localizacao">Localização</Label>
                        <Input
                          id="localizacao"
                          value={formData.localizacao}
                          onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="quartos">Quartos</Label>
                        <Input
                          id="quartos"
                          type="number"
                          min="0"
                          value={formData.quartos}
                          onChange={(e) => setFormData({ ...formData, quartos: Number.parseInt(e.target.value) })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="banheiros">Banheiros</Label>
                        <Input
                          id="banheiros"
                          type="number"
                          min="0"
                          value={formData.banheiros}
                          onChange={(e) => setFormData({ ...formData, banheiros: Number.parseInt(e.target.value) })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="area">Área (m²)</Label>
                        <Input
                          id="area"
                          type="number"
                          min="0"
                          value={formData.area || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, area: parseInt(e.target.value, 10) || 0 })
                          }
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="imagens">Imagens do Imóvel ({uploadedImages.length})</Label>

                        {uploadedImages.length > 0 && (
                          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={uploadedImages} strategy={rectSortingStrategy}>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {uploadedImages.map((url, index) => (
                                  <SortableImage
                                    key={url}
                                    url={url}
                                    index={index}
                                    handleRemoveImage={handleRemoveImage}
                                  />
                                ))}
                              </div>
                            </SortableContext>
                          </DndContext>
                        )}

                        <div className="flex gap-2">
                          <div className="flex-1">
                            <Input
                              id="imagens-file"
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleFileUpload}
                              disabled={uploading}
                              className="cursor-pointer"
                            />
                          </div>
                          <Button type="button" variant="outline" disabled={uploading}>
                            <Upload className="w-4 h-4 mr-2" />
                            {uploading ? "Enviando..." : "Adicionar Imagens"}
                          </Button>
                        </div>

                        <p className="text-xs text-muted-foreground">
                          Arraste as imagens para reordenar. A primeira imagem será a capa.
                          <br />
                          Formatos aceitos: JPG, PNG, WebP. Tamanho máximo: 5MB por imagem.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="suites">Suítes</Label>
                        <Input
                          id="suites"
                          type="number"
                          min="0"
                          value={formData.suites}
                          onChange={(e) => setFormData({ ...formData, suites: Number.parseInt(e.target.value) })}
                          required
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="informacoes_adicionais">Informações Adicionais (Opcional)</Label>
                        <Textarea
                          id="informacoes_adicionais"
                          value={formData.informacoes_adicionais}
                          onChange={(e) => setFormData({ ...formData, informacoes_adicionais: e.target.value })}
                          placeholder="Ex: Condomínio com área de lazer completa, próximo ao metrô, aceita financiamento..."
                          rows={4}
                          className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                          Use este campo para adicionar informações extras sobre o imóvel que não se encaixam nos campos
                          específicos.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="garagem_coberta"
                        checked={formData.garagem_coberta}
                        onChange={(e) => setFormData({ ...formData, garagem_coberta: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="garagem_coberta" className="cursor-pointer">
                        Possui garagem coberta
                      </Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="destaque"
                        checked={formData.destaque}
                        onChange={(e) => setFormData({ ...formData, destaque: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="destaque" className="cursor-pointer">
                        Marcar como destaque
                      </Label>
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" disabled={uploadedImages.length === 0}>
                        {editingId ? "Salvar Alterações" : "Adicionar Imóvel"}
                      </Button>
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </Card>
              )}

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {imoveis.map((imovel) => {
                  const images = imovel.imagens || (imovel.imagem ? [imovel.imagem] : [])

                  return (
                    <Card key={imovel.id} className="overflow-hidden">
                      <div className="relative aspect-[4/3] bg-muted">
                        {images.length > 0 ? (
                          <ImageCarousel images={images} alt={imovel.titulo} />
                        ) : (
                          <div className="flex items-center justify-center h-full text-muted-foreground">
                            Sem imagem
                          </div>
                        )}
                        {imovel.destaque && (
                          <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground z-10">
                            Destaque
                          </Badge>
                        )}
                      </div>

                      <div className="p-4 space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary">{imovel.tipo}</Badge>
                            <span className="font-bold text-accent">{imovel.preco}</span>
                          </div>

                          <h3 className="font-semibold leading-tight text-balance">{imovel.titulo}</h3>

                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{imovel.localizacao}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
                          <div className="flex items-center gap-1">
                            <Bed className="w-4 h-4" />
                            <span>{imovel.quartos}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Bath className="w-4 h-4" />
                            <span>{imovel.banheiros}</span>
                          </div>
                          {imovel.area > 0 && (
                            <div className="flex items-center gap-1">
                              <Square className="w-4 h-4" />
                              <span>{imovel.area}m²</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {imovel.suites > 0 && (
                            <div className="flex items-center gap-1">
                              <Home className="w-4 h-4" />
                              <span>
                                {imovel.suites} suíte{imovel.suites > 1 ? "s" : ""}
                              </span>
                            </div>
                          )}
                          {imovel.garagem_coberta && (
                            <div className="flex items-center gap-1">
                              <Car className="w-4 h-4" />
                              <span>Garagem</span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent"
                            onClick={() => handleEdit(imovel)}
                          >
                            <Pencil className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-red-600 hover:text-red-700 bg-transparent"
                            onClick={() => handleDelete(imovel.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>

              {imoveis.length === 0 && !showForm && (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground mb-4">Nenhum imóvel cadastrado ainda</p>
                  <Button onClick={() => setShowForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Primeiro Imóvel
                  </Button>
                </Card>
              )}
            </>
          )}

          {activeTab === "contatos" && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Mensagens de Contato</h2>
                {mensagensNaoLidas > 0 && <Badge variant="destructive">{mensagensNaoLidas} não lida(s)</Badge>}
              </div>

              <div className="space-y-4">
                {contatos.map((contato) => (
                  <Card key={contato.id} className={`p-6 ${!contato.lida ? "border-accent border-2" : ""}`}>
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{contato.nome}</h3>
                            {!contato.lida && <Badge variant="destructive">Nova</Badge>}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              <a href={`mailto:${contato.email}`} className="hover:text-accent">
                                {contato.email}
                              </a>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              <a href={`tel:${contato.telefone}`} className="hover:text-accent">
                                {contato.telefone}
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {new Date(contato.created_at).toLocaleString("pt-BR")}
                        </div>
                      </div>

                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm whitespace-pre-wrap">{contato.mensagem}</p>
                      </div>

                      <div className="flex gap-2">
                        {!contato.lida && (
                          <Button variant="outline" size="sm" onClick={() => marcarComoLida(contato.id)}>
                            Marcar como lida
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 bg-transparent"
                          onClick={() => excluirContato(contato.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Excluir
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}

                {contatos.length === 0 && (
                  <Card className="p-12 text-center">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Nenhuma mensagem recebida ainda</p>
                  </Card>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}