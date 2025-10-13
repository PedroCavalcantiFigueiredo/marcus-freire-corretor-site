'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { X, Search } from 'lucide-react' // [NOVO] Importar o ícone de busca
import { useState, useEffect } from 'react'

const TIPOS_DE_IMOVEL = ["Apartamento", "Casa", "Cobertura", "Studio", "Sobrado", "Loft", "Lote", "Chácara", "Fazenda", "Flat", "Duplex", "Triplex", "Terreno", "Galpão", "Prédio Comercial", "Sala Comercial", "Conjunto Comercial", "Área Rural", "Outros"]

const defaultValues = {
  tipo: 'todos',
  garagem: 'indiferente',
  quartos: 'qualquer',
  banheiros: 'qualquer',
  suites: 'qualquer'
}

export function ImoveisFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // O estado local agora guarda as seleções antes de serem aplicadas
  const [filters, setFilters] = useState({
    termo: '',
    localizacao: '',
    precoMin: '',
    precoMax: '',
    tipo: defaultValues.tipo,
    garagem: defaultValues.garagem,
    quartos: defaultValues.quartos,
    banheiros: defaultValues.banheiros,
    suites: defaultValues.suites,
  })

  // Sincroniza o formulário com a URL quando a página carrega
  useEffect(() => {
    setFilters({
      termo: searchParams.get('termo') || '',
      localizacao: searchParams.get('localizacao') || '',
      precoMin: searchParams.get('precoMin') || '',
      precoMax: searchParams.get('precoMax') || '',
      tipo: searchParams.get('tipo') || defaultValues.tipo,
      garagem: searchParams.get('garagem') || defaultValues.garagem,
      quartos: searchParams.get('quartos') || defaultValues.quartos,
      banheiros: searchParams.get('banheiros') || defaultValues.banheiros,
      suites: searchParams.get('suites') || defaultValues.suites,
    })
  }, [searchParams])
  
  // [ALTERADO] Os handlers agora APENAS atualizam o estado local
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFilters(prev => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (key: keyof typeof defaultValues, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  // [NOVO] Função para aplicar os filtros e atualizar a URL
  const handleApplyFilters = () => {
    const params = new URLSearchParams()
    // Adiciona apenas os filtros que têm valor e não são o padrão
    if (filters.termo) params.set('termo', filters.termo);
    if (filters.localizacao) params.set('localizacao', filters.localizacao);
    if (filters.precoMin) params.set('precoMin', filters.precoMin);
    if (filters.precoMax) params.set('precoMax', filters.precoMax);
    if (filters.tipo !== defaultValues.tipo) params.set('tipo', filters.tipo);
    if (filters.garagem !== defaultValues.garagem) params.set('garagem', filters.garagem);
    if (filters.quartos !== defaultValues.quartos) params.set('quartos', filters.quartos);
    if (filters.banheiros !== defaultValues.banheiros) params.set('banheiros', filters.banheiros);
    if (filters.suites !== defaultValues.suites) params.set('suites', filters.suites);

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const clearFilters = () => {
    router.replace(pathname, { scroll: false })
  }

  return (
    <Card className="p-4 md:p-6 mb-8 border-border/80">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
        {/* ... (todos os campos de Input e Select permanecem os mesmos, mas agora só atualizam o estado) ... */}
        <div className="md:col-span-2">
          <Label htmlFor="termo">Busca Geral</Label>
          <Input id="termo" placeholder="Título do imóvel..." value={filters.termo} onChange={handleInputChange}/>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="localizacao">Localização</Label>
          <Input id="localizacao" placeholder="Bairro ou cidade..." value={filters.localizacao} onChange={handleInputChange}/>
        </div>
        <div className="sm:col-span-2 md:col-span-4 lg:col-span-2">
          <Label>Faixa de Preço</Label>
          <div className="flex items-center gap-2">
            <Input id="precoMin" type="number" placeholder="Mínimo" value={filters.precoMin} onChange={handleInputChange} min="0"/>
            <span className="text-muted-foreground">-</span>
            <Input id="precoMax" type="number" placeholder="Máximo" value={filters.precoMax} onChange={handleInputChange} min="0"/>
          </div>
        </div>
        <div>
          <Label>Tipo de Imóvel</Label>
          <Select value={filters.tipo} onValueChange={(v) => handleSelectChange('tipo', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Tipos</SelectItem>
              {TIPOS_DE_IMOVEL.map((tipo) => (<SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Garagem</Label>
          <Select value={filters.garagem} onValueChange={(v) => handleSelectChange('garagem', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="indiferente">Indiferente</SelectItem>
              <SelectItem value="sim">Com garagem coberta</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Quartos</Label>
          <Select value={filters.quartos} onValueChange={(v) => handleSelectChange('quartos', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="qualquer">Qualquer nº</SelectItem>
              <SelectItem value="1">1 ou mais</SelectItem>
              <SelectItem value="2">2 ou mais</SelectItem>
              <SelectItem value="3">3 ou mais</SelectItem>
              <SelectItem value="4">4 ou mais</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Banheiros</Label>
          <Select value={filters.banheiros} onValueChange={(v) => handleSelectChange('banheiros', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="qualquer">Qualquer nº</SelectItem>
              <SelectItem value="1">1 ou mais</SelectItem>
              <SelectItem value="2">2 ou mais</SelectItem>
              <SelectItem value="3">3 ou mais</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Suítes</Label>
          <Select value={filters.suites} onValueChange={(v) => handleSelectChange('suites', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="qualquer">Qualquer nº</SelectItem>
              <SelectItem value="0">Sem suíte</SelectItem>
              <SelectItem value="1">1 ou mais</SelectItem>
              <SelectItem value="2">2 ou mais</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* [NOVO] Botões de Ação */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-2 md:col-span-3 lg:col-span-4">
            <Button onClick={handleApplyFilters} className="w-full sm:w-auto">
                <Search className="w-4 h-4 mr-2" />
                Aplicar Filtros
            </Button>
            <Button variant="ghost" onClick={clearFilters} disabled={!searchParams.size} className="w-full sm:w-auto">
                <X className="w-4 h-4 mr-2" />
                Limpar Filtros
            </Button>
        </div>
      </div>
    </Card>
  )
}