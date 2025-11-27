'use client'

import { useState, useEffect, useRef } from 'react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Menu, X, Search, User, Syringe, Loader2, ChevronRight, 
  LayoutDashboard, CalendarDays, Package, Settings, HelpCircle, FileText, 
  LogOut
} from 'lucide-react' 

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

// --- DADOS PARA BUSCA RÁPIDA (PÁGINAS DO SISTEMA) ---
const SYSTEM_PAGES = [
    { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard, desc: 'Visão geral', role: 'ALL' },
    { title: 'Agenda', url: '/agenda', icon: CalendarDays, desc: 'Consultar agendamentos', role: 'ALL' },
    { title: 'Estoque', url: '/estoque', icon: Package, desc: 'Gestão de lotes', role: 'ADMIN' },
    { title: 'Configurações', url: '/configuracoes', icon: Settings, desc: 'Preferências', role: 'ALL' },
    { title: 'Ajuda', url: '/ajuda', icon: HelpCircle, desc: 'Tutoriais', role: 'ALL' },
]

// --- COMPONENTE DE TOOLTIP DA BUSCA ---
function SearchTooltip() {
    return (
        <div className="group relative flex items-center justify-center">
            <HelpCircle size={16} className="text-text-muted hover:text-primary cursor-help transition-colors" />
            <div className="absolute top-full right-0 mt-2 w-64 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                <p className="font-bold mb-1">O que posso pesquisar?</p>
                <ul className="list-disc pl-4 space-y-1 text-slate-300">
                    <li>Nomes de Vacinas</li>
                    <li>Páginas do sistema (ex: Agenda)</li>
                    <li>Seus dados de perfil</li>
                    <li><em>(Admin)</em> Outros funcionários</li>
                </ul>
            </div>
        </div>
    )
}

