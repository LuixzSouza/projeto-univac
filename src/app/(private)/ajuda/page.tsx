'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, ChevronDown, ExternalLink, 
  HelpCircle, PlayCircle, FileText, AlertCircle, CheckCircle2, 
  BookOpen, LifeBuoy, Server, Database, Code, Send, Info, MousePointerClick,
  ShieldCheck,
  Syringe,
  Users
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { toast } from 'sonner'

// --- CONTEÚDO RICO E DETALHADO ---
const FAQ_CATEGORIES = [
  {
    id: 'visao-geral',
    title: 'Visão Geral e Dashboard',
    questions: [
      {
        question: 'O que é o UniVac?',
        answer: (
          <div className="space-y-2 text-sm">
            <p>O <strong>UniVac</strong> é o sistema oficial de gestão de imunização da UNIVÁS. Ele centraliza o controle de saúde ocupacional, garantindo que todos os colaboradores estejam com as vacinas em dia.</p>
            <p>Ele substitui as planilhas manuais por um sistema seguro, integrado e auditável.</p>
          </div>
        ),
        link: null
      },
      {
        question: 'Entendendo os Gráficos do Painel',
        answer: (
          <div className="space-y-3 text-sm">
            <p>O Dashboard apresenta dados em tempo real:</p>
            <ul className="list-disc pl-5 space-y-1 text-text-muted">
              <li><strong>Cobertura Vacinal (Pizza):</strong> Mostra a porcentagem da empresa que já cumpriu o protocolo obrigatório.</li>
              <li><strong>Catálogo (Rosca):</strong> Proporção entre vacinas obrigatórias (ex: Tétano, Hepatite) e opcionais (ex: Gripe).</li>
              <li><strong>Tendência (Linha):</strong> Mostra o volume de aplicações realizadas nos últimos dias.</li>
            </ul>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-300 flex gap-2 items-start">
              <Info size={16} className="mt-0.5 shrink-0"/>
              <p>Os dados são atualizados a cada nova aplicação registrada.</p>
            </div>
          </div>
        ),
        link: '/dashboard'
      }
    ]
  },
  {
    id: 'funcionarios',
    title: 'Gestão de Pessoas',
    questions: [
      {
        question: 'Como cadastrar um novo funcionário?',
        answer: (
          <div className="space-y-2 text-sm">
            <ol className="list-decimal pl-5 space-y-1 font-medium">
              <li>Acesse o menu <strong>Funcionários</strong>.</li>
              <li>Clique no botão <strong>"Adicionar Funcionário"</strong> no topo direito.</li>
              <li>Preencha os dados obrigatórios (Nome, Email, CPF e Registro).</li>
              <li>Defina uma senha inicial (o funcionário poderá trocar depois).</li>
            </ol>
          </div>
        ),
        link: '/funcionarios'
      },
      {
        question: 'Por que não consigo excluir um funcionário?',
        answer: (
          <div className="space-y-3 text-sm">
            <p>O sistema possui uma trava de segurança para proteger o histórico médico.</p>
            <p><strong>Se o funcionário já tomou alguma vacina registrada no sistema, ele não pode ser excluído</strong>, pois isso apagaria o histórico legal da vacinação.</p>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border border-yellow-100 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 flex gap-2 items-start">
              <AlertCircle size={16} className="mt-0.5 shrink-0"/>
              <p><strong>Solução:</strong> Em vez de excluir, edite o funcionário e mude o Status para <strong>Inativo</strong>. Assim ele não aparece mais nas listas de agendamento.</p>
            </div>
          </div>
        ),
        link: '/funcionarios'
      }
    ]
  },
  {
    id: 'vacinas',
    title: 'Vacinas e Obrigatoriedade',
    questions: [
      {
        question: 'Qual a diferença entre Vacina Obrigatória e Opcional?',
        answer: (
          <div className="space-y-2 text-sm">
            <ul className="space-y-2">
              <li>
                <span className="font-bold text-primary">Obrigatória:</span> Conta para o cálculo de conformidade. Se o funcionário não tomar, o status dele ficará "Pendente" (Vermelho) no painel.
              </li>
              <li>
                <span className="font-bold text-text-muted">Opcional:</span> Registra no histórico, mas não afeta o status de conformidade do funcionário (ex: Campanhas de Gripe anuais).
              </li>
            </ul>
          </div>
        ),
        link: '/vacinas'
      },
      {
        question: 'Como cadastrar um novo tipo de imunizante?',
        answer: (
          <p className="text-sm">
            Vá em <strong>Vacinas</strong> {'>'} <strong>Adicionar Tipo</strong>. Defina o nome e se ela é exigida pela empresa. Uma vez criada, ela aparecerá nas opções de agendamento.
          </p>
        ),
        link: '/vacinas'
      }
    ]
  },
  {
    id: 'operacao',
    title: 'Agenda e Registro (Dia a Dia)',
    questions: [
      {
        question: 'Como funciona o fluxo ideal de vacinação?',
        answer: (
          <div className="space-y-3 text-sm">
            <p>O sistema foi desenhado para o seguinte fluxo:</p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 p-2 bg-bg-base rounded border border-border">
                <span className="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span><strong>Agendar:</strong> Marque o dia na Agenda.</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-bg-base rounded border border-border">
                <span className="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <span><strong>Aplicar:</strong> O funcionário comparece ao local.</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-bg-base rounded border border-border">
                <span className="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <span><strong>Check-in:</strong> Na agenda, clique no evento e confirme a aplicação.</span>
              </div>
            </div>
          </div>
        ),
        link: '/agenda'
      },
      {
        question: 'Posso registrar uma vacina sem agendar antes?',
        answer: (
          <div className="space-y-2 text-sm">
            <p><strong>Sim!</strong> É comum em campanhas "relâmpago" ou atendimentos não previstos.</p>
            <p>No Dashboard ou na lista de Vacinas, clique no botão <strong>"Registrar Aplicação"</strong>. Preencha os dados e salve. O registro irá direto para o histórico do funcionário, sem passar pela agenda.</p>
          </div>
        ),
        link: '/dashboard'
      },
      {
        question: 'O funcionário faltou. O que eu faço?',
        answer: (
          <p className="text-sm">
            Vá na agenda, clique no agendamento e arraste-o para uma nova data (ou edite a data manualmente). O status continuará como "Agendado" até que ele compareça.
          </p>
        ),
        link: '/agenda'
      }
    ]
  }
]

