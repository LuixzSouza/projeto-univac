'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Syringe, ArrowLeft, Home, FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  const router = useRouter()

  // Animação de flutuação para o ícone
  const floatAnimation = {
    y: [0, -10, 0],
    rotate: [0, 5, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-bg-base p-4 overflow-hidden">
      
      {/* Elementos de Fundo (Blobs Decorativos) */}
      <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl filter animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl filter" />

      <motion.div
        className="relative z-10 w-full max-w-lg text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="rounded-2xl bg-bg-surface/80 p-10 shadow-2xl border border-border backdrop-blur-sm">
          
          {/* Ícone Animado */}
          <div className="relative mx-auto mb-6 h-24 w-24 flex items-center justify-center">
            {/* Círculo de fundo do ícone */}
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-md" />
            
            <motion.div animate={floatAnimation} className="relative z-10 text-primary">
              <Syringe size={80} />
              
              {/* Gotinha caindo (Detalhe extra!) */}
              <motion.div
                className="absolute -bottom-2 left-[38px] h-3 w-3 rounded-full bg-primary"
                animate={{
                  y: [0, 20],
                  opacity: [1, 0],
                  scale: [1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              />
            </motion.div>
          </div>

          {/* Texto Grande com Gradiente */}
          <h1 className="text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-600 drop-shadow-sm">
            404
          </h1>

          <h2 className="mt-2 text-2xl font-bold text-text-base">
            Página não encontrada
          </h2>

          <p className="mx-auto mt-4 max-w-sm text-text-muted leading-relaxed">
            Ops! Parece que esta página <span className="font-semibold text-primary">não foi vacinada contra erros</span> e acabou sumindo do sistema. 🦠
          </p>

          {/* Ações */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              onClick={() => router.back()}
              variant="secondary"
              className="flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} />
              Voltar
            </Button>

            <Button
              onClick={() => router.push('/dashboard')}
              variant="primary"
              className="flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              <Home size={18} />
              Ir para o Painel
            </Button>
          </div>

        </div>
        
        {/* Rodapé discreto */}
        <p className="mt-8 text-xs text-text-muted opacity-60">
          Código de Erro: 404_NOT_FOUND • Sistema UniVac
        </p>
      </motion.div>
    </div>
  )
}