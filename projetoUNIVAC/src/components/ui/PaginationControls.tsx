'use client'

import { Button } from './Button' 
import { ChevronLeft, ChevronRight } from 'lucide-react' 

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  itemsPerPage: number
  totalItems: number
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems
}: PaginationControlsProps) {
  if (totalPages <= 1) return null 

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  // Calcula os itens mostrados na página atual
  const firstItem = (currentPage - 1) * itemsPerPage + 1;
  const lastItem = Math.min(currentPage * itemsPerPage, totalItems);


  return (
    // Usa a cor de borda do tema
    <div className="mt-4 flex flex-col items-center justify-between gap-2 border-t pt-4 border-border sm:flex-row">
       <span className="text-sm text-text-muted">
         Mostrando {firstItem}–{lastItem} de {totalItems} resultados
       </span>
       <div className="flex items-center gap-2">
         <Button
           onClick={handlePrevious}
           disabled={currentPage === 1}
           variant="secondary"
           size="sm"
           className="flex items-center gap-1"
         >
           <ChevronLeft size={16} />
           Anterior
         </Button>
         <span className="text-sm text-text-muted">
           Pág {currentPage} / {totalPages}
         </span>
         <Button
           onClick={handleNext}
           disabled={currentPage === totalPages}
           variant="secondary"
           size="sm" 
           className="flex items-center gap-1"
         >
           Próximo
           <ChevronRight size={16} />
         </Button>
       </div>
    </div>
  )
}