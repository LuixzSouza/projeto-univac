'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, ShieldCheck, BarChart3, Calendar, Lock, 
  CheckCircle2, Cpu, HeartPulse, ChevronDown, 
  Activity, Bell, Syringe, UserPlus, Zap, Play, X
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'

// --- DADOS DO PROJETO ---
const PROJECT_METRICS = [
  { label: 'Eliminação de Papel', value: '100', suffix: '%' },
  { label: 'Tempo p/ Registro', value: '< 30', suffix: 'seg' },
  { label: 'Segurança de Dados', value: 'End-to', suffix: 'End' },
  { label: 'Disponibilidade', value: '24', suffix: '/7' },
]

const IMPACT_CARDS = [
    { role: 'Para a Enfermagem', icon: HeartPulse, color: 'text-red-500', title: 'Foco no Paciente', desc: 'Automatização total da burocracia. O sistema valida doses e lotes instantaneamente, permitindo foco total no cuidado.' },
    { role: 'Para a Gestão (RH)', icon: BarChart3, color: 'text-blue-500', title: 'Dados em Tempo Real', desc: 'Dashboard executivo com KPIs de imunização. Adeus planilhas manuais e riscos de conformidade trabalhista.' },
    { role: 'Para a TI (Dev)', icon: Cpu, color: 'text-purple-500', title: 'Arquitetura Moderna', desc: 'Stack escalável com Next.js 14, Server Actions e renderização híbrida. Segurança e performance de nível enterprise.' }
]

const FAQS = [
    { q: 'Qual a tecnologia do Banco de Dados?', a: 'Utilizamos PostgreSQL hospedado na nuvem via Neon DB, com Prisma ORM para garantir tipagem forte e segurança nas queries.' },
    { q: 'O sistema é seguro?', a: 'Sim. A autenticação utiliza NextAuth v5 com criptografia de senhas (bcrypt) e proteção contra ataques comuns da web (CSRF/XSS).' },
    { q: 'É possível escalar o projeto?', a: 'Com certeza. A arquitetura Serverless do Vercel permite que o sistema cresça de 10 para 10.000 usuários sem alterar a infraestrutura base.' },
]

const TEAM_MEMBERS = [
    { name: 'Luiz Antônio de Souza', role: 'Dev Líder & Arquitetura Front-end', contribution: 'Integração completa, Design System, UX e Finalização do Back-end.', initials: 'LA', color: 'bg-green-600', foto:'Luiz.webp' },
    { name: 'Renan Carlos', role: 'API Contributor', contribution: 'Desenvolvimento da rotas de Funcionários.', initials: 'RC', color: 'bg-blue-600', foto:'Renan.webp' },
    { name: 'William', role: 'API Contributor', contribution: 'Desenvolvimento das rotas de Agendamento.', initials: 'WL', color: 'bg-yellow-600', foto:'William.webp' },
    { name: 'Isabela', role: 'API Contributor', contribution: 'Suporte na definição de rotas de Vacinas e Lógica de Lotes.', initials: 'IS', color: 'bg-pink-600', foto: 'Isa.webp' },
];