// --- COMPONENTE DE BUSCA INTELIGENTE (OMNIBOX) ---
function SearchBar({ userRole, userId }: { userRole: string, userId: string }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  
  // Resultados
  const [results, setResults] = useState<any[]>([]) 
  const [isLoading, setIsLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Atalho de Teclado (Ctrl + Enter ou Ctrl + K) - Invisível mas funcional
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'Enter' || e.key === 'k')) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Busca Híbrida (Local + API) com Segurança
  useEffect(() => {
    // Limpa resultados se query for curta
    if (query.length < 2) {
        setResults([])
        setIsLoading(false)
        return
    }

    setIsLoading(true)

    const timer = setTimeout(async () => {
        try {
            // 1. Busca Local (Páginas)
            const localMatches = SYSTEM_PAGES.filter(p => 
                p.title.toLowerCase().includes(query.toLowerCase()) &&
                (p.role === 'ALL' || p.role === userRole) // Filtra páginas que o usuário não pode ver
            ).map(p => ({ ...p, type: 'page' }))

            // 2. Busca API (Dados)
            let apiMatches: any[] = []
            const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
            if (res.ok) {
                apiMatches = await res.json()
            }

            // 3. FILTRAGEM DE SEGURANÇA (IMPORTANTE!)
            const safeApiMatches = apiMatches.filter(item => {
                // Se for Vacina, todo mundo pode ver
                if (item.type === 'vacina') return true;
                
                // Se for Funcionário:
                if (item.type === 'funcionario') {
                    // Admin vê tudo
                    if (userRole === 'ADMIN') return true;
                    // Funcionário comum SÓ VÊ A SI MESMO
                    return String(item.id) === String(userId);
                }
                
                return true;
            })

            setResults([...localMatches, ...safeApiMatches])
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }, 600) // Delay de 600ms (Loading visual mais perceptível)

    return () => clearTimeout(timer)
  }, [query, userRole, userId])

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (url: string) => {
    router.push(url)
    setIsFocused(false)
    setQuery('')
  }

  return (
    <div ref={wrapperRef} className="relative hidden md:block w-full max-w-lg mx-4">
      <div className="relative flex items-center gap-2">
        <div className="relative flex-grow group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {isLoading ? <Loader2 className="animate-spin text-primary" size={16}/> : <Search className="text-text-muted group-focus-within:text-primary transition-colors" size={16}/>}
            </div>
            <input
                ref={inputRef}
                type="text"
                placeholder="Pesquisar no sistema..."
                className="w-full rounded-xl border border-border bg-bg-base py-2.5 pl-10 pr-4 text-sm text-text-base focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
            />
        </div>
        
        {/* Ajuda do que pesquisar */}
        <SearchTooltip />
      </div>

      {/* --- DROPDOWN DE RESULTADOS --- */}
      {isFocused && (
        <div className="absolute top-full mt-2 w-full rounded-xl border border-border bg-bg-surface shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
            
            {/* Sugestões Iniciais (Sem digitar nada) */}
            {query.length < 2 && (
                <div className="p-2">
                    <p className="px-3 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">Sugestões</p>
                    {SYSTEM_PAGES.filter(p => p.role === 'ALL' || p.role === userRole).slice(0, 3).map((page) => (
                        <button key={page.url} onClick={() => handleSelect(page.url)} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-bg-base transition-colors text-left group">
                            <div className="p-2 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                <page.icon size={16} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-text-base">{page.title}</p>
                                <p className="text-xs text-text-muted">{page.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Resultados da Busca */}
            {query.length >= 2 && (
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2 space-y-1">
                    {results.length > 0 ? (
                        results.map((item, idx) => (
                            <button
                                key={`${item.type}-${item.id}-${idx}`}
                                onClick={() => handleSelect(item.url)}
                                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-bg-base transition-colors text-left group"
                            >
                                <div className={`p-2 rounded-full shrink-0 ${
                                    item.type === 'funcionario' ? 'bg-blue-100 text-blue-600' : 
                                    item.type === 'vacina' ? 'bg-orange-100 text-orange-600' :
                                    'bg-gray-100 text-gray-600'
                                }`}>
                                    {item.type === 'funcionario' ? <User size={16} /> : 
                                     item.type === 'vacina' ? <Syringe size={16} /> :
                                     <FileText size={16} />}
                                </div>
                                <div className="flex-grow min-w-0">
                                    <p className="text-sm font-medium text-text-base truncate">{item.title}</p>
                                    <p className="text-xs text-text-muted truncate capitalize">{item.subtitle || item.desc}</p>
                                </div>
                                <ChevronRight size={14} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity"/>
                            </button>
                        ))
                    ) : (
                        !isLoading && (
                            <div className="p-6 text-center text-text-muted">
                                <p className="text-sm">Nenhum resultado encontrado.</p>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
      )}
    </div>
  )
}

// --- NAVBAR PRINCIPAL ---
export function Navbar() {
  const { data: session } = useSession()
  
  const userName = session?.user?.nome || 'Convidado'
  const userRole = (session?.user as any)?.role || 'Visitante'
  const userId = (session?.user as any)?.id || '' // ID para filtrar a busca
  
  const userInitials = getInitials(userName)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-bg-surface/80 backdrop-blur-md px-4 sm:px-6 transition-colors duration-150">
      
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 rounded-md text-text-base hover:bg-border lg:hidden transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="text-lg sm:text-xl font-bold text-text-base tracking-tight cursor-default flex items-center gap-1">
          Uni<span className="text-primary">Vac</span>
        </div>
      </div>

      {/* Passamos as permissões para a Barra de Busca */}
      <SearchBar userRole={userRole} userId={userId} />

      <div className="flex items-center gap-2 sm:gap-4">
        <NotificationBell />
        <ThemeToggle />
        
        <div className="h-6 w-px bg-border hidden sm:block mx-1"></div>

        <Link
          href="/perfil"
          className="hidden sm:flex items-center gap-3 pl-1 hover:opacity-80 transition-opacity"
        >
          <div className="text-right hidden md:block leading-tight">
            <p className="text-sm font-semibold text-text-base">{userName.split(' ')[0]}</p>
            {/* Cargo dinâmico */}
            <p className="text-[10px] text-text-muted font-bold tracking-wider uppercase bg-bg-base px-1.5 rounded w-fit ml-auto border border-border">
                {userRole === 'ADMIN' ? 'Administrador' : 'Colaborador'}
            </p>
          </div>
          
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-green-400 text-white text-sm font-bold shadow-md border-2 border-bg-surface">
            {userInitials}
          </div>
        </Link>

        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 hidden sm:flex"
          onClick={() => signOut({ callbackUrl: '/login' })}
          title="Sair do Sistema"
        >
          <LogOut size={18} />
        </Button>
      </div>

      {/* Menu Mobile Simplificado */}
      {isMobileMenuOpen && (
        <div className="absolute left-0 top-16 z-50 w-full border-b border-border bg-bg-surface shadow-xl lg:hidden animate-in slide-in-from-top-5">
          <nav className="flex flex-col p-4 space-y-1">
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
            <div className="h-px bg-border my-2"></div>
            <Link href="/perfil" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link flex justify-between">
                Meu Perfil <span className="text-xs bg-primary/10 text-primary px-2 rounded">{userRole}</span>
            </Link>
            <button onClick={() => signOut({ callbackUrl: '/login' })} className="mobile-link text-red-500 hover:bg-red-50 w-full text-left">
                Sair do Sistema
            </button>
          </nav>
        </div>
      )}
      
      <style jsx>{`
        .mobile-link {
            @apply block rounded-md p-3 font-medium text-text-base hover:bg-primary/10 hover:text-primary transition-colors;
        }
      `}</style>
    </header>
  )
}