'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: email,
        senha: senha,
      })

      if (result?.ok) {
        router.push('/dashboard')
      } else {
        setError('Email ou senha inválidos.')
        setIsLoading(false)
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Ocorreu um erro inesperado. Tente novamente.')
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full flex min-h-screen items-center justify-center bg-bg-base p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <form
          onSubmit={handleSubmit}
          className="w-full rounded-xl bg-bg-surface p-8 shadow-xl border border-border"
          aria-busy={isLoading}
        >
          <div className="mb-8 text-center text-4xl font-bold text-text-base">
            Uni<span className="text-primary">Vac</span>
          </div>

          <h2 className="mb-6 text-center text-xl font-semibold text-text-muted">
            Acesse o Sistema
          </h2>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: '1rem' }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div
                  className="rounded-md border border-red-300 bg-red-50 p-3 text-center text-sm text-red-700 dark:border-red-700 dark:bg-red-900/20 dark:text-red-300"
                  role="alert"
                >
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input de Email */}
          <Input
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError('') 
            }}
            placeholder="admin@vacina.com"
            required
            disabled={isLoading}
          />

          <div className="relative">
            <Input
              id="senha"
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              value={senha}
              onChange={(e) => {
                setSenha(e.target.value)
                setError('') 
              }}
              placeholder="Digite sua senha"
              required
              disabled={isLoading}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute right-3 top-9 h-6 w-6 text-text-muted transition-colors hover:text-text-base"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="mt-6 w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Entrando...
              </div>
            ) : (
              'Entrar'
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  )
}