export default function LandingPage() {
  const [text, setText] = useState('')
  const fullText = "Simples. Segura. Digital."
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false) 
  
  // Efeito de Digitação
  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      setText(fullText.slice(0, i))
      i++
      if (i > fullText.length) clearInterval(timer)
    }, 100)
    return () => clearInterval(timer)
  }, [])

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 selection:bg-green-100 selection:text-green-700 overflow-x-hidden relative">
      
      {/* Live Ticker Flutuante */}
      <LiveTicker />

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md transition-all">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2 text-xl font-bold tracking-tight cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white shadow-green-200 shadow-lg">
              <ShieldCheck size={18} />
            </div>
            Uni<span className="text-green-600">Vac</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-slate-400 hidden sm:block border border-slate-200 px-2 py-1 rounded">v1.2.0-beta</span>
            <Link href="/app-loading">
              <Button className="rounded-full bg-slate-900 text-white hover:bg-slate-800 px-6 shadow-lg hover:shadow-xl transition-all">
                Acessar Demo
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        
        {/* --- HERO SECTION --- */}
        <section className="relative pt-24 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-green-100/50 to-transparent rounded-[100%] blur-3xl -z-10 opacity-60 animate-pulse" style={{ animationDuration: '4s' }} />
          
          <div className="container mx-auto px-6 text-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-4xl space-y-8"
            >
              {/* BADGE DO TCC DA KARINY (Agora é Link) */}
              <Link href="/archive/TCC_KARINY.pdf" target="_blank" className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50/80 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-green-700 shadow-sm hover:scale-105 transition-transform cursor-pointer group">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                Projeto Integrador - Baseado no TCC da Kariny
                <ArrowRight size={14} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </Link>

              <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl leading-[1.1] min-h-[1.1em]">
                Gestão de Vacinação <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500">
                  {text}<span className="animate-pulse text-green-500">|</span>
                </span>
              </h1>
              
              <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
                Uma solução moderna para otimizar o trabalho da <strong>Enfermagem</strong> e garantir a conformidade de dados com a tecnologia mais atual do mercado.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 pb-10">
                {/* Botão Principal: Acessar Sistema */}
                <Link href="/app-loading">
                  <Button className="h-14 px-8 text-lg rounded-full bg-green-600 hover:bg-green-700 text-white shadow-xl shadow-green-600/30 transition-all hover:scale-105 font-semibold">
                    Acessar Sistema <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                
                {/* Botão Secundário: GitHub (RESTAURADO) */}
                <Link href="https://github.com/LuixzSouza/projeto-univac" target="_blank">
                  <Button variant="secondary" className="h-14 px-8 text-lg rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm hover:shadow-md transition-all gap-2">
                    <GithubIcon /> Código Fonte
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* --- VÍDEO HERO (MOCKUP) --- */}
            <motion.div 
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="relative mx-auto max-w-5xl"
            >
                <div className="group relative rounded-xl bg-slate-900 p-2 shadow-2xl shadow-green-900/20 ring-1 ring-slate-200/10 backdrop-blur-xl lg:rounded-2xl lg:p-3 cursor-pointer" onClick={() => setIsVideoModalOpen(true)}>
                    {/* Barra de Título Fake */}
                    <div className="absolute top-0 left-0 right-0 h-10 flex items-center px-4 gap-2 z-10 bg-gradient-to-b from-slate-900 to-transparent">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <div className="mx-auto text-[10px] text-slate-500 font-mono bg-slate-800/80 px-3 py-1 rounded-full backdrop-blur-sm">
                            univac.app/demo
                        </div>
                    </div>

                    {/* Vídeo em Loop */}
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg lg:rounded-xl bg-black mt-8">
                        <video 
                            src="/video/Video-Univac.mp4" // Certifique-se que o arquivo está em public/video/
                            className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                            autoPlay 
                            muted 
                            loop 
                            playsInline
                        />
                        
                        {/* Botão Play Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/0 transition-colors">
                            <div className="h-20 w-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/50 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                                <Play size={40} className="text-white fill-white ml-2" />
                            </div>
                        </div>
                        
                        {/* Badge */}
                        <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 border border-white/10">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            Preview do Sistema
                        </div>
                    </div>
                </div>
                
                {/* Sombra/Reflexo */}
                <div className="absolute -bottom-20 left-10 right-10 h-20 bg-green-500/20 blur-[100px] rounded-full pointer-events-none"></div>
            </motion.div>
          </div>
        </section>

        {/* --- MÉTRICAS --- */}
        <section className="py-16 bg-slate-900 text-white border-y border-slate-800">
             <div className="container mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {PROJECT_METRICS.map((stat, idx) => (
                        <StatCounter key={idx} {...stat} delay={idx * 0.1} />
                    ))}
                </div>
            </div>
        </section>

        {/* --- IMPACTO --- */}
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
               <motion.div {...fadeInUp} className="text-center max-w-2xl mx-auto mb-16">
                   <h2 className="text-3xl font-bold tracking-tight text-slate-900">Impacto Multidisciplinar</h2>
               </motion.div>
               <div className="grid md:grid-cols-3 gap-8">
                 {IMPACT_CARDS.map((card, i) => <SpotlightCard key={i} {...card} />)}
               </div>
            </div>
        </section>

        {/* --- TIME --- */}
        <section className="py-20 border-t border-slate-200 bg-slate-50">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-16">O Time por Trás do Código</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {TEAM_MEMBERS.map((member, i) => <TeamMemberCard key={i} {...member} delay={i * 0.1} />)}
                </div>
            </div>
        </section>

        {/* --- FAQ --- */}
        <section className="py-24 bg-white border-t border-slate-200">
            <div className="container mx-auto px-6 max-w-3xl">
                <motion.div {...fadeInUp} className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900">Perguntas sobre o Desenvolvimento</h2>
                </motion.div>
                <div className="space-y-4">
                    {FAQS.map((faq, i) => (
                        <FaqItem key={i} q={faq.q} a={faq.a} />
                    ))}
                </div>
            </div>
        </section>

        {/* --- CTA FINAL --- */}
        <section className="py-24 bg-slate-900 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-green-500/20 blur-[100px] rounded-full" />
            <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
                <h2 className="text-4xl font-bold mb-6">Pronto para otimizar sua gestão?</h2>
                <Link href="/app-loading">
                    <Button className="h-14 px-10 text-lg rounded-full bg-green-500 hover:bg-green-600 text-white font-bold shadow-lg shadow-green-500/25 transition-transform hover:scale-105">
                        Testar Agora
                    </Button>
                </Link>
            </div>
        </section>

      </main>

      {/* --- MODAL DE VÍDEO EM TELA CHEIA --- */}
      <AnimatePresence>
        {isVideoModalOpen && (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-10"
                onClick={() => setIsVideoModalOpen(false)}
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }} 
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="relative w-full max-w-6xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10"
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                >
                    <button 
                        onClick={() => setIsVideoModalOpen(false)}
                        className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-white text-white hover:text-black p-2 rounded-full transition-all"
                    >
                        <X size={24} />
                    </button>
                    <video 
                        src="/video/Video-Univac.mp4" 
                        className="w-full h-full object-contain"
                        controls 
                        autoPlay 
                    />
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER CORRIGIDO E CENTRALIZADO */}
      <footer className="bg-slate-950 py-12 text-slate-500 text-sm border-t border-slate-900">
         <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 font-semibold text-slate-300 order-2 md:order-1">
                <ShieldCheck size={20} className="text-green-600" /> UniVac
            </div>
            
            <div className="text-right order-1 md:order-2">
               <p className="font-medium text-slate-400">Desenvolvido por <strong>Luiz Antônio de Souza</strong> e Time</p>
               <p className="text-xs mt-1">Renan Carlos • William • Isabela</p>
            </div>
         </div>
      </footer>
    </div>
  )
}

