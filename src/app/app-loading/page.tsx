'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Syringe, CheckCircle2, Database, ShieldCheck, Server, Wifi } from 'lucide-react'

// --- Configurações ---
const IMAGENS_FUNDO = [
  '/univas-si.png',
  '/univas-fatima.jpg',
  '/univas-medicina.jpg',
  '/univas-ef.png',
]

// Etapas simuladas de carregamento
const SYSTEM_CHECKS = [
  { progress: 10, label: 'Estabelecendo conexão segura...', icon: Wifi },
  { progress: 30, label: 'Sincronizando banco de dados Neon...', icon: Database },
  { progress: 55, label: 'Verificando protocolos de segurança...', icon: ShieldCheck },
  { progress: 80, label: 'Carregando módulos do sistema...', icon: Server },
  { progress: 95, label: 'Finalizando inicialização...', icon: Syringe },
]

// Aumentei um pouco o tempo total para dar tempo de ver as 4 fotos
// 6000ms (6s) é um tempo bom para "show" sem irritar
const TOTAL_DURATION = 6000 

export default function LoadingPage() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [activeCheck, setActiveCheck] = useState(0)

  // 1. Pré-carregamento
  useEffect(() => {
    router.prefetch('/login')
  }, [router])

  // 2. Lógica de Progresso Linear
  useEffect(() => {
    const intervalTime = 20
    const steps = TOTAL_DURATION / intervalTime
    const increment = 100 / steps

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          return 100
        }
        return Math.min(prev + increment, 100)
      })
    }, intervalTime)

    return () => clearInterval(timer)
  }, [])

  // 3. Sincroniza os Checks
  useEffect(() => {
    const currentCheckIndex = SYSTEM_CHECKS.findIndex(check => progress < check.progress)
    if (currentCheckIndex === -1) {
        setActiveCheck(SYSTEM_CHECKS.length - 1)
    } else {
        setActiveCheck(Math.max(0, currentCheckIndex - 1))
    }
  }, [progress])

  // 4. Troca de Imagens (Sincronizada)
  useEffect(() => {
    // Divide o tempo total pelo número de imagens para garantir que todas apareçam
    const imageInterval = TOTAL_DURATION / IMAGENS_FUNDO.length

    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % IMAGENS_FUNDO.length)
    }, imageInterval)

    return () => clearInterval(timer)
  }, [])

  // 5. Redirecionamento Final
  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => {
        router.push('/login')
      }, 800)
      return () => clearTimeout(timeout)
    }
  }, [progress, router])

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black font-sans text-white">
      
      {/* --- FUNDO ANIMADO --- */}
      <AnimatePresence mode='popLayout'>
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.4, scale: 1 }}
          exit={{ opacity: 0 }}
          // Transição um pouco mais rápida para acompanhar a troca de fotos
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={IMAGENS_FUNDO[currentImageIndex]}
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* --- CONTEÚDO CENTRAL --- */}
      <div className="z-10 flex w-full max-w-md flex-col items-center px-6">
        
        {/* Logo Animado */}
        <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8 flex items-center gap-3"
        >
            <div className="relative h-16 w-16">
                {/* Seringa (Fundo) */}
                <div className="absolute inset-0 flex items-center justify-center text-white/20">
                    <Syringe size={64} strokeWidth={1} />
                </div>
                {/* Seringa (Líquido enchendo) */}
                <div className="absolute inset-0 flex items-center justify-center text-primary overflow-hidden" style={{ clipPath: `inset(${100 - progress}% 0 0 0)` }}>
                    <Syringe size={64} strokeWidth={1} fill="currentColor" className="text-primary" />
                </div>
            </div>
            <div>
                <h1 className="text-5xl font-bold tracking-tighter text-white">
                Uni<span className="text-primary">Vac</span>
                </h1>
                <p className="text-sm font-medium text-white/50 tracking-[0.2em] uppercase">System v1.0</p>
            </div>
        </motion.div>

        {/* Barra de Progresso */}
        <div className="relative mb-2 w-full">
            <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
                <span>Inicializando...</span>
                <span>{Math.floor(progress)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10 border border-white/5">
                <motion.div
                    className="h-full bg-primary shadow-[0_0_15px_rgba(16,185,129,0.6)]"
                    style={{ width: `${progress}%` }}
                    transition={{ ease: "linear", duration: 0.1 }}
                />
            </div>
        </div>

        {/* Lista de Verificação (Terminal) */}
        <div className="mt-6 w-full space-y-3">
            {SYSTEM_CHECKS.map((check, index) => {
                const isActive = index === activeCheck;
                const isCompleted = index < activeCheck;
                const isPending = index > activeCheck;

                // Só mostra os que já passaram ou o atual para não poluir visualmente (efeito cascata)
                if (index > activeCheck + 1) return null;

                return (
                    <motion.div 
                        key={check.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ 
                            opacity: isPending ? 0.3 : 1, 
                            x: 0,
                            scale: isActive ? 1.05 : 1
                        }}
                        className={`flex items-center gap-3 text-sm ${isActive ? 'text-white font-medium' : isCompleted ? 'text-primary' : 'text-white/30'}`}
                    >
                        {isCompleted ? (
                            <CheckCircle2 size={16} className="text-primary" />
                        ) : isActive ? (
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            >
                                <check.icon size={16} className="text-white" />
                            </motion.div>
                        ) : (
                            <check.icon size={16} />
                        )}
                        
                        <span>{check.label}</span>
                    </motion.div>
                )
            })}
        </div>

      </div>

      {/* Rodapé */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="absolute bottom-8 z-10 text-xs text-white/30"
      >
        &copy; 2025 UNIVÁS • Powered by Next.js & Neon
      </motion.div>

    </div>
  )
}