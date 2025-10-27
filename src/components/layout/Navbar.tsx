'use client'

import { signOut, useSession } from 'next-auth/react'
import { Button } from '../ui/Button'
import { ThemeToggle } from './ThemeToggle'
import Link from 'next/link'
import { Menu, X } from 'lucide-react' 
import { useState } from 'react' 

function getInitials(name?: string | null): string {
  if (!name) return '?'
  const names = name.trim().split(/\s+/)
  if (names.length === 0 || names[0] === '') return '?'
  const initials = names.map((n) => n[0]).join('')
  return initials.length > 1
    ? initials.substring(0, 2).toUpperCase()
    : initials.toUpperCase()
}

export function Navbar() {
  const { data: session } = useSession()
  const userName = session?.user?.nome || 'Usuário'
  const userEmail = session?.user?.email || ''
  const userInitials = getInitials(userName)

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleOpenMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="relative flex h-16 w-full items-center justify-between border-b border-border bg-bg-surface px-4 sm:px-6 transition-colors duration-150">
      <div className="flex items-center gap-3">
        <button
          onClick={handleOpenMobileMenu} // Ação para abrir/fechar
          className="p-1.5 rounded-md text-text-base hover:bg-border lg:hidden transition-colors duration-150"
          aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="text-lg sm:text-xl font-semibold text-text-base">
          <h2>
            Bem-vindo(a),{' '}
            <span className="text-primary">{userName.split(' ')[0]}</span>
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <Link
          href="/perfil"
          className="hidden sm:flex items-center gap-2 sm:gap-3 group"
        >
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary text-white font-bold">
            {userInitials}
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-medium text-text-base group-hover:text-primary transition-colors">
              {userName}
            </span>
            <span className="text-xs text-text-muted">{userEmail}</span>
          </div>
        </Link>

        <ThemeToggle />
        <Button
          variant="danger"
          size="sm"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          Sair
        </Button>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute left-0 top-16 z-50 w-full border-b border-border bg-bg-surface shadow-md lg:hidden">
          <nav className="flex flex-col p-4">
            <Link
              href="/perfil"
              className="flex items-center gap-3 rounded-md p-3 text-text-base hover:bg-border transition-colors sm:hidden"
              onClick={closeMobileMenu} 
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white font-bold">
                {userInitials}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-text-base">
                  {userName}
                </span>
                <span className="text-xs text-text-muted">{userEmail}</span>
              </div>
            </Link>

            {/* --- Links Adicionais da Sidebar --- */}
            <Link
              href="/dashboard"
              className="block rounded-md p-3 font-medium text-text-base hover:bg-border transition-colors"
              onClick={closeMobileMenu} // Fecha o menu ao navegar
            >
              Dashboard
            </Link>
            <Link
              href="/funcionarios"
              className="block rounded-md p-3 font-medium text-text-base hover:bg-border transition-colors"
              onClick={closeMobileMenu} // Fecha o menu ao navegar
            >
              Funcionários
            </Link>
            <Link
              href="/vacinas"
              className="block rounded-md p-3 font-medium text-text-base hover:bg-border transition-colors"
              onClick={closeMobileMenu} // Fecha o menu ao navegar
            >
              Vacinas
            </Link>
            <Link
              href="/agenda"
              className="block rounded-md p-3 font-medium text-text-base hover:bg-border transition-colors"
              onClick={closeMobileMenu} // Fecha o menu ao navegar
            >
              Agenda
            </Link>
            <Link
              href="/configuracoes"
              className="block rounded-md p-3 font-medium text-text-base hover:bg-border transition-colors"
              onClick={closeMobileMenu} // Fecha o menu ao navegar
            >
              Configurações
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}