'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation' // ✨ Importamos useRouter
import { useState } from 'react'
import { 
  LayoutDashboard, Users, Syringe, CalendarDays, UserCircle, Settings,
  ChevronLeft, Menu, HelpCircle, Package, ShieldAlert,
  Loader2 // ✨ Importamos Loader2
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner' // ✨ Importamos Toast

// Links de navegação
const navLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, requires: 'ALL' },
  { name: 'Funcionários', href: '/funcionarios', icon: Users, requires: 'ALL' },
  { name: 'Vacinas', href: '/vacinas', icon: Syringe, requires: 'ALL' },
  { name: 'Estoque', href: '/estoque', icon: Package, requires: 'ADMIN' },
  { name: 'Agenda', href: '/agenda', icon: CalendarDays, requires: 'ALL' },
  { name: 'Meu Perfil', href: '/perfil', icon: UserCircle, requires: 'ALL' },
  { name: 'Configurações', href: '/configuracoes', icon: Settings, requires: 'ALL' },
  { name: 'Ajuda', href: '/ajuda', icon: HelpCircle, requires: 'ALL' }, 
  { name: 'Auditoria', href: '/auditoria', icon: ShieldAlert, requires: 'ADMIN' },
]

// Função auxiliar para iniciais (mantida)
function getInitials(name?: string | null): string {
    if (!name) return '?'
    const names = name.trim().split(/\s+/)
    if (names.length === 0 || names[0] === '') return '?'
    const initials = names.map((n) => n[0]).join('')
    return initials.length > 1 ? initials.substring(0, 2).toUpperCase() : initials.toUpperCase();
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter() // ✨ Usamos useRouter
  const { data: session } = useSession()
  
  // ✨ NOVOS ESTADOS DE NAVEGAÇÃO
  const [isNavigating, setIsNavigating] = useState(false)
  const [navigatingTo, setNavigatingTo] = useState('')
  
  const [isCollapsed, setIsCollapsed] = useState(false) 
  const [isMobileOpen, setIsMobileOpen] = useState(false) 

  const userName = session?.user?.nome || 'Usuário'
  const userInitials = getInitials(userName)
  const userRole = (session?.user as any)?.role || 'FUNCIONARIO'
  const sidebarDesktopWidthClass = isCollapsed ? 'lg:w-20' : 'lg:w-64'
  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard' 
    return pathname.startsWith(href)
  }
  const hideElement = isCollapsed && !isMobileOpen;

  // Filtro RBAC (Mantido)
  const filterLinks = navLinks.filter(link => {
    if (link.requires === 'ADMIN' && userRole.toUpperCase() !== 'ADMIN') {
      return false;
    }
    return true;
  });

  // ✨ HANDLER DE NAVEGAÇÃO COM FEEDBACK E BLOQUEIO DE DUPLO CLIQUE
  const handleNavigation = (linkName: string, href: string) => {
    if (isNavigating || pathname === href) return;
    
    setIsNavigating(true);
    setNavigatingTo(href);

    // Mostra o Toast de carregamento
    toast.info(`Acessando: ${linkName}...`, { id: 'nav-status', duration: 3000 });
    
    router.push(href);

    // Ação de limpeza: A navegação do Next.js deve resolver o isNavigating.
    // Usamos um timeout de segurança para destravar a navegação caso o Next.js não complete o ciclo rapidamente.
    setTimeout(() => {
      setIsNavigating(false);
      toast.dismiss('nav-status');
    }, 1500); 
  };


  return (
    <>
      {/* Botão Flutuante Mobile (Hamburger) */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed bottom-24 right-7 z-50 p-3 rounded-full bg-primary text-white lg:hidden shadow-lg hover:bg-primary/90 transition-colors"
        aria-label="Abrir Menu"
        disabled={isNavigating} // Bloqueia durante a navegação
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
          fixed inset-y-0 left-0 w-64 max-w-[85vw]
          ${isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} 
          lg:static lg:translate-x-0 ${sidebarDesktopWidthClass}
          lg:shadow-none
        `}
      >
        {/* ... (Cabeçalho da Sidebar) ... */}

        <div className="relative flex items-center justify-center h-16 border-b border-border/50 mb-4">
            {/* Botões de colapsar/fechar omitidos para brevidade, mas estão no seu código */}
            {/* Logo */}
            <div className={`flex items-center gap-2 transition-opacity duration-200 ${hideElement ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                <Syringe size={24} className="text-primary" />
                <span className="text-xl font-bold text-text-base">Uni<span className="text-primary">Vac</span></span>
            </div>
            {hideElement && (<Syringe size={24} className="text-primary transition-transform hover:scale-110" />)}
        </div>


        {/* Navegação */}
        <nav className="flex-grow px-3 overflow-y-auto custom-scrollbar">
          <ul className="space-y-1">
            {filterLinks.map((link) => {
              const active = isActive(link.href)
              const isCurrentlyNavigating = isNavigating && navigatingTo === link.href; // O link que está sendo carregado
              
              return (
                <li key={link.name} className="relative group">
                  <button
                    onClick={() => handleNavigation(link.name, link.href)} // ✨ Chamamos o novo handler
                    disabled={isNavigating || active} // Bloqueia se já estiver navegando ou se já for a página atual
                    className={`
                      w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
                      transition-all duration-200 ease-in-out
                      ${active 
                        ? 'bg-primary text-white shadow-md' 
                        : 'text-text-muted hover:bg-border/50 hover:text-text-base'
                      }
                      ${hideElement ? 'justify-center' : ''}
                      ${isNavigating ? 'cursor-wait opacity-80' : 'cursor-pointer'}
                    `}
                  >
                    {isCurrentlyNavigating ? (
                       <Loader2 className={`h-5 w-5 shrink-0 animate-spin ${active ? 'text-white' : 'text-primary'}`} />
                    ) : (
                        <link.icon 
                            className={`h-5 w-5 shrink-0 transition-colors ${active ? 'text-white' : 'text-text-muted group-hover:text-text-base'}`} 
                        />
                    )}
                    
                    {!hideElement && (
                        <span className="truncate">{link.name}</span>
                    )}
                  </button>

                  {/* Tooltip (Mantido) */}
                  {hideElement && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 hidden group-hover:block whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white shadow-lg animate-in fade-in slide-in-from-left-1 duration-200">
                        {link.name}
                        <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-gray-800"></div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Rodapé do Usuário (Mantido) */}
        <div className="border-t border-border p-4">
            <div className={`flex items-center ${hideElement ? 'justify-center' : 'gap-3'}`}>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-green-600 text-xs font-bold text-white shrink-0 shadow-sm">{userInitials}</div>
                {!hideElement && (
                    <div className='flex flex-col overflow-hidden'>
                        <span className="text-sm font-semibold text-text-base truncate">{userName}</span>
                        <span className="text-xs text-text-muted truncate capitalize">{userRole.toLowerCase()}</span>
                    </div>
                )}
            </div>
            {!hideElement && (<div className="text-[10px] text-text-muted mt-4 text-center opacity-50">v1.2.0 • UniVac System</div>)}
        </div>

      </aside>
    </>
  )
}