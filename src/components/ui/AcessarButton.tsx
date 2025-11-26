'use client'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface AcessarButtonProps {
  href: string
  label?: string
  variant?: 'solid' | 'outline' // ✨ Nova opção de estilo
  className?: string
}

export function AcessarButton({ 
  href, 
  label = "Acessar", 
  variant = 'solid',
  className = ''
}: AcessarButtonProps) {
  
  // Estilos base
  const baseStyles = "group mt-4 flex w-full items-center justify-between rounded-lg p-3 transition-all duration-200 cursor-pointer shadow-sm"
  
  // Variantes
  const variants = {
    solid: "bg-primary text-white hover:bg-primary-dark hover:shadow-md",
    outline: "bg-transparent border border-primary text-primary hover:bg-primary/5"
  }

  return (
    <Link href={href} className={`block ${className}`}>
      <div className={`${baseStyles} ${variants[variant]}`}>
        <span className="font-medium text-sm sm:text-base">
            {label}
        </span>
        
        {/* ✨ A seta se move para a direita no hover */}
        <ArrowRight 
            size={20} 
            className="transition-transform duration-300 ease-out group-hover:translate-x-1" 
        />
      </div>
    </Link>
  )
}