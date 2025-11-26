'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ShieldAlert, RefreshCcw, Home, Activity } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  // Log do erro (em produção, enviaria para Sentry/Datadog)
  useEffect(() => {
    console.error('🚨 Erro crítico capturado pelo Error Boundary:', error)
  }, [error])

  // Animação de pulsação para o ícone de alerta
  const pulseAnimation = {
    scale: [1, 1.05, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-bg-base p-4 overflow-hidden">
      
      {/* Elementos de Fundo (Blobs com tons de alerta/vermelho) */}
      <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-red-500/10 blur-3xl filter animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl filter" />

      <motion.div
        className="relative z-10 w-full max-w-lg text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="rounded-2xl bg-bg-surface/80 p-10 shadow-2xl border border-red-200/50 dark:border-red-900/50 backdrop-blur-sm">
          
          {/* Ícone Animado */}
          <div className="relative mx-auto mb-6 h-24 w-24 flex items-center justify-center">
            {/* Círculo de fundo pulsante */}
            <motion.div 
                animate={pulseAnimation}
                className="absolute inset-0 rounded-full bg-red-500/20 blur-md" 
            />
            
            <div className="relative z-10 text-red-500">
              <ShieldAlert size={72} />
              {/* Pequeno ícone de atividade médica "quebrada" */}
              <Activity size={24} className="absolute -bottom-2 -right-2 text-orange-500" />
            </div>
          </div>

          {/* Título com Gradiente de Alerta */}
          <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600 drop-shadow-sm">
            Ops! Algo deu errado.
          </h1>

          <h2 className="mt-3 text-lg font-medium text-text-base">
            Erro inesperado no sistema.
          </h2>

          <p className="mx-auto mt-4 max-w-sm text-text-muted leading-relaxed">
            Não se preocupe, nossos especialistas já foram notificados dessa <span className="font-semibold text-red-500">reação adversa</span> do sistema. 🤒
          </p>

          {/* Ações */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              onClick={() => router.push('/dashboard')}
              variant="secondary"
              className="flex items-center justify-center gap-2"
            >
              <Home size={18} />
              Voltar ao Painel
            </Button>

            <Button
              onClick={
                // Tenta recuperar a página sem recarregar tudo
                () => reset()
              }
              // Assumindo que você tem a variante 'danger' no seu Button.tsx
              // Se não tiver, use variant="primary" e adicione classes de cor vermelha no className
              variant="danger" 
              className="flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
            >
              <RefreshCcw size={18} />
              Tentar Novamente
            </Button>
          </div>
          
          {/* Digest do Erro (Útil para suporte técnico identificar o log no servidor) */}
          {error.digest && (
            <p className="mt-8 border-t border-border/50 pt-4 text-xs text-text-muted opacity-70 font-mono">
              ID do Erro (Digest): {error.digest}
            </p>
          )}

        </div>
      </motion.div>
    </div>
  )
}