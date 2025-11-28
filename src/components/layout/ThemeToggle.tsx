'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-9 w-9" /> 
  }

  const isDark = resolvedTheme === 'dark'

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className={`
        relative flex h-9 w-9 items-center justify-center rounded-full 
        border border-border shadow-sm 
        transition-colors duration-300
        focus:outline-none focus:ring-2 focus:ring-primary/50
        ${isDark ? 'bg-slate-900 hover:bg-slate-800' : 'bg-white hover:bg-slate-50'}
      `}
      whileTap={{ scale: 0.9, rotate: 15 }} 
      whileHover={{ scale: 1.05 }}
      aria-label="Alternar Tema"
      title={isDark ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ scale: 0, rotate: -90, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 90, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            <Moon size={18} className="text-primary fill-primary/20" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ scale: 0, rotate: 90, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: -90, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            <Sun size={18} className="text-orange-500 fill-orange-500/20" />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className={`absolute inset-0 rounded-full blur-md transition-opacity duration-500 ${isDark ? 'bg-primary/20 opacity-50' : 'bg-orange-400/20 opacity-0'}`} />

    </motion.button>
  )
}