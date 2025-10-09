'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'
import { useState, useEffect } from 'react' // [CORREÇÃO] Importar useState e useEffect

const TIPOS_DE_IMOVEL = ["Apartamento", "Casa", "Cobertura", "Studio", "Loft"]

export function ImoveisFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // [CORREÇÃO] Usar estado local para cada campo do formulário
  const [filters, setFilters] = useState({
    termo: '',
    localizacao: '',
    precoMin: '',
    precoMax: '',
    tipo: '',
    garagem: '',
    quartos: '',
    banheiros: '',
    suites: '',
  })

  // [CORREÇÃO] Sincronizar o estado com os parâmetros da URL apenas no lado do cliente
  useEffect(() => {
    setFilters({
      termo: searchParams.get('termo') || '',
      localizacao: searchParams.get('localizacao') || '',
      precoMin: searchParams.get('precoMin') || '',
      precoMax: searchParams.get('precoMax') || '',
      tipo: searchParams.get('tipo') || '',
      garagem: searchParams.get('garagem') || '',
      quartos: searchParams.get('quartos') || '',
      banheiros: searchParams.get('banheiros') || '',
      suites: searchParams.get('suites') || '',
    })
  }, [searchParams])

  // Função para atualizar a URL
  const updateURLParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }
  
  // [CORREÇÃO] Atualizar o estado local E a URL
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFilters(prev => ({ ...prev, [id]: value }))
    updateURLParams(id, value)
  }

  const handleSelectChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    updateURLParams(key, value)
  }

  const clearFilters = () => {
    setFilters({ // Limpa o estado local
      termo: '', localizacao: '', precoMin: '', precoMax: '', tipo: '',
      garagem: '', quartos: '', banheiros: '', suites: '',
    })
    router.replace(pathname, { scroll: false }) // Limpa a URL
  }

  return (
    <Card className="p-4 md:p-6 mb-8 border-border/80">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
        {/* [CORREÇÃO] Todos os campos agora usam `value` do estado local e `onChange` */}
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
            <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              {TIPOS_DE_IMOVEL.map((tipo) => (<SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Garagem</Label>
          <Select value={filters.garagem} onValueChange={(v) => handleSelectChange('garagem', v)}>
            <SelectTrigger><SelectValue placeholder="Indiferente" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">Indiferente</SelectItem>
              <SelectItem value="sim">Com garagem coberta</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Quartos</Label>
          <Select value={filters.quartos} onValueChange={(v) => handleSelectChange('quartos', v)}>
            <SelectTrigger><SelectValue placeholder="Qualquer nº" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">Qualquer nº</SelectItem>
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
            <SelectTrigger><SelectValue placeholder="Qualquer nº" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">Qualquer nº</SelectItem>
              <SelectItem value="1">1 ou mais</SelectItem>
              <SelectItem value="2">2 ou mais</SelectItem>
              <SelectItem value="3">3 ou mais</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Suítes</Label>
          <Select value={filters.suites} onValueChange={(v) => handleSelectChange('suites', v)}>
            <SelectTrigger><SelectValue placeholder="Qualquer nº" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">Qualquer nº</SelectItem>
              <SelectItem value="0">Sem suíte</SelectItem>
              <SelectItem value="1">1 ou mais</SelectItem>
              <SelectItem value="2">2 ou mais</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button variant="ghost" className="w-full" onClick={clearFilters} disabled={!searchParams.size}>
            <X className="w-4 h-4 mr-2" />
            Limpar filtros
          </Button>
        </div>
      </div>
    </Card>
  )
}