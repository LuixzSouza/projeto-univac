'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Loader2, User, Lock, Save, Camera, QrCode, 
  Activity, ShieldCheck, Mail, Calendar, MapPin, Upload
} from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

// --- SUB-COMPONENTES ---

// 1. CRACHÁ DIGITAL
function DigitalIDCard({ user, role }: any) {
    return (
        <div className="relative w-full max-w-md mx-auto aspect-[1.58/1] bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 transform transition-transform hover:scale-[1.02] duration-300">
            {/* Background Design */}
            <div className="absolute top-0 left-0 w-32 h-full bg-green-600 z-0"></div>
            <div className="absolute top-0 left-28 w-0 h-0 border-l-[50px] border-l-green-600 border-b-[300px] border-b-transparent z-0"></div>
            
            {/* Logo Watermark */}
            <div className="absolute bottom-4 right-4 opacity-10">
                <ShieldCheck size={120} />
            </div>

            <div className="relative z-10 flex h-full items-center p-6 gap-6">
                {/* Foto */}
                <div className="flex-shrink-0 flex flex-col items-center gap-2">
                    <div className="h-28 w-28 rounded-xl bg-slate-200 border-4 border-white shadow-md overflow-hidden relative">
                         {/* Simulação de foto - usaria user.image na real */}
                        <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center text-slate-500 text-3xl font-bold">
                            {user.nome?.charAt(0)}
                        </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-black/20 px-2 py-1 rounded">
                        {role}
                    </span>
                </div>

                {/* Dados */}
                <div className="flex-grow space-y-1">
                    <h3 className="text-2xl font-bold text-slate-900 leading-tight">{user.nome}</h3>
                    <p className="text-sm text-slate-500 font-medium">{user.email}</p>
                    
                    <div className="pt-4 flex items-center gap-4">
                        <div className="bg-white p-1 rounded shadow-sm border border-slate-100">
                             <QrCode size={54} className="text-slate-800"/>
                        </div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider leading-relaxed">
                            <p>ID: {user.id?.substring(0,8).toUpperCase()}</p>
                            <p>Válido até: DEZ/2025</p>
                            <p className="text-green-600 font-bold">● ATIVO</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function PerfilPage() {
  const { data: session, status, update } = useSession()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Estados de Form
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [cargo, setCargo] = useState('')
  const [telefone, setTelefone] = useState('')
  
  // Senhas
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmaSenha, setConfirmaSenha] = useState('')

  // UI States
  const [activeTab, setActiveTab] = useState<'geral' | 'cracha' | 'seguranca'>('geral')
  const [isLoading, setIsLoading] = useState(false)

  // Carrega dados
  useEffect(() => {
    if (session?.user) {
      setNome(session.user.nome || '')
      setEmail(session.user.email || '')
      setCargo((session.user as any).role || 'Funcionário')
      // Mock de telefone pois não temos no banco ainda
      setTelefone('(35) 99999-8888') 
    }
  }, [session])

  // --- HANDLERS ---

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const userId = (session?.user as any)?.id;

    try {
       // Simulação de delay de rede
       await new Promise(r => setTimeout(r, 1000));
       
       const res = await fetch(`/api/funcionarios/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome }) // Na prática enviaria telefone também
       })

       if (!res.ok) throw new Error()

       toast.success("Perfil atualizado!", { description: "Suas informações foram salvas." })
       if (session?.user?.nome !== nome) {
          await update({ ...session, user: { ...session?.user, nome } })
       }
    } catch (err) {
       toast.error("Erro ao atualizar.")
    } finally {
       setIsLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (novaSenha !== confirmaSenha) return toast.error("Senhas não coincidem")
    if (novaSenha.length < 6) return toast.error("Senha muito curta")
    
    setIsLoading(true)
    const userId = (session?.user as any)?.id;

    try {
        await fetch(`/api/funcionarios/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ senha: novaSenha })
        })
        toast.success("Senha alterada com sucesso!")
        setSenhaAtual(''); setNovaSenha(''); setConfirmaSenha('');
    } catch (e) {
        toast.error("Erro ao alterar senha.")
    } finally {
        setIsLoading(false)
    }
  }

  const handlePhotoUpload = () => {
      // Simula upload
      toast.promise(new Promise(r => setTimeout(r, 2000)), {
          loading: 'Enviando foto...',
          success: 'Foto de perfil atualizada!',
          error: 'Erro no upload.'
      })
  }

  if (status === 'loading') return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary" size={32}/></div>

  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="max-w-5xl mx-auto pb-20"
    >
      
      {/* --- CAPA E HEADER --- */}
      <div className="relative mb-20">
        {/* Capa (Banner) */}
        <div className="h-48 w-full rounded-xl bg-gradient-to-r from-green-600 to-teal-500 relative overflow-hidden shadow-md">
             <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
             <div className="absolute bottom-4 right-4">
                 <Button variant="secondary" size="sm" className="bg-white/20 text-white border-white/20 hover:bg-white/30 backdrop-blur-sm">
                    <Camera size={16} className="mr-2"/> Alterar Capa
                 </Button>
             </div>
        </div>

        {/* Avatar e Infos Principais (Sobrepostos) */}
        <div className="absolute -bottom-16 left-8 flex items-end gap-6">
            <div className="relative group">
                <div className="h-32 w-32 rounded-full border-4 border-bg-base bg-slate-200 shadow-xl flex items-center justify-center text-4xl font-bold text-slate-500 overflow-hidden">
                    {/* Imagem Real viria aqui */}
                    {nome.charAt(0)}
                </div>
                <button 
                    onClick={handlePhotoUpload}
                    className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-transform hover:scale-110"
                    title="Alterar Foto"
                >
                    <Camera size={18} />
                </button>
            </div>
            <div className="mb-2">
                <h1 className="text-3xl font-bold text-text-base">{nome}</h1>
                <p className="text-text-muted flex items-center gap-2">
                    {email} <span className="w-1 h-1 rounded-full bg-slate-300"></span> <span className="text-primary font-medium capitalize">{cargo.toLowerCase()}</span>
                </p>
            </div>
        </div>
      </div>

      {/* --- NAVEGAÇÃO (TABS) --- */}
      <div className="flex border-b border-border mb-8">
         <button onClick={() => setActiveTab('geral')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'geral' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-base'}`}>
            Dados Pessoais
         </button>
         <button onClick={() => setActiveTab('cracha')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'cracha' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-base'}`}>
            Meu Crachá
         </button>
         <button onClick={() => setActiveTab('seguranca')} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'seguranca' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-base'}`}>
            Segurança
         </button>
      </div>

      {/* --- CONTEÚDO --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Coluna Principal (Esquerda) */}
         <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode='wait'>
                
                {/* ABA GERAL */}
                {activeTab === 'geral' && (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} key="geral">
                        <div className="bg-bg-surface p-6 rounded-xl border border-border shadow-sm">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><User size={20}/> Editar Perfil</h2>
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Nome Completo" id="nome" value={nome} onChange={e => setNome(e.target.value)} />
                                    <Input label="Telefone / Celular" id="tel" value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="(00) 00000-0000" />
                                </div>
                                <Input label="Email" id="email" value={email} disabled className="bg-bg-base opacity-70" />
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Cargo" id="cargo" value={cargo} disabled className="bg-bg-base opacity-70" />
                                    <Input label="Departamento" id="dept" value="Enfermagem" disabled className="bg-bg-base opacity-70" />
                                </div>

                                <div className="flex justify-end pt-2">
                                    <Button type="submit" variant="primary" disabled={isLoading}>
                                        {isLoading ? <Loader2 className="animate-spin"/> : <Save size={18} className="mr-2"/>}
                                        Salvar Alterações
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}

                {/* ABA CRACHÁ */}
                {activeTab === 'cracha' && (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} key="cracha">
                        <div className="bg-bg-surface p-8 rounded-xl border border-border shadow-sm flex flex-col items-center gap-8">
                             <div className="text-center max-w-md">
                                 <h2 className="text-xl font-bold mb-2">Identidade Funcional Digital</h2>
                                 <p className="text-text-muted text-sm">Utilize este QR Code nos leitores de acesso do hospital ou para registrar presença em treinamentos.</p>
                             </div>
                             
                             <DigitalIDCard user={{ nome, email, id: (session?.user as any)?.id }} role={cargo} />

                             <Button variant="secondary" onClick={() => toast.info("Enviado para impressão.")}>
                                 <Printer size={18} className="mr-2"/> Imprimir Crachá
                             </Button>
                        </div>
                    </motion.div>
                )}

                {/* ABA SEGURANÇA */}
                {activeTab === 'seguranca' && (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} key="seguranca">
                        <div className="bg-bg-surface p-6 rounded-xl border border-border shadow-sm space-y-6">
                            <div>
                                <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Lock size={20}/> Alterar Senha</h2>
                                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                                    <Input type="password" label="Senha Atual" id="senha_atual" value={senhaAtual} onChange={e => setSenhaAtual(e.target.value)} />
                                    <Input type="password" label="Nova Senha" id="nova_senha" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} />
                                    <Input type="password" label="Confirmar Nova Senha" id="confirma_senha" value={confirmaSenha} onChange={e => setConfirmaSenha(e.target.value)} />
                                    <Button type="submit" variant="primary" disabled={isLoading}>Atualizar Senha</Button>
                                </form>
                            </div>
                            
                            <div className="border-t border-border pt-6">
                                <h3 className="font-semibold text-base mb-3">Sessões Ativas</h3>
                                <div className="bg-bg-base p-3 rounded border border-border flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Activity size={20}/></div>
                                        <div>
                                            <p className="text-sm font-bold">Este Dispositivo</p>
                                            <p className="text-xs text-text-muted">Chrome • Windows • Pouso Alegre, BR</p>
                                        </div>
                                    </div>
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Online</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
         </div>

         {/* Coluna Lateral (Direita) - Widgets */}
         <div className="space-y-6">
             {/* Progresso do Perfil */}
             <div className="bg-bg-surface p-5 rounded-xl border border-border shadow-sm">
                 <h3 className="font-bold text-sm mb-3">Completude do Perfil</h3>
                 <div className="flex items-end gap-2 mb-2">
                     <span className="text-2xl font-bold text-primary">85%</span>
                     <span className="text-xs text-text-muted mb-1">Excelente!</span>
                 </div>
                 <div className="w-full h-2 bg-bg-base rounded-full overflow-hidden">
                     <div className="h-full bg-primary w-[85%]"></div>
                 </div>
                 <ul className="mt-4 space-y-2 text-xs text-text-muted">
                     <li className="flex items-center gap-2 text-green-600"><CheckCircle2 size={14}/> Email Verificado</li>
                     <li className="flex items-center gap-2 text-green-600"><CheckCircle2 size={14}/> Senha Forte</li>
                     <li className="flex items-center gap-2 text-text-muted opacity-50"><div className="w-3.5 h-3.5 border border-current rounded-full"/> Adicionar Foto Real</li>
                 </ul>
             </div>

             {/* Widget de Contato RH */}
             <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-800">
                 <h3 className="font-bold text-blue-700 dark:text-blue-300 text-sm mb-2 flex items-center gap-2">
                    <Mail size={16}/> Precisa de ajuda?
                 </h3>
                 <p className="text-xs text-blue-600/80 dark:text-blue-400 mb-3">
                    Para alterar dados sensíveis como CPF ou Registro, entre em contato com o RH.
                 </p>
                 <a href="mailto:rh@univas.edu.br" className="text-xs font-bold text-blue-700 hover:underline">rh@univas.edu.br</a>
             </div>
         </div>

      </div>

    </motion.div>
  )
}

import { CheckCircle2, Printer } from 'lucide-react' // Add missing imports for compilation