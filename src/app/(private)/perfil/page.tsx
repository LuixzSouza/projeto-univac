'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, User, Lock, Save, CheckCircle, XCircle } from 'lucide-react'

// Função auxiliar para pegar as iniciais do nome
function getInitials(name: string): string {
  if (!name) return '?'
  const names = name.split(' ')
  const initials = names.filter(Boolean).map((n) => n[0]).join('')
  return initials.length > 1 ? initials.substring(0, 2) : initials
}

export default function PerfilPage() {
  const { data: session, status, update } = useSession()

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmaSenha, setConfirmaSenha] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (session?.user) {
      setNome(session.user.nome || '')
      setEmail(session.user.email || '')
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccessMessage('')
    setErrorMessage('')

    if (novaSenha && novaSenha.length < 6) {
      setErrorMessage('A nova senha deve ter no mínimo 6 caracteres.')
      setIsLoading(false)
      return
    }
    if (novaSenha && novaSenha !== confirmaSenha) {
      setErrorMessage('As novas senhas não coincidem.')
      setIsLoading(false)
      return
    }
    if (novaSenha && !senhaAtual) {
      setErrorMessage('Digite a sua senha atual para definir uma nova.')
      setIsLoading(false)
      return
    }

    const dadosParaSalvar: any = { nome }
    if (novaSenha) {
      dadosParaSalvar.novaSenha = novaSenha
      dadosParaSalvar.senhaAtual = senhaAtual
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSenhaAtual('')
      setNovaSenha('')
      setConfirmaSenha('')
      setIsLoading(false)
      setSuccessMessage('Perfil atualizado com sucesso!')

      if (session?.user?.nome !== nome) {
        await update({ user: { nome } })
      }

      setTimeout(() => setSuccessMessage(''), 4000)
    } catch (error: any) {
      console.error('Erro ao salvar:', error)
      setErrorMessage(error.message || 'Erro ao atualizar o perfil.')
      setIsLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  }
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  }

  if (status === 'loading') {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary"></div>
      </div>
    )
  }
  if (status === 'unauthenticated') return <p>Não autorizado.</p>

  const userInitials = getInitials(session?.user?.nome || '')

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-3xl rounded-2xl bg-bg-surface p-8 shadow-2xl border border-border"
    >
      <motion.div
        variants={itemVariants}
        className="mb-10 flex flex-col items-center border-b border-border pb-6"
      >
        <div className="relative mb-5">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-5xl font-extrabold text-white shadow-lg ring-4 ring-green-300/30 dark:ring-green-500/20">
            {userInitials.toUpperCase()}
          </div>
          <div className="absolute -bottom-2 right-1 bg-green-500 h-5 w-5 rounded-full border-2 border-bg-surface"></div>
        </div>

        <h1 className="text-3xl font-bold text-text-base">Meu Perfil</h1>
        <p className="mt-1 text-text-muted">{email || session?.user?.email}</p>
      </motion.div>

      <AnimatePresence>
        {successMessage && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-700 shadow-sm dark:border-green-800 dark:bg-green-900/30 dark:text-green-300"
          >
            <CheckCircle size={18} /> {successMessage}
          </motion.div>
        )}
        {errorMessage && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700 shadow-sm dark:border-red-800 dark:bg-red-900/30 dark:text-red-300"
          >
            <XCircle size={18} /> {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-10">
        <motion.div
          variants={itemVariants}
          className="rounded-xl bg-bg-base backdrop-blur-md p-6 shadow-sm border border-border"
        >
          <h2 className="mb-4 text-xl font-semibold text-text-base">
            Informações Pessoais
          </h2>
          <div className="space-y-4">
            <Input
              id="nome"
              label="Nome Completo"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              disabled={isLoading}
              icon={User}
            />
            <div>
              <label className="block text-sm font-medium text-text-base">
                Email
              </label>
              <p className="mt-1 text-text-muted break-words">
                {email || 'N/A'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Alterar senha */}
        <motion.div
          variants={itemVariants}
          className="rounded-xl bg-bg-base backdrop-blur-md p-6 shadow-sm border border-border"
        >
          <h2 className="mb-4 text-xl font-semibold text-text-base">
            Alterar Senha{' '}
            <span className="text-sm font-normal text-text-muted">
              (Opcional)
            </span>
          </h2>
          <div className="space-y-4">
            <Input
              id="senhaAtual"
              label="Senha Atual"
              type="password"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              placeholder="Digite sua senha atual"
              disabled={isLoading}
              icon={Lock}
              autoComplete="current-password"
            />
            <Input
              id="novaSenha"
              label="Nova Senha"
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              disabled={isLoading}
              icon={Lock}
              autoComplete="new-password"
            />
            <Input
              id="confirmaSenha"
              label="Confirmar Nova Senha"
              type="password"
              value={confirmaSenha}
              onChange={(e) => setConfirmaSenha(e.target.value)}
              placeholder="Repita a nova senha"
              disabled={isLoading}
              icon={Lock}
              autoComplete="new-password"
            />
          </div>
        </motion.div>

        {/* Botão salvar */}
        <motion.div
          variants={itemVariants}
          className="flex justify-end pt-2"
        >
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 rounded-lg px-8 py-3 text-base font-medium text-white shadow-lg transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Processando...
              </>
            ) : (
              <>
                <Save size={18} /> Salvar Alterações
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  )
}
