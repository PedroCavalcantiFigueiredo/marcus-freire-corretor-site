import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bed, Bath, Square, MapPin, AlertCircle, Car, Home, Info, Building } from "lucide-react"
import Link from "next/link"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { ImageCarousel } from "@/components/image-carousel"
import { ImoveisFilter } from "@/components/imoveis-filter"

const IMOVEIS_EXEMPLO = [
  {
    id: "exemplo-1",
    titulo: "Apartamento Moderno no Centro",
    tipo: "Apartamento",
    preco: "R$ 450.000",
    localizacao: "Centro, Belo Horizonte",
    quartos: 3,
    banheiros: 2,
    area: 95,
    imagem: "/modern-apartment-living-room.png",
    imagens: ["/modern-apartment-living-room.png"],
    destaque: true,
    garagem_coberta: true,
    suites: 1,
    informacoes_adicionais: "Este apartamento tem um design moderno e está localizado no coração da cidade.",
  },
  {
    id: "exemplo-2",
    titulo: "Casa de Luxo com Piscina",
    tipo: "Casa",
    preco: "R$ 1.200.000",
    localizacao: "Savassi, Belo Horizonte",
    quartos: 4,
    banheiros: 3,
    area: 280,
    imagem: "/luxury-house-with-pool.png",
    imagens: ["/luxury-house-with-pool.png"],
    destaque: true,
    garagem_coberta: true,
    suites: 2,
    informacoes_adicionais: "A casa vem com uma piscina privativa e um excelente acabamento.",
  },
  {
    id: "exemplo-3",
    titulo: "Cobertura Vista para o Mar",
    tipo: "Cobertura",
    preco: "R$ 2.500.000",
    localizacao: "Pampulha, Belo Horizonte",
    quartos: 5,
    banheiros: 4,
    area: 350,
    imagem: "/penthouse-ocean-view.jpg",
    imagens: ["/penthouse-ocean-view.jpg"],
    destaque: false,
    garagem_coberta: true,
    suites: 3,
    informacoes_adicionais: "A cobertura oferece uma vista panorâmica do mar e um espaço gourmet.",
  },
  {
    id: "exemplo-4",
    titulo: "Studio Compacto e Funcional",
    tipo: "Studio",
    preco: "R$ 280.000",
    localizacao: "Funcionários, Belo Horizonte",
    quartos: 1,
    banheiros: 1,
    area: 45,
    imagem: "/modern-studio-apartment.png",
    imagens: ["/modern-studio-apartment.png"],
    destaque: false,
    garagem_coberta: false,
    suites: 0,
    informacoes_adicionais: "Ideal para quem busca um espaço funcional e compacto no centro.",
  },
  {
    id: "exemplo-5",
    titulo: "Casa em Condomínio Fechado",
    tipo: "Casa",
    preco: "R$ 850.000",
    localizacao: "Belvedere, Belo Horizonte",
    quartos: 3,
    banheiros: 3,
    area: 220,
    imagem: "/house-in-gated-community.jpg",
    imagens: ["/house-in-gated-community.jpg"],
    destaque: false,
    garagem_coberta: true,
    suites: 1,
    informacoes_adicionais: "A casa está em um condomínio seguro e bem cuidado.",
  },
  {
    id: "exemplo-6",
    titulo: "Loft Industrial Reformado",
    tipo: "Loft",
    preco: "R$ 620.000",
    localizacao: "Santa Efigênia, Belo Horizonte",
    quartos: 2,
    banheiros: 2,
    area: 120,
    imagem: "/industrial-loft-interior.jpg",
    imagens: ["/industrial-loft-interior.jpg"],
    destaque: false,
    garagem_coberta: true,
    suites: 0,
    informacoes_adicionais: "Este loft combina estilo industrial com conforto e funcionalidade.",
  },
]

interface ImovelSearchParams {
  termo?: string
  localizacao?: string
  tipo?: string
  quartos?: string
  banheiros?: string
  suites?: string
  garagem?: string
  precoMin?: string
  precoMax?:string
}