export default function AjudaPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedKey, setExpandedKey] = useState<string | null>(null)
  
  // Estados dos Modais
  const [isDocOpen, setIsDocOpen] = useState(false)
  const [isSupportOpen, setIsSupportOpen] = useState(false)
  
  const router = useRouter()

  const toggleExpand = (key: string) => setExpandedKey(expandedKey === key ? null : key)

  // Filtro de Busca
  const hasSearch = searchTerm.length > 0;
  const filteredQuestions = hasSearch 
    ? FAQ_CATEGORIES.flatMap(cat => cat.questions.map((q, idx) => ({ ...q, category: cat.title, key: `${cat.id}-${idx}` })))
        .filter(q => q.question.toLowerCase().includes(searchTerm.toLowerCase()) || q.answer.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const itemVariants = { hidden: { y: 10, opacity: 0 }, visible: { y: 0, opacity: 1 } }

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible" 
      className="max-w-5xl mx-auto space-y-10 pb-10"
    >
      
      {/* --- CABEÇALHO --- */}
      <div className="relative text-center space-y-6 py-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-full bg-primary/5 blur-3xl rounded-full -z-10" />

        <motion.div variants={itemVariants}>
            <h1 className="text-4xl font-extrabold text-text-base tracking-tight">
              Central de Ajuda <span className="text-primary">UniVac</span>
            </h1>
            <p className="text-text-muted mt-3 text-lg max-w-xl mx-auto">
              Tutoriais, guias e suporte técnico para a equipe de saúde da UNIVÁS.
            </p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="text-primary" size={20} />
            </div>
            <input
                type="text"
                placeholder="Digite sua dúvida... (Ex: Como excluir?)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-full border border-border bg-bg-surface py-4 pl-12 pr-4 text-base shadow-lg shadow-primary/5 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
            />
        </motion.div>
      </div>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <div className="grid gap-8 md:grid-cols-12">
        
        {/* FAQ */}
        <div className="md:col-span-8 space-y-8">
            {hasSearch ? (
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-text-base">Resultados da busca:</h2>
                    {filteredQuestions.length > 0 ? (
                        filteredQuestions.map((q) => (
                            <QuestionItem key={q.key} item={q} isOpen={expandedKey === q.key} onToggle={() => toggleExpand(q.key)} router={router} />
                        ))
                    ) : (
                        <div className="text-center py-12 bg-bg-surface rounded-xl border border-border border-dashed">
                            <p className="text-text-muted">Não encontramos nada para "{searchTerm}".</p>
                            <button onClick={() => setSearchTerm('')} className="text-primary hover:underline mt-2 font-medium">Limpar busca</button>
                        </div>
                    )}
                </div>
            ) : (
                FAQ_CATEGORIES.map((category) => (
                    <motion.div key={category.id} variants={itemVariants}>
                        <h2 className="mb-4 text-lg font-bold text-text-base flex items-center gap-2 border-b border-border pb-2">
                            {category.id === 'primeiros-passos' && <PlayCircle size={20} className="text-blue-500"/>}
                            {category.id === 'tarefas' && <MousePointerClick size={20} className="text-green-500"/>}
                            {category.id === 'funcionarios' && <Users size={20} className="text-purple-500"/>}
                            {category.id === 'vacinas' && <Syringe size={20} className="text-orange-500"/>}
                            {category.id === 'operacao' && <CheckCircle2 size={20} className="text-primary"/>}
                            {category.title}
                        </h2>
                        <div className="space-y-3">
                            {category.questions.map((q, idx) => (
                                <QuestionItem key={`${category.id}-${idx}`} item={q} isOpen={expandedKey === `${category.id}-${idx}`} onToggle={() => toggleExpand(`${category.id}-${idx}`)} router={router} />
                            ))}
                        </div>
                    </motion.div>
                ))
            )}
        </div>

        {/* Barra Lateral */}
        <div className="md:col-span-4 space-y-4">
            <motion.button 
                variants={itemVariants}
                onClick={() => setIsDocOpen(true)}
                className="w-full text-left group relative overflow-hidden rounded-xl bg-bg-surface p-6 border border-border hover:border-primary/50 transition-all shadow-sm hover:shadow-md"
            >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <BookOpen size={64} />
                </div>
                <div className="relative z-10">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Code size={20} />
                    </div>
                    <h3 className="font-bold text-text-base">Documentação Técnica</h3>
                    <p className="text-sm text-text-muted mt-1">Detalhes de API e Banco de Dados.</p>
                </div>
            </motion.button>

            <motion.button 
                variants={itemVariants}
                onClick={() => setIsSupportOpen(true)}
                className="w-full text-left group relative overflow-hidden rounded-xl bg-bg-surface p-6 border border-border hover:border-primary/50 transition-all shadow-sm hover:shadow-md"
            >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
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

      {/* --- MODAIS (Mantenha os mesmos do passo anterior) --- */}
      <Modal isOpen={isDocOpen} onClose={() => setIsDocOpen(false)} title="Ficha Técnica do Sistema">
         <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <TechItem icon={Code} label="Frontend" value="Next.js 14 (App Router)" />
                <TechItem icon={Database} label="Banco de Dados" value="PostgreSQL (Neon DB)" />
                <TechItem icon={Server} label="ORM" value="Prisma" />
                <TechItem icon={ShieldCheck} label="Auth" value="NextAuth v5" />
            </div>
            <div className="flex justify-end"><Button onClick={() => setIsDocOpen(false)}>Fechar</Button></div>
         </div>
      </Modal>

      <Modal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} title="Abrir Chamado - TI UNIVÁS">
         <SupportForm onClose={() => setIsSupportOpen(false)} />
      </Modal>

    </motion.div>
  )
}

// --- SUB-COMPONENTES ---

function QuestionItem({ item, isOpen, onToggle, router }: any) {
    return (
        <div className={`overflow-hidden rounded-lg border bg-bg-surface transition-all duration-200 ${isOpen ? 'border-primary/40 shadow-sm' : 'border-border hover:border-primary/20'}`}>
            <button onClick={onToggle} className="flex w-full items-center justify-between p-4 text-left focus:outline-none group">
                <span className="font-medium text-text-base pr-4 group-hover:text-primary transition-colors">{item.question}</span>
                <ChevronDown className={`h-5 w-5 text-text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                        <div className="px-4 pb-4 text-text-muted leading-relaxed border-t border-border/50 pt-3 text-sm">
                            {item.answer}
                            {item.link && (
                                <div className="mt-3 pt-2">
                                    <Button size="sm" variant="secondary" onClick={() => router.push(item.link)} className="text-primary hover:text-primary-dark h-8 text-xs">
                                        Ir para funcionalidade <ExternalLink size={12} className="ml-2" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
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