'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, ChevronDown, ExternalLink, 
  HelpCircle, PlayCircle, FileText, AlertCircle, CheckCircle2, 
  BookOpen, LifeBuoy, Server, Database, Code, Send, ThumbsUp, ThumbsDown, Video, 
  Lock, MousePointerClick, Edit3, Plus, Trash2, BarChart2,
  ShieldCheck, Loader2, Package, UserCog, History, Calendar, LogIn,
  Users
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { Switch } from '@/components/ui/Switch'
import { toast } from 'sonner'

// --- TIPOS ---
interface Question {
    id: string;
    question: string;
    answer: React.ReactNode;
    tags: string[];
    hasVideo?: boolean;
    link?: string | null;
    likes: number;
    dislikes: number;
}

interface Category {
    id: string;
    title: string;
    icon: any;
    color: string;
    questions: Question[];
}

// --- DADOS DO MANUAL COMPLETO (EXPANDIDO) ---
const INITIAL_DATA: Category[] = [
  {
    id: 'acesso',
    title: 'Acesso e Segurança',
    icon: LogIn,
    color: 'text-slate-500',
    questions: [
      {
        id: 'q-login-types',
        question: 'Quais as formas de acesso ao sistema?',
        tags: ['Login', 'Geral'],
        hasVideo: true,
        likes: 45,
        dislikes: 0,
        link: '/login', // Redireciona para logout na prática
        answer: (
          <div className="space-y-2 text-sm">
            <p>O UniVac suporta dois métodos de autenticação modernos:</p>
            <ul className="list-disc pl-5 space-y-1 text-text-muted">
               <li><strong>Credenciais Padrão:</strong> Email corporativo e senha forte.</li>
               <li><strong>Crachá Digital (QR Code):</strong> Para agilidade hospitalar, basta aproximar o crachá funcional do leitor (funcionalidade simulada na tela de login).</li>
            </ul>
          </div>
        )
      },
      {
        id: 'q-forgot',
        question: 'Esqueci minha senha, o que fazer?',
        tags: ['Login', 'Suporte'],
        likes: 32,
        dislikes: 1,
        link: null,
        answer: (
          <p className="text-sm">
            Por segurança, o sistema não envia senhas por e-mail. Entre em contato com o <strong>Administrador do Sistema (RH)</strong> para que ele redefina sua senha temporária através do painel de gestão de funcionários.
          </p>
        )
      }
    ]
  },
  {
    id: 'dashboard',
    title: 'Dashboard & Indicadores',
    icon: BarChart2,
    color: 'text-indigo-500',
    questions: [
      {
        id: 'q-colors',
        question: 'Entendendo o Semáforo de Cores',
        tags: ['Visual', 'Dashboard'],
        likes: 120,
        dislikes: 0,
        link: '/dashboard',
        answer: (
          <div className="space-y-3 text-sm">
            <p>O painel utiliza cores universais de saúde para indicar status:</p>
            <div className="grid gap-2">
                <div className="flex items-center gap-3 p-2 bg-green-50 border border-green-100 rounded-md">
                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm shrink-0"></div> 
                    <div>
                        <span className="text-green-800 font-bold block">Verde: Conformidade</span>
                        <span className="text-green-700 text-xs">Funcionário com esquema vacinal completo ou estoque saudável.</span>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-2 bg-yellow-50 border border-yellow-100 rounded-md">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm shrink-0"></div> 
                    <div>
                        <span className="text-yellow-800 font-bold block">Amarelo: Atenção</span>
                        <span className="text-yellow-700 text-xs">Esquema parcial, prazo próximo ou lote vencendo em 30 dias.</span>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-2 bg-red-50 border border-red-100 rounded-md">
                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm shrink-0"></div> 
                    <div>
                        <span className="text-red-800 font-bold block">Vermelho: Crítico</span>
                        <span className="text-red-700 text-xs">Não vacinado, atrasado ou estoque zerado. Ação imediata necessária.</span>
                    </div>
                </div>
            </div>
          </div>
        )
      }
    ]
  },
  {
    id: 'estoque',
    title: 'Controle de Estoque',
    icon: Package,
    color: 'text-orange-500',
    questions: [
      {
        id: 'q-add-lote',
        question: 'Como registrar entrada de vacinas?',
        tags: ['Estoque', 'Admin'],
        likes: 55,
        dislikes: 0,
        link: '/estoque',
        answer: (
          <div className="space-y-2 text-sm">
             <p>Ao receber uma remessa de imunizantes:</p>
             <ol className="list-decimal pl-5 space-y-1 text-text-muted font-medium">
                 <li>Acesse o menu <strong>Estoque</strong> na barra lateral.</li>
                 <li>Clique no botão <strong>"+ Entrada de Nota / Lote"</strong>.</li>
                 <li>Selecione o Tipo da Vacina.</li>
                 <li>Informe o Código do Lote, Quantidade e Validade (essencial para alertas).</li>
             </ol>
             <div className="flex items-center gap-2 mt-2 p-2 bg-blue-50 text-blue-700 rounded text-xs">
                <Info size={14} /> As doses são somadas automaticamente ao total disponível.
             </div>
          </div>
        )
      },
      {
        id: 'q-validade',
        question: 'Como o sistema avisa sobre validade?',
        tags: ['Estoque', 'Sistema'],
        likes: 45,
        dislikes: 1,
        link: '/configuracoes',
        answer: (
           <p className="text-sm">
              O UniVac monitora diariamente a data de validade. 
              Se um lote estiver a <strong>30 dias</strong> do vencimento (configurável em Ajustes), um alerta aparecerá no sino de notificações e o card do estoque ficará amarelo.
           </p>
        )
      }
    ]
  },
  {
    id: 'agenda-operacao',
    title: 'Agenda & Vacinação (Core)',
    icon: Calendar,
    color: 'text-green-600',
    questions: [
      {
        id: 'q-checkin',
        question: 'O que é o "Check-in" de Vacina?',
        tags: ['Enfermagem', 'Processo'],
        hasVideo: true,
        likes: 210,
        dislikes: 5,
        link: '/agenda',
        answer: (
          <div className="space-y-2">
            <p className="text-sm font-medium">O Check-in é o recurso que agiliza o atendimento na enfermaria:</p>
            <div className="pl-4 border-l-2 border-green-200 space-y-2 text-sm text-text-muted">
                <p>1. O funcionário agendado chega ao local.</p>
                <p>2. O enfermeiro clica no agendamento na <strong>Agenda</strong>.</p>
                <p>3. Clica no botão <strong>"Realizar Check-in"</strong>.</p>
                <p>4. O sistema preenche o formulário sozinho. Basta confirmar.</p>
            </div>
            <p className="text-xs text-green-700 font-semibold mt-1">
                Resultado: O agendamento vira "Concluído" e o histórico médico é gerado num único clique.
            </p>
          </div>
        )
      },
      {
        id: 'q-urgencia',
        question: 'Posso vacinar sem agendar antes?',
        tags: ['Enfermagem', 'Urgência'],
        likes: 60,
        dislikes: 2,
        link: '/dashboard',
        answer: (
          <p className="text-sm">
            <strong>Sim!</strong> Use o botão <strong>"Registrar Aplicação"</strong> disponível no Dashboard e na tela de Vacinas. 
            Essa função é ideal para campanhas relâmpago ou atendimentos de balcão, pulando a etapa de agendamento.
          </p>
        )
      }
    ]
  },
  {
    id: 'funcionarios',
    title: 'Gestão de Pessoas',
    icon: Users,
    color: 'text-purple-500',
    questions: [
      {
        id: 'q-carteirinha',
        question: 'Como emitir a Carteirinha Digital?',
        tags: ['Documentos', 'Perfil'],
        likes: 95,
        dislikes: 0,
        link: '/funcionarios',
        answer: (
           <div className="space-y-2 text-sm">
               <p>Todo funcionário possui um documento oficial gerado pelo sistema:</p>
               <ol className="list-decimal pl-5 space-y-1 text-text-muted">
                   <li>Vá em <strong>Funcionários</strong> e clique no nome da pessoa.</li>
                   <li>No perfil, clique no botão azul <strong>"Carteirinha Digital"</strong>.</li>
                   <li>Uma prévia será exibida. Clique em "Imprimir / PDF" para gerar o arquivo físico ou digital.</li>
               </ol>
           </div>
        )
      },
      {
        id: 'q-delete',
        question: 'Por que não consigo excluir um funcionário?',
        tags: ['Admin', 'Erro'],
        likes: 30,
        dislikes: 8,
        link: '/funcionarios',
        answer: (
          <div className="space-y-2">
              <p className="text-sm text-red-600 font-bold flex items-center gap-2">
                  <AlertCircle size={16}/> Trava de Integridade Ativa
              </p>
              <p className="text-sm">
                  Para proteger o histórico médico legal da empresa, o sistema <strong>bloqueia a exclusão</strong> de qualquer funcionário que já tenha recebido uma vacina.
              </p>
              <p className="text-sm bg-bg-base p-2 rounded border border-border">
                  <strong>Solução Recomendada:</strong> Edite o cadastro e altere o status para <strong>Inativo</strong>. Isso remove o funcionário das listas de agendamento, mas preserva o histórico.
              </p>
          </div>
        )
      }
    ]
  },
  {
    id: 'auditoria',
    title: 'Segurança & Auditoria',
    icon: ShieldCheck,
    color: 'text-slate-600',
    questions: [
      {
        id: 'q-audit-what',
        question: 'O que é registrado na Auditoria?',
        tags: ['Admin', 'Segurança'],
        likes: 40,
        dislikes: 0,
        link: '/auditoria',
        answer: (
           <div className="text-sm space-y-2">
               <p>O módulo de auditoria é a "caixa preta" do sistema. Ele registra automaticamente:</p>
               <ul className="list-disc pl-5 text-text-muted">
                   <li>Tentativas de Login (Sucesso/Falha).</li>
                   <li>Criação, Edição e Exclusão de Funcionários.</li>
                   <li>Alterações manuais de Estoque.</li>
                   <li>Registros de vacinação.</li>
               </ul>
               <p>Cada registro contém: <strong>Quem fez, O que fez, Onde fez e Quando fez.</strong></p>
           </div>
        )
      },
      {
        id: 'q-export-audit',
        question: 'Posso entregar esses dados para fiscalização?',
        tags: ['Admin', 'Exportação'],
        likes: 25,
        dislikes: 0,
        link: '/auditoria',
        answer: (
           <p className="text-sm">
               Sim. Na tela de Auditoria, utilize o botão <strong>"Exportar Relatório"</strong> para baixar um arquivo CSV completo e imutável, compatível com Excel, para fins de fiscalização trabalhista ou sanitária.
           </p>
        )
      }
    ]
  }
]

