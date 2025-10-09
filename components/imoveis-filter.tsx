'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

// Idealmente, esta lista viria do banco de dados para ser dinâmica.
const TIPOS_DE_IMOVEL = ["Apartamento", "Casa", "Cobertura", "Studio", "Loft"]

export function ImoveisFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    // Usamos replace para não poluir o histórico do navegador
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const clearFilters = () => {
    router.replace(pathname, { scroll: false })
  }

  return (
    <Card className="p-4 md:p-6 mb-8 border-border/80">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Campo de Busca por Termo */}
        <div className="lg:col-span-2">
          <Input
            placeholder="Buscar por título ou localização..."
            defaultValue={searchParams.get('termo') || ''}
            // Um debounce aqui seria uma ótima melhoria de performance
            onChange={(e) => handleFilterChange('termo', e.target.value)}
            className="h-11"
          />
        </div>

        {/* Filtro por Tipo */}
        <div>
          <Select
            value={searchParams.get('tipo') || ''}
            onValueChange={(value) => handleFilterChange('tipo', value === 'todos' ? '' : value)}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Tipo de imóvel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os tipos</SelectItem>
              {TIPOS_DE_IMOVEL.map((tipo) => (
                <SelectItem key={tipo} value={tipo}>
                  {tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtro por Quartos */}
        <div>
          <Select
            value={searchParams.get('quartos') || ''}
            onValueChange={(value) => handleFilterChange('quartos', value === 'todos' ? '' : value)}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Nº de quartos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Qualquer nº</SelectItem>
              <SelectItem value="1">1 ou mais</SelectItem>
              <SelectItem value="2">2 ou mais</SelectItem>
              <SelectItem value="3">3 ou mais</SelectItem>
              <SelectItem value="4">4 ou mais</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Botão de Limpar */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="w-full h-11"
            onClick={clearFilters}
            disabled={!searchParams.size}
          >
            <X className="w-4 h-4 mr-2" />
            Limpar Filtros
          </Button>
        </div>
      </div>
    </Card>
  )
}