'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Placeholder vazio do mesmo tamanho para evitar pulo visual
    return <div className="h-9 w-9" />
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button
      variant="ghost" // Usa o fundo transparente que criamos
      size="sm"
      onClick={toggleTheme}
      className="relative h-9 w-9 rounded-full p-0 overflow-hidden group"
      title="Alternar Tema (Claro/Escuro)"
    >
      {/* A Mágica da Animação CSS (Tailwind):
         - O Sol começa visível (scale-100). No modo dark, ele roda e encolhe (scale-0).
         - A Lua começa invisível (scale-0). No modo dark, ela roda e cresce (scale-100).
      */}
      
      {/* Ícone do Sol */}
      <Sun 
        className={`
          h-[1.2rem] w-[1.2rem] 
          transition-all duration-300 ease-in-out
          ${resolvedTheme === 'dark' ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}
          text-yellow-500 
        `} 
      />

      {/* Ícone da Lua (Posicionado em cima do Sol com absolute) */}
      <Moon 
        className={`
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          h-[1.2rem] w-[1.2rem] 
          transition-all duration-300 ease-in-out
          ${resolvedTheme === 'dark' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'}
          text-primary
        `} 
      />
      
      <span className="sr-only">Alternar tema</span>
    </Button>
  )
}