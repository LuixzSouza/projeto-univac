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
  if (totalItems === 0) return null; 

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1)
  }

  const firstItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const lastItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="mt-5 flex flex-col items-center justify-between gap-4 border-t border-border pt-4 sm:flex-row">
       
       <p className="text-sm text-text-muted">
         Mostrando <span className="font-medium text-text-base">{firstItem}</span> até <span className="font-medium text-text-base">{lastItem}</span> de <span className="font-medium text-text-base">{totalItems}</span> resultados
       </p>

       <div className="flex items-center gap-2">
         <Button
           onClick={handlePrevious}
           disabled={currentPage === 1}
           variant="secondary"
           size="sm"
           className="flex items-center gap-1 pl-2 pr-3"
         >
           <ChevronLeft size={16} />
           Anterior
         </Button>
         
         <span className="text-sm font-medium text-text-base px-2">
           {currentPage} / {totalPages}
         </span>
         
         <Button
           onClick={handleNext}
           disabled={currentPage === totalPages}
           variant="secondary"
           size="sm" 
           className="flex items-center gap-1 pl-3 pr-2"
         >
           Próximo
           <ChevronRight size={16} />
         </Button>
       </div>
    </div>
  )
}