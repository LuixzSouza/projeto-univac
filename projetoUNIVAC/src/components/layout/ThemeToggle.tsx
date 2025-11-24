'use client'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, systemTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Placeholder para evitar layout shift
    return <div className="h-10 w-10 rounded-full p-2" />;
  }

  const currentTheme = theme === 'system' ? systemTheme : theme
  const toggleTheme = () => setTheme(currentTheme === 'dark' ? 'light' : 'dark')

  return (
    <Button
      onClick={toggleTheme}
      className="
        rounded-full p-2 
        bg-border 
        text-text-base 
        hover:opacity-80 
        transition-all 
        duration-150
      "
      aria-label={`Mudar para tema ${currentTheme === 'dark' ? 'claro' : 'escuro'}`}
      title={`Tema atual: ${theme} (${currentTheme})`}
    >
      {currentTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </Button>
  );
}