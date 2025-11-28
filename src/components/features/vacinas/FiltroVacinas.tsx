'use client'

import { Input } from '@/components/ui/Input'
import { Filter, X, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface FiltroVacinasProps {
  filtro: string
  onFiltroChange: (novoValor: string) => void
}

export function FiltroVacinas({ filtro, onFiltroChange }: FiltroVacinasProps) {
  return (
    <div className="mb-6 rounded-lg bg-bg-surface p-4 shadow-md border border-border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-text-base flex items-center gap-2">
          <Filter size={20} className="text-primary"/> Filtrar Vacinas
        </h3>
        
        {/* Botão de limpar só aparece se tiver texto */}
        {filtro && (
          <Button 
            variant="ghost" 
            onClick={() => onFiltroChange('')}
            className="h-8 px-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <X size={14} className="mr-1" /> Limpar Filtro
          </Button>
        )}
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-text-muted" />
        </div>
        
        <Input 
            id="filtro-vacinas"
            placeholder="Busque por nome ou descrição..."
            value={filtro}
            onChange={(e) => onFiltroChange(e.target.value)}
            className="pl-10" 
            label="" 
        />
      </div>
    </div>
  )
}