'use client'

import { useState, useEffect, useRef } from 'react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, Search, User, Syringe, Loader2, ChevronRight } from 'lucide-react' 

import { Button } from '@/components/ui/Button'
import { ThemeToggle } from './ThemeToggle'
import { NotificationBell } from './NotificationBell'

// --- LÓGICA AUXILIAR ---
function getInitials(name?: string | null): string {
  if (!name) return '?'
  const names = name.trim().split(/\s+/)
  if (names.length === 0 || names[0] === '') return '?'
  const initials = names.map((n) => n[0]).join('')
  return initials.length > 1 ? initials.substring(0, 2).toUpperCase() : initials.toUpperCase()
}

// --- COMPONENTE DE BUSCA INTERNO ---
function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Debounce para não chamar API a cada tecla
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        setIsLoading(true)
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
          if (res.ok) {
            const data = await res.json()
            setResults(data)
            setShowResults(true)
          }
        } catch (e) {
          console.error(e)
        } finally {
          setIsLoading(false)
        }
      } else {
        setResults([])
        setShowResults(false)
      }
    }, 300) // Espera 300ms após parar de digitar

    return () => clearTimeout(timer)
  }, [query])

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (url: string) => {
    router.push(url)
    setShowResults(false)
    setQuery('')
  }

  return (
    <div ref={wrapperRef} className="relative hidden md:block w-full max-w-md mx-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isLoading ? <Loader2 className="animate-spin text-primary" size={16}/> : <Search className="text-text-muted" size={16}/>}
        </div>
        <input
          type="text"
          placeholder="Buscar funcionário, vacina..."
          className="w-full rounded-full border border-border bg-bg-base py-2 pl-10 pr-4 text-sm text-text-base focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
        />
      </div>

      {/* Dropdown de Resultados */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full rounded-lg border border-border bg-bg-surface shadow-xl z-50 overflow-hidden">
          <div className="p-2">
            <p className="px-2 py-1 text-xs font-semibold text-text-muted uppercase tracking-wider">Resultados</p>
            {results.map((item) => (
              <button
                key={`${item.type}-${item.id}`}
                onClick={() => handleSelect(item.url)}
                className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-bg-base transition-colors text-left group"
              >
                <div className={`p-2 rounded-full ${item.type === 'funcionario' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'}`}>
                  {item.type === 'funcionario' ? <User size={16} /> : <Syringe size={16} />}
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-medium text-text-base truncate">{item.title}</p>
                  <p className="text-xs text-text-muted truncate">{item.subtitle}</p>
                </div>
                <ChevronRight size={14} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity"/>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {showResults && results.length === 0 && query.length >= 2 && !isLoading && (
         <div className="absolute top-full mt-2 w-full rounded-lg border border-border bg-bg-surface shadow-xl z-50 p-4 text-center">
            <p className="text-sm text-text-muted">Nenhum resultado encontrado.</p>
         </div>
      )}
    </div>
  )
}

// --- NAVBAR PRINCIPAL ---
export function Navbar() {
  const { data: session } = useSession()
  const userName = session?.user?.nome || 'Usuário'
  const userEmail = session?.user?.email || ''
  const userInitials = getInitials(userName)

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-bg-surface/80 backdrop-blur-md px-4 sm:px-6 transition-colors duration-150">
      
      {/* Esquerda: Logo e Menu Mobile */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 rounded-md text-text-base hover:bg-border lg:hidden transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="text-lg sm:text-xl font-bold text-text-base tracking-tight cursor-default">
          Uni<span className="text-primary">Vac</span>
        </div>
      </div>

      {/* Centro: Barra de Busca Inteligente */}
      <SearchBar />

      {/* Direita: Ações e Perfil */}
      <div className="flex items-center gap-3 sm:gap-4">
        <NotificationBell />

        <ThemeToggle />
        
        <Link
          href="/perfil"
          className="hidden sm:flex items-center gap-3 pl-2 border-l border-border hover:opacity-80 transition-opacity"
        >
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-text-base leading-none">{userName.split(' ')[0]}</p>
            <p className="text-[10px] text-text-muted font-medium mt-1">ADMIN</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-green-400 text-white font-bold shadow-sm">
            {userInitials}
          </div>
        </Link>

        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          Sair
        </Button>
      </div>

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <div className="absolute left-0 top-16 z-50 w-full border-b border-border bg-bg-surface shadow-xl lg:hidden animate-in slide-in-from-top-5">
          <nav className="flex flex-col p-4 space-y-1">
            {/* Busca Mobile */}
            <div className="mb-4 md:hidden relative">
                <Search className="absolute left-3 top-2.5 text-text-muted" size={16} />
                <input 
                    type="text" 
                    placeholder="Buscar..." 
                    className="w-full bg-bg-base rounded-md py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50 outline-none border border-border"
                />
            </div>

            <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link">Dashboard</Link>
            <Link href="/funcionarios" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link">Funcionários</Link>
            <Link href="/vacinas" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link">Vacinas</Link>
            <Link href="/agenda" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link">Agenda</Link>
            <Link href="/perfil" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link">Meu Perfil</Link>
            <div className="h-px bg-border my-2"></div>
            <Link href="/configuracoes" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link">Configurações</Link>
          </nav>
        </div>
      )}
      
      {/* Estilo local para links mobile */}
      <style jsx>{`
        .mobile-link {
            @apply block rounded-md p-3 font-medium text-text-base hover:bg-primary/10 hover:text-primary transition-colors;
        }
      `}</style>
    </header>
  )
}