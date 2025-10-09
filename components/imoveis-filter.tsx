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
    // ... (seus dados de exemplo permanecem os mesmos)
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

    // Lógica de fallback para dados de exemplo
    if (process.env.NEXT_PUBLIC_SUPABASE_URL === undefined) {
        console.log("[v0] Usando dados de exemplo - banco de dados não configurado")
        let data = IMOVEIS_EXEMPLO;
        const parsePreco = (p: string) => Number(p.replace(/[^0-9]/g, ''))
        
        data = data.filter(i => {
            if (params.termo && !i.titulo.toLowerCase().includes(params.termo.toLowerCase())) return false;
            if (params.localizacao && !i.localizacao.toLowerCase().includes(params.localizacao.toLowerCase())) return false;
            if (params.tipo && i.tipo !== params.tipo) return false;
            if (params.quartos && i.quartos < Number(params.quartos)) return false;
            if (params.banheiros && i.banheiros < Number(params.banheiros)) return false;
            if (params.suites && i.suites < Number(params.suites)) return false;
            if (params.garagem === 'sim' && !i.garagem_coberta) return false;
            if (params.precoMin && parsePreco(i.preco) < Number(params.precoMin)) return false;
            if (params.precoMax && parsePreco(i.preco) > Number(params.precoMax)) return false;
            return true;
        });

        return { data, isExample: true }
    }

    // Lógica de busca no Supabase
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
    if (params.precoMin) query = query.gte('preco_numerico', Number(params.precoMin));
    if (params.precoMax) query = query.lte('preco_numerico', Number(params.precoMax));

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
                                        Filtros avançados foram aplicados nos dados de exemplo. Conecte ao Supabase para uma experiência completa.
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
                            {imoveis.map((imovel) => {
                                // ... (O restante do seu componente de card de imóvel permanece o mesmo)
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