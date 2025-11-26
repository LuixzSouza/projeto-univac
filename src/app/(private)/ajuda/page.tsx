'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, ChevronDown, ExternalLink, 
  HelpCircle, PlayCircle, FileText, AlertCircle, CheckCircle2, 
  BookOpen, LifeBuoy, Server, Database, Code, Send, ThumbsUp, ThumbsDown, Video, Loader2, Lock, MousePointerClick,
  ShieldCheck
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { toast } from 'sonner'

// --- CONTEÚDO RICO E DETALHADO (Manual do Usuário) ---
const FAQ_CATEGORIES = [
  {
    id: 'primeiros-passos',
    title: 'Primeiros Passos',
    icon: PlayCircle,
    color: 'text-blue-500',
    questions: [
      {
        question: 'Por onde eu começo no sistema?',
        tags: ['Geral', 'Iniciante'],
        hasVideo: true,
        answer: (
          <div className="space-y-3">
            <p>Bem-vindo ao UniVac! Para configurar o sistema do zero, siga esta trilha:</p>
            <div className="space-y-2">
                <div className="flex gap-3 items-start p-2 rounded-lg bg-bg-base border border-border">
                    <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0">1</span>
                    <div>
                        <p className="font-semibold text-sm">Cadastro de Vacinas</p>
                        <p className="text-xs text-text-muted">Defina quais imunizantes a empresa oferece (ex: Gripe, Tétano).</p>
                    </div>
                </div>
                <div className="flex gap-3 items-start p-2 rounded-lg bg-bg-base border border-border">
                    <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0">2</span>
                    <div>
                        <p className="font-semibold text-sm">Cadastro de Funcionários</p>
                        <p className="text-xs text-text-muted">Importe ou cadastre sua equipe com CPF e Registro.</p>
                    </div>
                </div>
            </div>
            <p className="text-xs text-text-muted italic">Após isso, você estará pronto para usar a Agenda.</p>
          </div>
        ),
        link: '/vacinas'
      },
      {
        question: 'O que significam as cores do Dashboard?',
        tags: ['Visual', 'Dashboard'],
        answer: (
          <div className="space-y-2 text-sm">
            <p>O painel utiliza um sistema de semáforo para facilitar a leitura:</p>
            <div className="grid gap-2">
                <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-100 rounded">
                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></div> 
                    <span className="text-green-800 font-medium">Verde: Conformidade</span>
                    <span className="text-green-700 text-xs">- Funcionário em dia ou processo concluído.</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-100 rounded">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm"></div> 
                    <span className="text-yellow-800 font-medium">Amarelo: Atenção</span>
                    <span className="text-yellow-700 text-xs">- Prazo próximo ou vacinação parcial.</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-100 rounded">
                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></div> 
                    <span className="text-red-800 font-medium">Vermelho: Crítico</span>
                    <span className="text-red-700 text-xs">- Atraso, estoque zerado ou erro.</span>
                </div>
            </div>
          </div>
        ),
        link: '/dashboard'
      }
    ]
  },
  {
    id: 'operacao',
    title: 'Operação Diária (Enfermagem)',
    icon: CheckCircle2,
    color: 'text-green-500',
    questions: [
      {
        question: 'Como realizar o Check-in de vacina?',
        tags: ['Enfermagem', 'Agenda'],
        hasVideo: true,
        answer: (
          <div className="space-y-2">
            <p className="text-sm">O <strong>Check-in</strong> é a forma mais rápida de confirmar uma aplicação agendada:</p>
            <ol className="list-decimal pl-5 space-y-1 text-sm text-text-muted">
                <li>Acesse a <strong>Agenda</strong>.</li>
                <li>Clique sobre o agendamento do funcionário (caixa colorida).</li>
                <li>No modal que abrir, clique no botão verde <strong>"Realizar Check-in"</strong>.</li>
                <li>Confira o lote e confirme.</li>
            </ol>
            <div className="flex items-center gap-2 mt-2 text-xs text-green-700 bg-green-50 p-2 rounded border border-green-100">
                <CheckCircle2 size={14} />
                Isso gera o histórico e libera o horário na agenda automaticamente.
            </div>
          </div>
        ),
        link: '/agenda'
      },
      {
        question: 'Registrar vacina sem agendamento prévio',
        tags: ['Enfermagem', 'Urgência'],
        answer: (
          <p className="text-sm">
            Sim! Utilize o botão <strong>"Registrar Aplicação"</strong> presente no topo do Dashboard ou na página de Vacinas. 
            Isso é ideal para campanhas relâmpago ou atendimentos de balcão, pulando a etapa de agendamento.
          </p>
        ),
        link: '/dashboard'
      }
    ]
  },
  {
    id: 'gestao',
    title: 'Gestão e Segurança',
    icon: Lock,
    color: 'text-purple-500',
    questions: [
      {
        question: 'Como exportar o relatório de pendências?',
        tags: ['Admin', 'Relatórios'],
        answer: (
          <div className="space-y-2 text-sm">
            <p>Para auditorias ou controle em Excel:</p>
            <ol className="list-decimal pl-5 space-y-1 text-text-muted">
                <li>Vá ao <strong>Dashboard</strong>.</li>
                <li>Localize o cartão "Ações Rápidas".</li>
                <li>Clique em <strong>Exportar Pendências</strong>.</li>
            </ol>
            <p className="text-xs text-text-muted mt-1">O sistema gerará um arquivo <code>.csv</code> contendo Nome, Registro e quais vacinas obrigatórias estão faltando para cada colaborador.</p>
          </div>
        ),
        link: '/dashboard'
      },
      {
        question: 'Não consigo excluir um funcionário, por quê?',
        tags: ['Admin', 'Erro'],
        answer: (
          <div className="space-y-2">
              <p className="text-sm text-red-600 font-medium flex items-center gap-2">
                  <AlertCircle size={16}/> Trava de Segurança Ativa
              </p>
              <p className="text-sm">
                  O sistema impede a exclusão de funcionários que possuem <strong>histórico de vacinação</strong>. Isso é uma exigência legal para manter o prontuário médico íntegro.
              </p>
              <p className="text-sm bg-bg-base p-2 rounded border border-border">
                  <strong>Solução:</strong> Em vez de excluir, edite o funcionário e mude o status para <strong>Inativo</strong>.
              </p>
          </div>
        ),
        link: '/funcionarios'
      }
    ]
  }
]