async function getImoveis(params: ImovelSearchParams) {
    const supabase = await getSupabaseServerClient()

    if (process.env.NEXT_PUBLIC_SUPABASE_URL === undefined) {
      console.log("[v0] Usando dados de exemplo - banco de dados não configurado")
      // Lógica de fallback para dados de exemplo...
      return { data: IMOVEIS_EXEMPLO, isExample: true }
    }

    let query = supabase
        .from("imoveis")
        .select("*")
        .order("destaque", { ascending: false })
        .order("created_at", { ascending: false })

    if (params.termo) query = query.ilike('titulo', `%${params.termo}%`);
    if (params.localizacao) query = query.ilike('localizacao', `%${params.localizacao}%`);
    if (params.tipo) query = query.eq('tipo', params.tipo);
    if (params.quartos) query = query.gte('quartos', Number(params.quartos));
    if (params.banheiros) query = query.gte('banheiros', Number(params.banheiros));
    if (params.suites) {
        if (params.suites === "0") {
            query = query.eq('suites', 0);
        } else {
            query = query.gte('suites', Number(params.suites));
        }
    }
    if (params.garagem === 'sim') query = query.eq('garagem_coberta', true);

    const precoMinNum = Number(params.precoMin);
    if (!isNaN(precoMinNum) && precoMinNum > 0) {
        query = query.gte('preco_numerico', precoMinNum);
    }

    const precoMaxNum = Number(params.precoMax);
    if (!isNaN(precoMaxNum) && precoMaxNum > 0) {
        query = query.lte('preco_numerico', precoMaxNum);
    }

    const { data, error } = await query

    if (error) {
        console.error("Erro ao buscar imóveis:", error)
        return { data: [], isExample: false }
    }

    return { data: data || [], isExample: false }
}

export default async function ImoveisPage({
    searchParams,
}: {
    searchParams: ImovelSearchParams
}) {
    const { data: imoveis, isExample } = await getImoveis(searchParams);

    return (
        <div className="min-h-screen">
            <Navigation />
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8 space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-balance">Imóveis Disponíveis</h1>
                        <p className="text-lg text-muted-foreground text-pretty">
                            Use os filtros abaixo para encontrar o imóvel ideal para você.
                        </p>
                    </div>
                    <ImoveisFilter />
                    {isExample && (
                        <Card className="p-4 mb-6 border-amber-500/50 bg-amber-500/5">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Mostrando dados de exemplo</p>
                                    <p className="text-sm text-muted-foreground">
                                        Execute o script SQL{" "}
                                        <code className="bg-muted px-1.5 py-0.5 rounded text-xs">scripts/001_create_imoveis_table.sql</code>{" "}
                                        para ativar o gerenciamento dinâmico de imóveis.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}
                    {imoveis.length === 0 ? (
                        <Card className="p-12 text-center">
                            <Building className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                            <h3 className="text-lg font-semibold">Nenhum imóvel encontrado</h3>
                            <p className="text-muted-foreground mt-1">
                                Tente ajustar os filtros ou limpá-los para ver mais resultados.
                            </p>
                        </Card>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {imoveis.map((imovel: any) => { // Adicionado 'any' para compatibilidade com dados de exemplo
                                const images = imovel.imagens || (imovel.imagem ? [imovel.imagem] : [])

                                return (
                                    <Card key={imovel.id} className="overflow-hidden group">
                                        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                                            <ImageCarousel images={images} alt={imovel.titulo} />
                                            {imovel.destaque && (
                                                <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground z-10">Destaque</Badge>
                                            )}
                                        </div>
                                        <div className="p-5 space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <Badge variant="secondary">{imovel.tipo}</Badge>
                                                    <span className="text-xl font-bold text-accent">{imovel.preco}</span>
                                                </div>
                                                <h3 className="font-semibold text-lg leading-tight text-balance">{imovel.titulo}</h3>
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{imovel.localizacao}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-3 border-t border-border">
                                                <div className="flex items-center gap-1">
                                                    <Bed className="w-4 h-4" />
                                                    <span>{imovel.quartos}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Bath className="w-4 h-4" />
                                                    <span>{imovel.banheiros}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Square className="w-4 h-4" />
                                                    <span>{imovel.area}m²</span>
                                                </div>
                                            </div>
                                            {(imovel.suites > 0 || imovel.garagem_coberta) && (
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
                                            )}
                                            {imovel.informacoes_adicionais && (
                                                <div className="pt-3 border-t border-border">
                                                    <div className="flex items-start gap-2 text-sm">
                                                        <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                                        <p className="text-muted-foreground text-pretty leading-relaxed">
                                                            {imovel.informacoes_adicionais}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            <Button asChild className="w-full bg-transparent" variant="outline">
                                                <Link href={`/contato?imovel=${imovel.id}`}>Tenho Interesse</Link>
                                            </Button>
                                        </div>
                                    </Card>
                                )
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}