const FILTERS = ['Todos', 'Geral', 'Admin', 'Enfermagem', 'Estoque', 'Segurança'];

// --- COMPONENTE PRINCIPAL ---
export default function AjudaPage() {
  const { data: session } = useSession()
  const isAdmin = (session?.user as any)?.role === 'ADMIN'

  const [categories, setCategories] = useState<Category[]>(INITIAL_DATA)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedKey, setExpandedKey] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState('Todos')
  const [isEditMode, setIsEditMode] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  // Modais
  const [isDocOpen, setIsDocOpen] = useState(false)
  const [isSupportOpen, setIsSupportOpen] = useState(false)
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [videoTitle, setVideoTitle] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  
  // Form Novo Artigo
  const [newQuestion, setNewQuestion] = useState({ categoryId: '', question: '', answer: '' })

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

  // Filtro Avançado
  const filteredCategories = categories.map(cat => ({
      ...cat,
      questions: cat.questions.filter(q => {
          const term = searchTerm.toLowerCase();
          const matchesSearch = q.question.toLowerCase().includes(term);
          const matchesFilter = activeFilter === 'Todos' || q.tags.includes(activeFilter);
          return matchesSearch && matchesFilter;
      })
  })).filter(cat => cat.questions.length > 0);

  // Ações do Admin
  const handleDeleteQuestion = (catId: string, qId: string) => {
      if(!confirm("Tem certeza que deseja excluir este tutorial?")) return;
      setCategories(prev => prev.map(cat => {
          if (cat.id !== catId) return cat;
          return { ...cat, questions: cat.questions.filter(q => q.id !== qId) }
      }))
      toast.success("Conteúdo removido.")
  }

  const handleSaveNewQuestion = () => {
      if (!newQuestion.categoryId || !newQuestion.question || !newQuestion.answer) {
          return toast.warning("Preencha todos os campos.");
      }
      setCategories(prev => prev.map(cat => {
          if (cat.id !== newQuestion.categoryId) return cat;
          return {
              ...cat,
              questions: [...cat.questions, {
                  id: `new-${Date.now()}`,
                  question: newQuestion.question,
                  answer: <p className="text-sm text-text-muted">{newQuestion.answer}</p>,
                  tags: ['Novo'],
                  likes: 0,
                  dislikes: 0,
                  hasVideo: false
              }]
          }
      }))
      setIsAddModalOpen(false); 
      setNewQuestion({ categoryId: '', question: '', answer: '' });
      toast.success("Novo tutorial publicado!");
  }

  const handleOpenVideo = (title: string) => { setVideoTitle(title); setIsVideoOpen(true); }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto space-y-8 pb-20">
      
      {/* --- HEADER --- */}
      <div className="relative text-center space-y-6 py-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-full bg-primary/5 blur-3xl rounded-full -z-10" />

        <motion.div initial={{ y: -20 }} animate={{ y: 0 }}>
            <h1 className="text-4xl font-extrabold text-text-base tracking-tight">Central de Conhecimento</h1>
            <p className="text-text-muted mt-3 text-lg max-w-xl mx-auto">
              Tutoriais interativos, fluxo de operação e documentação completa do UniVac.
            </p>
        </motion.div>
        
        {/* Busca */}
        <div className="relative max-w-xl mx-auto space-y-6">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    {isSearching ? <Loader2 className="text-primary animate-spin" size={20} /> : <Search className="text-primary" size={20} />}
                </div>
                <input
                    type="text"
                    placeholder="Busque por 'Estoque', 'Senha', 'Check-in'..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-full border border-border bg-bg-surface py-4 pl-12 pr-4 text-base shadow-lg shadow-primary/5 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                />
            </div>
            
            {/* Chips */}
            <div className="flex justify-center gap-2 flex-wrap">
                {FILTERS.map(f => (
                    <button key={f} onClick={() => setActiveFilter(f)} disabled={isSearching}
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
        </div>

        {/* Barra Admin */}
        {isAdmin && (
            <div className="flex justify-center items-center gap-4 mt-4 p-2 rounded-lg border border-dashed border-primary/30 w-fit mx-auto bg-bg-surface/50">
                <span className="text-xs font-bold text-primary uppercase flex items-center gap-1"><Lock size={12}/> CMS Admin</span>
                <Switch enabled={isEditMode} onChange={setIsEditMode} label="Modo Edição" />
                {isEditMode && <Button size="sm" onClick={() => setIsAddModalOpen(true)} className="h-7 text-xs"><Plus size={12} className="mr-1"/> Novo Artigo</Button>}
            </div>
        )}
      </div>

      {/* --- CONTEÚDO --- */}
      <div className="grid gap-8 md:grid-cols-12">
        
        {/* FAQ LIST */}
        <div className="md:col-span-8 space-y-6">
            {isSearching ? (
                <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 w-full bg-bg-surface rounded-lg border border-border animate-pulse" />)}</div>
            ) : filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => (
                    <div key={cat.id}>
                        <h2 className="mb-4 text-lg font-bold text-text-base flex items-center gap-2 border-b border-border pb-2">
                            <cat.icon size={20} className={cat.color}/> {cat.title}
                        </h2>
                        <div className="space-y-3">
                            {cat.questions.map((q) => (
                                <QuestionItem 
                                    key={q.id} 
                                    item={q} 
                                    isOpen={expandedKey === q.id} 
                                    onToggle={() => toggleExpand(q.id)} 
                                    router={router} 
                                    onOpenVideo={() => handleOpenVideo(q.question)}
                                    isEditMode={isEditMode}
                                    onDelete={() => handleDeleteQuestion(cat.id, q.id)}
                                />
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-12 bg-bg-surface rounded-xl border border-border border-dashed">
                    <p className="text-text-muted">Nenhum resultado encontrado para o filtro atual.</p>
                    <button onClick={() => {setSearchTerm(''); setActiveFilter('Todos')}} className="text-primary hover:underline mt-2 font-medium">Limpar busca</button>
                </div>
            )}
        </div>

        {/* LATERAL (AÇÕES) */}
        <div className="md:col-span-4 space-y-4">
            <ActionCard icon={BookOpen} color="text-blue-500" bg="bg-blue-100" title="Documentação Técnica" desc="Arquitetura e API." onClick={() => setIsDocOpen(true)} />
            <ActionCard icon={LifeBuoy} color="text-primary" bg="bg-primary/10" title="Suporte UNIVÁS" desc="Abra um chamado." onClick={() => setIsSupportOpen(true)} />
        </div>
      </div>

      {/* --- MODAIS --- */}
      <Modal isOpen={isDocOpen} onClose={() => setIsDocOpen(false)} title="Ficha Técnica do Sistema">
         <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <TechItem icon={Code} label="Frontend" value="Next.js 14 (App Router)" />
                <TechItem icon={Database} label="Database" value="Neon Postgres" />
                <TechItem icon={Server} label="ORM" value="Prisma" />
                <TechItem icon={ShieldCheck} label="Security" value="NextAuth v5" />
            </div>
            <div className="p-4 bg-bg-base rounded-lg border border-border">
                <h4 className="font-bold text-sm mb-2">Sobre o UniVac</h4>
                <p className="text-xs text-text-muted">Sistema de gestão de saúde corporativa desenvolvido como Projeto Integrador. Versão 1.2.0 - Build de Produção.</p>
            </div>
            <div className="flex justify-end"><Button onClick={() => setIsDocOpen(false)}>Fechar</Button></div>
         </div>
      </Modal>

      <Modal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} title="Abrir Chamado - TI UNIVÁS">
         <SupportForm onClose={() => setIsSupportOpen(false)} />
      </Modal>

      {/* Modal Novo Artigo */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Criar Novo Tópico">
         <div className="space-y-4">
            <Select label="Categoria" id="cat" value={newQuestion.categoryId} onChange={e => setNewQuestion({...newQuestion, categoryId: e.target.value})}>
                <option value="">Selecione...</option>
                {INITIAL_DATA.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </Select>
            <Input label="Pergunta" id="q" value={newQuestion.question} onChange={e => setNewQuestion({...newQuestion, question: e.target.value})} />
            <div>
                <label className="text-sm font-medium mb-1 block">Resposta (Texto ou HTML Simples)</label>
                <textarea className="w-full h-32 p-2 rounded border border-border bg-bg-base text-text-base" value={newQuestion.answer as string} onChange={e => setNewQuestion({...newQuestion, answer: e.target.value})} />
            </div>
            <div className="flex justify-end gap-2"><Button onClick={handleSaveNewQuestion}>Publicar</Button></div>
         </div>
      </Modal>

      {/* Modal Vídeo */}
      <Modal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} title={`Tutorial: ${videoTitle}`}>
         <div className="space-y-4">
             <div className="aspect-video w-full bg-black rounded-lg flex items-center justify-center relative overflow-hidden group cursor-pointer shadow-lg border border-gray-800">
                 <div className="absolute inset-0 bg-[url('/univas-si.png')] bg-cover bg-center opacity-40 group-hover:opacity-30 transition-opacity"></div>
                 <div className="relative z-10 h-20 w-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50 group-hover:scale-110 transition-transform">
                    <PlayCircle size={48} className="text-white fill-white" />
                 </div>
                 <p className="absolute bottom-4 left-4 text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">Simulação de Player • 02:34</p>
             </div>
             <div className="flex justify-end"><Button variant="secondary" onClick={() => setIsVideoOpen(false)}>Fechar Player</Button></div>
         </div>
      </Modal>

    </motion.div>
  )
}

// --- SUB-COMPONENTES ---

function Info({ size, className }: any) { return <AlertCircle size={size} className={className} /> } // Alias para uso interno

function QuestionItem({ item, isOpen, onToggle, router, onOpenVideo, isEditMode, onDelete }: any) {
    const [feedback, setFeedback] = useState<null | 'up' | 'down'>(null);

    return (
        <div className={`overflow-hidden rounded-lg border bg-bg-surface transition-all duration-200 ${isOpen ? 'border-primary/40 shadow-md ring-1 ring-primary/5' : 'border-border hover:border-primary/20'}`}>
            <div className="flex w-full items-center justify-between p-4">
                <button onClick={onToggle} className="flex-grow flex items-center gap-3 text-left focus:outline-none group">
                    <div className={`p-2 rounded-md bg-bg-base text-muted-foreground group-hover:text-primary transition-colors`}>
                        <HelpCircle size={18} />
                    </div>
                    <span className="font-medium text-text-base group-hover:text-primary transition-colors">{item.question}</span>
                </button>
                
                <div className="flex items-center gap-2">
                    {isEditMode && (
                        <div className="flex items-center mr-2 border-r border-border pr-2">
                            <button className="p-1.5 text-text-muted hover:text-blue-500 transition-colors"><Edit3 size={16}/></button>
                            <button onClick={onDelete} className="p-1.5 text-text-muted hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                        </div>
                    )}
                    {isEditMode && (
                        <div className="flex items-center gap-2 text-xs text-text-muted mr-4 bg-bg-base px-2 py-1 rounded">
                            <span className="flex items-center gap-1 text-green-600"><ThumbsUp size={10}/> {item.likes}</span>
                            <span className="flex items-center gap-1 text-red-500"><ThumbsDown size={10}/> {item.dislikes}</span>
                        </div>
                    )}
                    <ChevronDown onClick={onToggle} className={`h-5 w-5 text-text-muted cursor-pointer transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>
            
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

                            {!isEditMode && (
                                <div className="mt-4 flex items-center gap-4 text-xs text-text-muted/70 bg-bg-base/50 p-2 rounded w-fit">
                                    <span>Isso foi útil?</span>
                                    <div className="flex gap-1">
                                        <button onClick={() => { setFeedback('up'); toast.success("Obrigado!") }} className={`p-1 rounded hover:bg-green-100 hover:text-green-600 ${feedback === 'up' ? 'text-green-600 bg-green-50' : ''}`}><ThumbsUp size={14}/></button>
                                        <button onClick={() => { setFeedback('down'); toast.info("Entendido.") }} className={`p-1 rounded hover:bg-red-100 hover:text-red-600 ${feedback === 'down' ? 'text-red-600 bg-red-50' : ''}`}><ThumbsDown size={14}/></button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function ActionCard({ icon: Icon, title, desc, onClick, color, bg }: any) {
    return (
        <motion.button onClick={onClick} whileHover={{ y: -2 }} className="w-full text-left group relative overflow-hidden rounded-xl bg-bg-surface p-6 border border-border hover:border-primary/50 transition-all shadow-sm hover:shadow-md">
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}><Icon size={64} /></div>
            <div className="relative z-10">
                <div className={`h-10 w-10 rounded-lg ${bg} ${color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}><Icon size={20} /></div>
                <h3 className="font-bold text-text-base">{title}</h3>
                <p className="text-sm text-text-muted mt-1">{desc}</p>
            </div>
        </motion.button>
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