const FILTERS = ['Todos', 'Geral', 'Admin', 'Enfermagem', 'Erro'];

export default function AjudaPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedKey, setExpandedKey] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState('Todos')
  const [isSearching, setIsSearching] = useState(false) 
  
  // Modais
  const [isDocOpen, setIsDocOpen] = useState(false)
  const [isSupportOpen, setIsSupportOpen] = useState(false)
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [videoTitle, setVideoTitle] = useState('')
  
  const router = useRouter()

  const toggleExpand = (key: string) => setExpandedKey(expandedKey === key ? null : key)

  // Delay visual de busca
  useEffect(() => {
    setIsSearching(true)
    const timer = setTimeout(() => {
        setIsSearching(false)
    }, 500) 
    return () => clearTimeout(timer)
  }, [searchTerm, activeFilter])

  // --- CORREÇÃO DO FILTRO AQUI ---
  const filteredQuestions = FAQ_CATEGORIES.flatMap(cat => 
    cat.questions.map((q, idx) => ({ 
        ...q, 
        category: cat.title, 
        icon: cat.icon, 
        color: cat.color, 
        key: `${cat.id}-${idx}` 
    }))
  ).filter(q => {
    // 1. Busca apenas na pergunta e nas tags (Evita erro no 'answer' que é JSX)
    const term = searchTerm.toLowerCase();
    const matchesSearch = q.question.toLowerCase().includes(term) || 
                          q.tags.some(tag => tag.toLowerCase().includes(term));
    
    // 2. Filtro por Categoria/Tag
    const matchesFilter = activeFilter === 'Todos' || q.tags.includes(activeFilter);
    
    return matchesSearch && matchesFilter;
  });

  const handleOpenVideo = (title: string) => {
      setVideoTitle(title);
      setIsVideoOpen(true);
  }

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const itemVariants = { hidden: { y: 10, opacity: 0 }, visible: { y: 0, opacity: 1 } }

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible" 
      className="max-w-5xl mx-auto space-y-8 pb-10"
    >
      
      {/* --- CABEÇALHO --- */}
      <div className="relative text-center space-y-6 py-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-full bg-primary/5 blur-3xl rounded-full -z-10" />

        <motion.div variants={itemVariants}>
            <h1 className="text-4xl font-extrabold text-text-base tracking-tight">
              Central de Conhecimento
            </h1>
            <p className="text-text-muted mt-3 text-lg max-w-xl mx-auto">
              Base de conhecimento inteligente do UniVac. Pesquise processos, regras e tutoriais.
            </p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="relative max-w-xl mx-auto space-y-6">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    {isSearching ? <Loader2 className="text-primary animate-spin" size={20} /> : <Search className="text-primary" size={20} />}
                </div>
                <input
                    type="text"
                    placeholder="Qual a sua dúvida hoje?"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-full border border-border bg-bg-surface py-4 pl-12 pr-4 text-base shadow-lg shadow-primary/5 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                />
            </div>
            
            {/* Chips de Filtro */}
            <div className="flex justify-center gap-2 flex-wrap">
                {FILTERS.map(f => (
                    <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        disabled={isSearching}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
                            activeFilter === f 
                            ? 'bg-primary text-white border-primary shadow-md transform scale-105' 
                            : 'bg-bg-surface text-text-muted border-border hover:border-primary/50 hover:text-primary'
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>
        </motion.div>
      </div>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <div className="grid gap-8 md:grid-cols-12">
        
        {/* Coluna Esquerda: FAQ Dinâmico */}
        <div className="md:col-span-8 space-y-6 min-h-[400px]">
            {isSearching ? (
                /* Skeleton Loading State */
                <div className="space-y-4">
                    {[1,2,3].map(i => (
                        <div key={i} className="h-20 w-full bg-bg-surface rounded-lg border border-border animate-pulse" />
                    ))}
                </div>
            ) : filteredQuestions.length > 0 ? (
                <div className="space-y-4">
                    {filteredQuestions.map((q) => (
                        <QuestionItem 
                            key={q.key} 
                            item={q} 
                            isOpen={expandedKey === q.key} 
                            onToggle={() => toggleExpand(q.key)} 
                            router={router} 
                            onOpenVideo={() => handleOpenVideo(q.question)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-bg-surface rounded-xl border border-border border-dashed">
                    <p className="text-text-muted">Nenhum resultado para o filtro atual.</p>
                    <button onClick={() => {setSearchTerm(''); setActiveFilter('Todos')}} className="text-primary hover:underline mt-2 font-medium">Limpar busca</button>
                </div>
            )}
        </div>

        {/* Coluna Direita: Ações Rápidas */}
        <div className="md:col-span-4 space-y-4">
            <motion.button 
                variants={itemVariants}
                onClick={() => setIsDocOpen(true)}
                className="w-full text-left group relative overflow-hidden rounded-xl bg-bg-surface p-6 border border-border hover:border-blue-500/50 transition-all shadow-sm hover:shadow-md"
            >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-blue-500">
                    <BookOpen size={64} />
                </div>
                <div className="relative z-10">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Code size={20} />
                    </div>
                    <h3 className="font-bold text-text-base">Documentação Técnica</h3>
                    <p className="text-sm text-text-muted mt-1">Arquitetura, API e Banco de Dados.</p>
                </div>
            </motion.button>

            <motion.button 
                variants={itemVariants}
                onClick={() => setIsSupportOpen(true)}
                className="w-full text-left group relative overflow-hidden rounded-xl bg-bg-surface p-6 border border-border hover:border-primary/50 transition-all shadow-sm hover:shadow-md"
            >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-primary">
                    <LifeBuoy size={64} />
                </div>
                <div className="relative z-10">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <HelpCircle size={20} />
                    </div>
                    <h3 className="font-bold text-text-base">Suporte UNIVÁS</h3>
                    <p className="text-sm text-text-muted mt-1">Abra um chamado para a TI.</p>
                </div>
            </motion.button>
        </div>
      </div>

      {/* --- MODAIS --- */}
      <Modal isOpen={isDocOpen} onClose={() => setIsDocOpen(false)} title="Ficha Técnica do Sistema">
         <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <TechItem icon={Code} label="Frontend" value="Next.js 14" />
                <TechItem icon={Database} label="Database" value="Neon Postgres" />
                <TechItem icon={Server} label="ORM" value="Prisma" />
                <TechItem icon={ShieldCheck} label="Security" value="NextAuth v5" />
            </div>
            <div className="flex justify-end"><Button onClick={() => setIsDocOpen(false)}>Fechar</Button></div>
         </div>
      </Modal>

      <Modal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} title="Abrir Chamado">
         <SupportForm onClose={() => setIsSupportOpen(false)} />
      </Modal>

      {/* MODAL VÍDEO */}
      <Modal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} title={`Tutorial: ${videoTitle}`}>
         <div className="space-y-4">
             <div className="aspect-video w-full bg-black rounded-lg flex items-center justify-center relative overflow-hidden group cursor-pointer shadow-lg border border-gray-800">
                 <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 opacity-50 group-hover:opacity-40 transition-opacity"></div>
                 <div className="relative z-10 h-20 w-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50 group-hover:scale-110 transition-transform">
                    <PlayCircle size={48} className="text-white fill-white" />
                 </div>
                 <p className="absolute bottom-4 left-4 text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">Simulação de Player • 02:34</p>
             </div>
             <div className="flex justify-end">
                <Button variant="secondary" onClick={() => setIsVideoOpen(false)}>Fechar Player</Button>
             </div>
         </div>
      </Modal>

    </motion.div>
  )
}

// --- SUB-COMPONENTES ---

function QuestionItem({ item, isOpen, onToggle, router, onOpenVideo }: any) {
    const [feedback, setFeedback] = useState<null | 'up' | 'down'>(null);

    return (
        <motion.div 
            layout 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className={`overflow-hidden rounded-lg border bg-bg-surface transition-all duration-300 ${isOpen ? 'border-primary/40 shadow-md ring-1 ring-primary/5' : 'border-border hover:border-primary/30'}`}
        >
            <button onClick={onToggle} className="flex w-full items-center justify-between p-4 text-left focus:outline-none group">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-md bg-bg-base text-muted-foreground group-hover:text-primary transition-colors`}>
                        <item.icon size={18} className={item.color}/>
                    </div>
                    <span className="font-medium text-text-base group-hover:text-primary transition-colors">{item.question}</span>
                </div>
                <ChevronDown className={`h-5 w-5 text-text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                        <div className="px-4 pb-4 text-text-muted leading-relaxed border-t border-border/50 pt-3 text-sm ml-[52px]">
                            {item.answer}
                            
                            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/30">
                                {item.link && (
                                    <Button size="sm" variant="secondary" onClick={() => router.push(item.link)} className="text-primary hover:text-primary-dark h-8 text-xs bg-primary/5 hover:bg-primary/10 border-primary/10">
                                        Acessar Funcionalidade <ExternalLink size={12} className="ml-2" />
                                    </Button>
                                )}
                                {item.hasVideo && (
                                    <Button size="sm" variant="secondary" onClick={onOpenVideo} className="text-blue-600 bg-blue-50 hover:bg-blue-100 h-8 text-xs border-blue-100 hover:border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
                                        <Video size={12} className="mr-2" /> Assistir Tutorial
                                    </Button>
                                )}
                            </div>

                            {/* Feedback Loop */}
                            <div className="mt-4 flex items-center gap-4 text-xs text-text-muted/70 bg-bg-base/50 p-2 rounded w-fit">
                                <span>Isso foi útil?</span>
                                <div className="flex gap-1">
                                    <button onClick={() => { setFeedback('up'); toast.success("Obrigado pelo feedback!") }} className={`p-1 rounded hover:bg-green-100 hover:text-green-600 transition-colors ${feedback === 'up' ? 'text-green-600 bg-green-50' : ''}`}><ThumbsUp size={14}/></button>
                                    <button onClick={() => { setFeedback('down'); toast.info("Vamos melhorar esse conteúdo.") }} className={`p-1 rounded hover:bg-red-100 hover:text-red-600 transition-colors ${feedback === 'down' ? 'text-red-600 bg-red-50' : ''}`}><ThumbsDown size={14}/></button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

function TechItem({ icon: Icon, label, value }: any) {
    return (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-bg-base border border-border">
            <div className="p-2 bg-bg-surface rounded-md text-primary"><Icon size={18} /></div>
            <div>
                <p className="text-xs text-text-muted uppercase font-bold">{label}</p>
                <p className="text-sm font-medium text-text-base">{value}</p>
            </div>
        </div>
    )
}

function SupportForm({ onClose }: { onClose: () => void }) {
    const [loading, setLoading] = useState(false)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        await new Promise(r => setTimeout(r, 1500))
        setLoading(false)
        toast.success("Chamado aberto com sucesso!", { description: "A equipe de TI entrará em contato." })
        onClose()
    }
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-md text-sm flex gap-2 items-start">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <p>Descreva o problema com detalhes para agilizar o atendimento.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Select label="Setor" id="setor" required> <option>Recursos Humanos</option><option>Enfermagem</option> </Select>
                <Select label="Prioridade" id="prioridade" required> <option>Normal</option><option>Alta</option> </Select>
            </div>
            <Input label="Assunto" id="assunto" placeholder="Ex: Erro ao cadastrar vacina" required />
            <div>
                <label className="block text-sm font-medium text-text-base mb-1">Descrição</label>
                <textarea className="w-full rounded-md border border-border bg-bg-base p-2 text-sm focus:border-primary focus:ring-primary min-h-[100px]" placeholder="Descreva..." required></textarea>
            </div>
            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
                <Button type="submit" variant="primary" disabled={loading} className="flex items-center gap-2"><Send size={16} /> {loading ? 'Enviando...' : 'Enviar'}</Button>
            </div>
        </form>
    )
}