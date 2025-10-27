'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Palette, ShieldCheck, Languages, Save, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useTheme } from 'next-themes'

// Importe os componentes de UI necessários
import { Switch } from '@/components/ui/Switch'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'

export default function ConfiguracoesPage() {
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Estados locais para as configurações
  const [notificacoesEmail, setNotificacoesEmail] = useState(true)
  const [idioma, setIdioma] = useState('pt-BR')
  const [itensPorPagina, setItensPorPagina] = useState('10')

  // Estado para feedback de "salvo"
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Função para simular o salvamento
  const handleSaveSettings = async () => {
    setIsSaving(true); setSaveSuccess(false);
    console.log("Salvando (Mock):", { tema: theme, notificacoesEmail, idioma, itensPorPagina });
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false); setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  }

  // Animações
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const itemVariants = { hidden: { y: 15, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  if (!mounted) { 
    return <div className="flex h-full min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary"></div></div>;
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8 max-w-4xl mx-auto">

      {/* Título */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-text-base"> Configurações </h1>
        <p className="text-text-muted">Ajuste as preferências do sistema.</p>
      </motion.div>

      {/* Feedback messages */}
        <AnimatePresence>
         {saveSuccess && (
           <motion.div
             key="save-success" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
             className="mb-6 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-700 shadow-sm dark:border-green-800 dark:bg-green-900/30 dark:text-green-300"
           > <CheckCircle size={18} /> Configurações salvas com sucesso! </motion.div>
         )}
        </AnimatePresence>


      {/* Secção: Aparência */}
      <motion.div variants={itemVariants} className="rounded-lg bg-bg-surface p-6 shadow-md space-y-4">
        <h2 className="text-xl font-semibold text-text-base flex items-center gap-2 border-b pb-3 border-border"> <Palette size={20}/> Aparência </h2>
        <div>
           <label className="block text-sm font-medium text-text-base mb-1">Tema da Interface</label>
           <p className="text-xs text-text-muted mb-3">Escolha como a interface será exibida.</p>
           <div className="flex flex-col sm:flex-row gap-3">
              {(['light', 'dark', 'system'] as const).map((t) => (
                 <button key={t} onClick={() => setTheme(t)}
                  className={`flex-1 rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                    theme === t
                      ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary' // Ativo (OK)
                      : 'border-border text-text-muted hover:bg-border' // Inativo
                  }`}
                >
                   {t === 'light' ? 'Claro' : t === 'dark' ? 'Escuro' : 'Padrão do Sistema'}
                 </button>
              ))}
           </div>
        </div>
      </motion.div>

      {/* Secção: Notificações */}
       <motion.div variants={itemVariants} className="rounded-lg bg-bg-surface p-6 shadow-md space-y-4">
        <h2 className="text-xl font-semibold text-text-base flex items-center gap-2 border-b pb-3 border-border"> <Bell size={20}/> Notificações </h2>
        <div className="flex items-center justify-between">
           <div>
             <label htmlFor="notif-email-toggle" className="block text-sm font-medium text-text-base">Receber notificações por email</label>
             <p className="text-xs text-text-muted">Alertas sobre agendamentos e vacinas pendentes.</p>
           </div>
           <Switch enabled={notificacoesEmail} onChange={setNotificacoesEmail} srLabel="Ativar notificações por email" />
        </div>
      </motion.div>

       {/* Secção: Preferências Gerais */}
       <motion.div variants={itemVariants} className="rounded-lg bg-bg-surface p-6 shadow-md space-y-4">
         <h2 className="text-xl font-semibold text-text-base flex items-center gap-2 border-b pb-3 border-border"> <Languages size={20}/> Preferências Gerais </h2>
         <div>
           <Select
             id="idioma-select"
             label="Idioma"
             value={idioma}
             onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setIdioma(e.target.value)}
             className="max-w-xs"
           >
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en-US" disabled>Inglês (EUA) - Indisponível</option>
              <option value="es-ES" disabled>Espanhol - Indisponível</option>
           </Select>
         </div>
          <div>
           <Select
             id="itens-pagina-select"
             label="Itens por página nas tabelas"
             value={itensPorPagina}
             onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setItensPorPagina(e.target.value)}
             className="max-w-xs"
           >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
           </Select>
         </div>
      </motion.div>

       {/* Secção: Segurança (Placeholder) */}
       <motion.div variants={itemVariants} className="rounded-lg bg-bg-surface p-6 shadow-md space-y-4">
         <h2 className="text-xl font-semibold text-text-base flex items-center gap-2 border-b pb-3 border-border"> <ShieldCheck size={20}/> Segurança </h2>
         <p className="text-sm text-text-muted">Opções como autenticação de dois fatores poderiam ser configuradas aqui.</p>
      </motion.div>

      {/* Botão Salvar Configurações */}
      <motion.div variants={itemVariants} className="flex justify-end pt-4 border-t border-border">
         <Button onClick={handleSaveSettings} variant="primary" disabled={isSaving || saveSuccess} className="flex min-w-[180px] items-center justify-center gap-2 px-6 py-3 text-base font-medium" >
           {isSaving ? ( <> <Loader2 className="h-5 w-5 animate-spin" /> Salvando... </> )
            : saveSuccess ? ( <> <CheckCircle size={18} /> Salvo com Sucesso! </> )
            : ( <> <Save size={18} /> Salvar Configurações </> )
           }
         </Button>
      </motion.div>

    </motion.div>
  )
}