// --- SUB-COMPONENTES ---

function LiveTicker() {
    const [notification, setNotification] = useState({ text: 'Sistema Operacional', type: 'default' })
    const [visible, setVisible] = useState(true)

    useEffect(() => {
        const messages = [
            { text: '🔒 Criptografia End-to-End ativa', type: 'success' },
            { text: '💉 12 novas doses registradas no último minuto', type: 'info' },
            { text: '⚡ Latência do servidor: 14ms (Otimizado)', type: 'success' },
            { text: '📊 Relatório de conformidade gerado automaticamente', type: 'default' },
            { text: '☁️ Sincronização com Neon DB concluída', type: 'info' },
            { text: '🛡️ Varredura de segurança: Nenhuma ameaça', type: 'success' },
            { text: '🏥 Campanha de Gripe: 92% de adesão', type: 'info' },
            { text: '✅ Verificação de lote de vacinas: OK', type: 'success' }
        ]
        let shuffled = messages.sort(() => 0.5 - Math.random());
        let i = 0;
        const interval = setInterval(() => {
            setVisible(false)
            setTimeout(() => {
                setNotification(shuffled[i])
                setVisible(true)
                i = (i + 1) % shuffled.length
            }, 500)
        }, 4000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="fixed bottom-6 left-6 z-50 pointer-events-none hidden sm:block">
            <AnimatePresence mode="wait">
                {visible && (
                    <motion.div 
                        key={notification.text}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="bg-white/90 backdrop-blur-md border border-slate-200 shadow-xl rounded-full px-5 py-2.5 flex items-center gap-3 text-xs font-medium text-slate-700"
                    >
                        <span className="relative flex h-2.5 w-2.5">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${notification.type === 'success' ? 'bg-green-400' : 'bg-blue-400'}`}></span>
                            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                        </span>
                        <span className="tracking-wide">{notification.text}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function SpotlightCard({ role, icon: Icon, title, desc, color }: any) {
    const divRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);
  
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!divRef.current) return;
      const div = divRef.current;
      const rect = div.getBoundingClientRect();
      setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
  
    return (
      <div
        ref={divRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setOpacity(1)}
        onMouseLeave={() => setOpacity(0)}
        className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl"
      >
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
          style={{
            opacity,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(22, 163, 74, 0.1), transparent 40%)`,
          }}
        />
        <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
                <div className={`h-10 w-10 bg-slate-50 ${color} rounded-lg flex items-center justify-center border border-slate-100`}>
                    <Icon size={20} />
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider text-slate-400`}>{role}</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-600 leading-relaxed text-sm">{desc}</p>
        </div>
      </div>
    );
}

function TeamMemberCard({ name, role, contribution, initials, color, delay, foto }: any) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            className="flex flex-col items-center p-4 bg-white rounded-xl shadow-md border border-slate-100 h-full"
        >
            <div className={`h-16 w-16 rounded-full overflow-hidden ${color} text-white font-bold text-xl flex items-center justify-center mb-3 shadow-lg`}>
                {foto ? (
                    <Image 
                        src={`/equipe/${foto}`} 
                        width={64} 
                        height={64} 
                        alt={initials} 
                    />
                ) : (
                    <span className="text-white text-xl">
                        {initials}
                    </span>
                )}
            </div>

            <h3 className="font-bold text-base text-slate-900 text-center">{name}</h3>
            <p className="text-xs font-semibold text-slate-500 mb-2">{role}</p>
            <p className="text-[11px] text-slate-600 italic text-center leading-snug max-w-36">{contribution}</p>
        </motion.div>
    )
}

function StatCounter({ label, value, suffix, delay }: any) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-colors"
        >
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                {value}<span className="text-green-500 text-2xl">{suffix}</span>
            </div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">{label}</div>
        </motion.div>
    )
}

function FaqItem({ q, a }: { q: string, a: string }) {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-5 text-left font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
            >
                {q}
                <ChevronDown className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                    {a}
                </div>
            )}
        </div>
    )
}

function GithubIcon() {
    return (
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
    )
}