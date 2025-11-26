'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { Loader2, User, Lock, Save } from 'lucide-react'
import { toast } from 'sonner'

// Função auxiliar para iniciais
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
  
  // Senhas
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmaSenha, setConfirmaSenha] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  // Carrega dados da sessão
  useEffect(() => {
    if (session?.user) {
      setNome(session.user.nome || '')
      setEmail(session.user.email || '')
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validações prévias
    if (novaSenha) {
        if (novaSenha.length < 6) {
            toast.warning('A nova senha deve ter no mínimo 6 caracteres.')
            return
        }
        if (novaSenha !== confirmaSenha) {
            toast.error('As novas senhas não coincidem.')
            return
        }
        // Nota: Validação de senhaAtual deve ser feita no backend para segurança real,
        // mas aqui podemos bloquear o envio se estiver vazio.
        if (!senhaAtual) {
             toast.warning('Digite a sua senha atual para definir uma nova.')
             return
        }
    }

    setIsLoading(true)
    
    // Recupera ID do usuário (type casting necessário devido à customização do NextAuth)
    const userId = (session?.user as any)?.id;

    if (!userId) {
        toast.error("Erro de sessão. Recarregue a página.");
        setIsLoading(false);
        return;
    }

    try {
      // Prepara o payload
      const body: any = { nome }
      
      // Só manda senha se o usuário preencheu
      if (novaSenha) {
          body.senha = novaSenha;
          // Idealmente, enviaríamos a senhaAtual para o backend verificar antes de trocar
      }

      // Chamada API Real
      const res = await fetch(`/api/funcionarios/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
      })

      if (!res.ok) throw new Error('Falha ao atualizar perfil')

      // Sucesso!
      toast.success('Perfil atualizado com sucesso!')
      
      // Limpa campos de senha
      setSenhaAtual('')
      setNovaSenha('')
      setConfirmaSenha('')

      // Atualiza a sessão do NextAuth no navegador para refletir o novo nome sem reload
      if (session?.user?.nome !== nome) {
        await update({ ...session, user: { ...session?.user, nome } })
      }

    } catch (error: any) {
      console.error('Erro:', error)
      toast.error('Erro ao atualizar o perfil.')
    } finally {
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
  
  if (status === 'unauthenticated') return <p className="text-center mt-10">Acesso negado.</p>

  const userInitials = getInitials(nome || session?.user?.nome || '')

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-3xl rounded-2xl bg-bg-surface p-8 shadow-lg border border-border"
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

        <h1 className="text-3xl font-bold text-text-base">{nome}</h1>
        <p className="mt-1 text-text-muted">{email}</p>
      </motion.div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Dados Pessoais */}
        <motion.div
          variants={itemVariants}
          className="rounded-xl bg-bg-base/50 p-6 shadow-sm border border-border"
        >
          <h2 className="mb-4 text-xl font-semibold text-text-base flex items-center gap-2">
            <User size={20} className="text-primary"/> Informações Pessoais
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
            />
            <div>
              <label className="block text-sm font-medium text-text-base mb-1">
                Email (Somente leitura)
              </label>
              <div className="px-3 py-2 rounded border border-border bg-bg-base text-text-muted cursor-not-allowed">
                {email}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Alterar Senha */}
        <motion.div
          variants={itemVariants}
          className="rounded-xl bg-bg-base/50 p-6 shadow-sm border border-border"
        >
          <h2 className="mb-4 text-xl font-semibold text-text-base flex items-center gap-2">
            <Lock size={20} className="text-primary"/> Alterar Senha
            <span className="text-sm font-normal text-text-muted ml-auto">
              (Preencha apenas se quiser alterar)
            </span>
          </h2>
          <div className="space-y-4">
            {/* Nota: O campo "Senha Atual" é visual aqui. 
               Para ser funcional, o backend precisaria validar a senha antiga antes do update.
               No MVP, confiamos na sessão logada.
            */}
            <Input
              id="senhaAtual"
              label="Senha Atual"
              type="password"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              autoComplete="current-password"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                id="novaSenha"
                label="Nova Senha"
                type="password"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                disabled={isLoading}
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
                autoComplete="new-password"
                />
            </div>
          </div>
        </motion.div>

        {/* Botão Salvar */}
        <motion.div
          variants={itemVariants}
          className="flex justify-end pt-4"
        >
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 rounded-lg px-8 py-3 text-base font-medium shadow-md transition-all w-full md:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Salvando...
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