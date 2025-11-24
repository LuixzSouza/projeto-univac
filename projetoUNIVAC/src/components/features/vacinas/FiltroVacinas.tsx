'use client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input' 
import { Filter } from 'lucide-react'

export function FiltroVacinas() {
    const handleFilter = () => {
        alert('TODO: Aplicar filtro')
    }
  return (
    <div className="mb-4 rounded-lg bg-bg-surface p-4 shadow-md">
      <h3 className="text-lg font-semibold mb-2 text-text-base">Filtrar Vacinas</h3>
      <Button onClick={handleFilter} className="w-full flex items-center justify-center gap-2 mt-2" variant='secondary'>
        <Filter size={16}/> Filtrar
      </Button>
    </div>
  )
}