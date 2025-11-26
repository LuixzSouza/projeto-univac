'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { 
  LayoutDashboard, Users, Syringe, CalendarDays, UserCircle, Settings,
  ChevronLeft, Menu, 
  HelpCircle,
  Package,
  ShieldAlert
} from 'lucide-react'
import { useSession } from 'next-auth/react'

// Links de navegação
const navLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Funcionários', href: '/funcionarios', icon: Users },
  { name: 'Vacinas', href: '/vacinas', icon: Syringe },
  { name: 'Estoque', href: '/estoque', icon: Package },
  { name: 'Agenda', href: '/agenda', icon: CalendarDays },
  { name: 'Meu Perfil', href: '/perfil', icon: UserCircle },
  { name: 'Configurações', href: '/configuracoes', icon: Settings },
  { name: 'Ajuda', href: '/ajuda', icon: HelpCircle }, 
  { name: 'Auditoria', href: '/auditoria', icon: ShieldAlert },
]

// Função auxiliar para iniciais
function getInitials(name?: string | null): string {
    if (!name) return '?'
    const names = name.trim().split(/\s+/)
    if (names.length === 0 || names[0] === '') return '?'
    const initials = names.map((n) => n[0]).join('')
    return initials.length > 1 ? initials.substring(0, 2).toUpperCase() : initials.toUpperCase();
}

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isCollapsed, setIsCollapsed] = useState(false) 
  const [isMobileOpen, setIsMobileOpen] = useState(false) 

  const userName = session?.user?.nome || 'Usuário'
  const userInitials = getInitials(userName)
  
  // Casting seguro para acessar a role (caso o TS reclame)
  const userRole = (session?.user as any)?.role || 'Funcionário'
  
  // Classes dinâmicas para largura
  const sidebarDesktopWidthClass = isCollapsed ? 'lg:w-20' : 'lg:w-64'
  
  // Lógica de link ativo
  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard' 
    return pathname.startsWith(href)
  }

  // Variável para controlar exibição de textos
  const hideElement = isCollapsed && !isMobileOpen;

  return (
    <>
      {/* Botão Flutuante Mobile (Hamburger) */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-primary text-white lg:hidden shadow-lg hover:bg-primary/90 transition-colors"
        aria-label="Abrir Menu"
      >
        <Menu size={24} />
      </button>

      {/* Overlay Escuro Mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 lg:hidden backdrop-blur-sm transition-opacity duration-300" 
          onClick={() => setIsMobileOpen(false)} 
        />
      )}

      {/* ASIDE Principal */}
      <aside 
        className={`
          flex flex-col bg-bg-surface border-r border-border 
          transition-all duration-300 ease-in-out z-50 
          
          /* Mobile: Fixo e desliza da esquerda */
          fixed inset-y-0 left-0 w-64 max-w-[85vw]
          ${isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} 
          
          /* Desktop: Estático e largura variável */
          lg:static lg:translate-x-0 ${sidebarDesktopWidthClass}
          lg:shadow-none
        `}
      >
        {/* Cabeçalho da Sidebar */}
        <div className="relative flex items-center justify-center h-16 border-b border-border/50 mb-4">
            {/* Botão Colapsar (Desktop) */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={`
                absolute -right-3 top-6 p-1 rounded-full border border-border
                bg-bg-surface text-text-muted hover:text-primary transition-colors duration-200
                hidden lg:flex items-center justify-center shadow-sm z-10
                `}
                aria-label={isCollapsed ? 'Expandir Menu' : 'Colapsar Menu'}
            >
                <ChevronLeft size={16} className={isCollapsed ? 'rotate-180' : ''} />
            </button>
            
            {/* Botão Fechar (Mobile) */}
            <button
                onClick={() => setIsMobileOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-md text-text-muted hover:bg-border lg:hidden"
                aria-label="Fechar Menu"
            >
                <ChevronLeft size={24} />
            </button>

            {/* Logo */}
            <div className={`flex items-center gap-2 transition-opacity duration-200 ${hideElement ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                <Syringe size={24} className="text-primary" />
                <span className="text-xl font-bold text-text-base">Uni<span className="text-primary">Vac</span></span>
            </div>
            {/* Ícone Logo quando colapsado */}
            {hideElement && (
                <Syringe size={24} className="text-primary transition-transform hover:scale-110" />
            )}
        </div>

        {/* Navegação (Scrollável se necessário) */}
        <nav className="flex-grow px-3 overflow-y-auto custom-scrollbar">
          <ul className="space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              
              return (
                <li key={link.name} className="relative group">
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`
                      flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
                      transition-all duration-200 ease-in-out
                      ${active 
                        ? 'bg-primary text-white shadow-md' 
                        : 'text-text-muted hover:bg-border/50 hover:text-text-base'
                      }
                      ${hideElement ? 'justify-center' : ''}
                    `}
                  >
                    <link.icon 
                        className={`h-5 w-5 shrink-0 transition-colors ${active ? 'text-white' : 'text-text-muted group-hover:text-text-base'}`} 
                    />
                    
                    {!hideElement && (
                        <span className="truncate">{link.name}</span>
                    )}
                  </Link>

                  {/* Tooltip (Aparece só quando colapsado e hover) */}
                  {hideElement && (
                    <div className="
                        absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50
                        hidden group-hover:block whitespace-nowrap 
                        rounded bg-gray-800 px-2 py-1 text-xs text-white shadow-lg
                        animate-in fade-in slide-in-from-left-1 duration-200
                    ">
                        {link.name}
                        {/* Setinha do tooltip */}
                        <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-gray-800"></div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Rodapé do Usuário */}
        <div className="border-t border-border p-4">
            <div className={`flex items-center ${hideElement ? 'justify-center' : 'gap-3'}`}>
                <div 
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-green-600 text-xs font-bold text-white shrink-0 shadow-sm"
                >
                    {userInitials}
                </div>
                
                {!hideElement && (
                    <div className='flex flex-col overflow-hidden'>
                        <span className="text-sm font-semibold text-text-base truncate">{userName}</span>
                        <span className="text-xs text-text-muted truncate capitalize">{userRole}</span>
                    </div>
                )}
            </div>
            
            {!hideElement && (
                <div className="text-[10px] text-text-muted mt-4 text-center opacity-50">
                   v1.2.0 • UniVac System
                </div>
            )}
        </div>

      </aside>
    </>
  )
}