'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link' // ✨ Import do Link
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Loader2, Eye, EyeOff, Lock, Mail, Github, Chrome, QrCode, 
  AlertTriangle, Smartphone, Info, ArrowLeft // ✨ Import do ArrowLeft
} from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

// --- CONFIGURAÇÃO DO SLIDESHOW (Contexto Acadêmico) ---
const SLIDES = [
  {
    id: 1,
    image: '/univas-medicina.jpg', 
    quote: "Projeto Integrador: Unindo a eficiência da Tecnologia com o cuidado da Enfermagem.",
    author: "Sistemas de Informação & Enfermagem"
  },
  {
    id: 2,
    image: '/univas-fatima.jpg',
    quote: "A transformação digital na saúde começa com a gestão inteligente de dados.",
    author: "UNIVÁS - 2025"
  },
  {
    id: 3,
    image: '/univas-si.png',
    quote: "Simplicidade e Segurança: Os pilares para um sistema de saúde robusto.",
    author: "Sistemas de Informação"
  },
  {
    id: 4,
    image: '/univas-ef.png',
    quote: "Cuidar com excelência é unir conhecimento, sensibilidade e inovação.",
    author: "Enfermagem"
  }
]

export default function LoginPage() {
  // Estados de Form
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  
  // Estados de UX
  const [currentSlide, setCurrentSlide] = useState(0)
  const [capsLockOn, setCapsLockOn] = useState(false)
  const [loginMethod, setLoginMethod] = useState<'email' | 'qr'>('email')
  
  const router = useRouter()

  // --- EFEITO CARROSSEL INFINITO ---
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  // --- DETECTOR DE CAPS LOCK ---
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.getModifierState('CapsLock')) {
      setCapsLockOn(true)
    } else {
      setCapsLockOn(false)
    }
  }

  // --- HANDLER GENÉRICO PARA SIMULAÇÕES ---
  const handleSimulatedAction = (featureName: string) => {
    toast.info(`Funcionalidade: ${featureName}`, {
        description: "Este recurso é uma demonstração visual para o projeto acadêmico.",
        icon: <Info size={18} />
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simula um delay de rede para dar feedback visual
      await new Promise(resolve => setTimeout(resolve, 800));

      const result = await signIn('credentials', {
        redirect: false,
        email: email,
        senha: senha,
      })

      if (result?.ok) {
        // logAction('LOGIN', 'Sistema', 'Usuário realizou login', email); // Descomente se tiver o logAction importado
        toast.success("Autenticação realizada!", { description: "Carregando painel..." })
        router.push('/dashboard')
      } else {
        toast.error("Acesso negado.", {
            description: "Para teste use: admin@vacina.com / admin123"
        })
        setIsLoading(false)
      }
    } catch (err) {
      toast.error("Erro ao conectar com o servidor.")
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2 overflow-hidden bg-bg-base">
      
      {/* --- COLUNA ESQUERDA (CONTEXTO DO PROJETO) --- */}
      <div className="hidden lg:flex relative flex-col justify-between bg-zinc-900 text-white overflow-hidden">
        
        {/* Background Animado */}
        <AnimatePresence mode='popLayout'>
            <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 0.6, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0 z-0"
            >
                <Image 
                    src={SLIDES[currentSlide].image}
                    alt="Slide Background"
                    fill
                    className="object-cover grayscale-[40%]"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/40 to-zinc-900/30" />
            </motion.div>
        </AnimatePresence>

        {/* Conteúdo Sobreposto */}
        <div className="relative z-10 p-10 h-full flex flex-col justify-between">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-green-600 flex items-center justify-center shadow-lg shadow-green-900/20">
                    <span className="font-bold text-xl">U</span>
                </div>
                <div>
                    <span className="text-xl font-semibold tracking-tight block leading-none">Uni<span className="text-green-500">Vac</span></span>
                    <span className="text-[10px] uppercase tracking-widest opacity-70">Projeto Acadêmico</span>
                </div>
            </div>

            <div className="max-w-lg">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentSlide}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="text-2xl font-medium leading-snug text-white">
                            "{SLIDES[currentSlide].quote}"
                        </p>
                        <div className="mt-4 flex items-center gap-2">
                            <div className="h-1 w-8 bg-green-500 rounded-full" />
                            <p className="text-sm text-zinc-300 uppercase tracking-wider">{SLIDES[currentSlide].author}</p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Indicadores de Slide */}
            <div className="flex gap-2">
                {SLIDES.map((_, idx) => (
                    <div key={idx} className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentSlide ? 'w-8 bg-green-500' : 'w-2 bg-white/20'}`} />
                ))}
            </div>
        </div>
      </div>

      {/* --- COLUNA DIREITA (FORMULÁRIO INTERATIVO) --- */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
        
        {/* ✨ BOTÃO DE VOLTAR (LINK PEQUENO) ✨ */}
        <div className="absolute top-6 left-6 z-20">
            <Link href="/" className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-primary transition-colors group">
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Voltar ao Início
            </Link>
        </div>

        {/* Elemento decorativo de fundo */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md space-y-8 relative z-10"
        >
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-text-base">Acesso ao Sistema</h2>
            <p className="mt-2 text-sm text-text-muted">Identifique-se para continuar.</p>
          </div>

          {/* TABS DE MÉTODO DE LOGIN */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-bg-surface border border-border rounded-lg">
              <button
                type="button"
                onClick={() => setLoginMethod('email')}
                className={`flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${loginMethod === 'email' ? 'bg-bg-base text-text-base shadow-sm' : 'text-text-muted hover:text-text-base'}`}
              >
                <Mail size={16} /> Senha
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('qr')}
                className={`flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${loginMethod === 'qr' ? 'bg-bg-base text-text-base shadow-sm' : 'text-text-muted hover:text-text-base'}`}
              >
                <QrCode size={16} /> Crachá (NFC)
              </button>
          </div>

          {loginMethod === 'email' ? (
            <form className="space-y-5" onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
                <div className="space-y-4">
                    <Input
                        id="email"
                        label="Email Corporativo"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@vacina.com"
                        required
                        disabled={isLoading}
                        icon={Mail}
                    />

                    <div className="relative">
                        <Input
                            id="senha"
                            label="Senha"
                            type={showPassword ? 'text' : 'password'}
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            placeholder="admin123"
                            required
                            disabled={isLoading}
                            icon={Lock}
                            className="pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-[34px] text-text-muted hover:text-text-base transition-colors"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {/* ALERTA DE CAPS LOCK */}
                    <AnimatePresence>
                        {capsLockOn && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                className="flex items-center gap-2 text-xs text-yellow-600 bg-yellow-50 p-2 rounded border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
                            >
                                <AlertTriangle size={14} />
                                <span>Caps Lock está ativado</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="h-4 w-4 rounded border-border text-primary focus:ring-primary bg-bg-surface" 
                        />
                        <span className="ml-2 text-text-muted">Lembrar dispositivo</span>
                    </label>
                    <button 
                        type="button" 
                        onClick={() => handleSimulatedAction("Recuperação de Senha")} 
                        className="font-medium text-primary hover:text-primary-dark"
                    >
                        Esqueceu a senha?
                    </button>
                </div>

                <Button type="submit" variant="primary" className="w-full py-6 text-base shadow-lg shadow-primary/20" disabled={isLoading}>
                    {isLoading ? <span className="flex gap-2"><Loader2 className="animate-spin" /> Validando...</span> : "Entrar"}
                </Button>
            </form>
          ) : (
            /* --- MODO QR CODE (DEMO) --- */
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center space-y-6 py-8 text-center"
            >
                <div 
                    className="relative group cursor-pointer"
                    onClick={() => handleSimulatedAction("Leitor de Crachá")}
                >
                    <div className="absolute inset-0 bg-primary/20 rounded-xl blur-xl group-hover:blur-2xl transition-all"></div>
                    <div className="relative bg-white p-4 rounded-xl border-2 border-dashed border-primary/50 group-hover:border-primary transition-colors">
                        <QrCode size={120} className="text-slate-800" />
                        {/* Linha de Scan Animada */}
                        <motion.div 
                            animate={{ top: ['5%', '90%', '5%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute left-2 right-2 h-0.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-text-base">Integração Biométrica</h3>
                    <p className="text-sm text-text-muted max-w-xs mx-auto">
                        Esta funcionalidade simula a leitura de crachás funcionais da UNIVÁS.
                    </p>
                </div>
                <Button 
                    variant="secondary" 
                    className="w-full" 
                    onClick={() => handleSimulatedAction("Login via NFC Mobile")}
                >
                    <Smartphone size={16} className="mr-2"/> Usar App Mobile (NFC)
                </Button>
            </motion.div>
          )}

          {/* Botões Sociais (SSO) */}
          <div className="relative mt-8">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-bg-base px-2 text-text-muted">SSO Acadêmico</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <button 
                type="button"
                onClick={() => handleSimulatedAction("Login via GitHub")}
                className="flex items-center justify-center gap-2 p-2.5 border border-border rounded-lg hover:bg-bg-surface transition-colors text-text-muted hover:text-text-base"
            >
                <Github size={18} /> GitHub
            </button>
            <button 
                type="button"
                onClick={() => handleSimulatedAction("Login via Google Workspace")}
                className="flex items-center justify-center gap-2 p-2.5 border border-border rounded-lg hover:bg-bg-surface transition-colors text-text-muted hover:text-text-base"
            >
                <Chrome size={18} /> Google
            </button>
          </div>

        </motion.div>
      </div>
    </div>
  )
}