'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Syringe, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-base p-6">
      <motion.div
        className="text-center rounded-xl bg-bg-surface p-10 shadow-2xl border border-border max-w-lg w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        {/* Ícone temático de vacina */}
        <motion.div
          initial={{ rotate: -10, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Syringe size={64} className="mx-auto mb-4 text-primary" />
        </motion.div>

        {/* Código de erro */}
        <h1 className="text-6xl font-extrabold text-text-base">404</h1>

        {/* Subtítulo temático */}
        <h2 className="text-2xl font-semibold mt-3 text-text-base">
          Página não encontrada
        </h2>

        {/* Mensagem contextual */}
        <p className="mt-4 text-text-muted leading-relaxed">
          Parece que essa página <span className="text-primary font-semibold">não foi vacinada contra erros</span> 😅.  
          Verifique o endereço digitado ou volte ao painel principal para continuar gerenciando seus dados de vacinação.
        </p>

        {/* Botão para voltar ao painel */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => router.push('/dashboard')}
            variant="primary"
            className="flex items-center gap-2"
          >
            <ArrowLeft size={18} /> Voltar ao Painel
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
