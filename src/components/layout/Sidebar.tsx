'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { 
  LayoutDashboard, Users, Syringe, CalendarDays, UserCircle, Settings,
  ChevronLeft, Menu 
} from 'lucide-react'
import { useSession } from 'next-auth/react'

const navLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Funcionários', href: '/funcionarios', icon: Users },
  { name: 'Vacinas', href: '/vacinas', icon: Syringe },
  { name: 'Agenda', href: '/agenda', icon: CalendarDays },
  { name: 'Meu Perfil', href: '/perfil', icon: UserCircle },
  { name: 'Configurações', href: '/configuracoes', icon: Settings },
]

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
  
  const sidebarDesktopWidthClass = isCollapsed ? 'lg:w-20' : 'lg:w-64'
  
  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard' 
    return pathname.startsWith(href)
  }

  const hideElement = isCollapsed && !isMobileOpen;

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-primary lg:hidden shadow-lg"
        aria-label="Abrir Menu"
      >
        <Menu size={24} className="text-white" />
      </button>

      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity duration-300" 
          onClick={() => setIsMobileOpen(false)} 
        />
      )}

      <aside 
        className={`
          flex w-64 shrink-0 flex-col bg-bg-surface border-r border-border p-4
          transition-all duration-300 ease-in-out z-50 
          
          /* Estilos Fixos para Mobile */
          fixed inset-y-0 left-0 max-w-[85vw]
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
          
          /* Estilos para Desktop (lg+) */
          lg:static lg:translate-x-0 ${sidebarDesktopWidthClass}
        `}
      >

        <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`
              absolute top-4 ${isCollapsed ? 'right-2' : 'right-4'} p-1.5 rounded-full
              bg-border/50 text-text-muted hover:bg-border transition-colors duration-200
              hidden lg:block
            `}
            aria-label={isCollapsed ? 'Expandir Menu' : 'Colapsar Menu'}
        >
          <ChevronLeft size={20} className={isCollapsed ? 'rotate-180' : ''} />
        </button>
        
        {/* Botão Fechar Mobile */}
        <button
            onClick={() => setIsMobileOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full text-text-base hover:bg-border lg:hidden"
            aria-label="Fechar Menu"
        >
          <ChevronLeft size={20} />
        </button>


        {/* Título/Logo */}
        <div className="mb-8 flex items-center justify-center">
          <div className={`text-3xl font-bold text-text-base ${hideElement ? 'hidden' : ''}`}>
            Uni<span className="text-primary-light">Vac</span>
          </div>
          {hideElement && (
              <Syringe size={24} className="text-primary-light" />
          )}
        </div>

        {/* Navegação */}
        <nav className="flex-grow">
          <ul className="space-y-2">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              
              const linkClasses = `
                flex items-center gap-3 rounded-md px-3 py-2.5 text-base font-medium
                transition-colors duration-150 ease-in-out group relative
                ${active ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:bg-border hover:text-text-base'}
              `
              const iconClasses = `h-5 w-5 shrink-0 transition-colors duration-150 ${active ? 'text-white' : 'text-text-muted group-hover:text-text-base'}`

              return (
                <li key={link.name} title={isCollapsed ? link.name : undefined}>
                  <Link
                    href={link.href}
                    className={linkClasses}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <link.icon className={iconClasses} aria-hidden="true" />
                    <span className={hideElement ? 'hidden' : ''}>
                      {link.name}
                    </span>
                    {hideElement && (
                        <span className="
                            absolute left-full ml-4 whitespace-nowrap 
                            rounded bg-gray-700 px-2 py-1 text-xs text-white 
                            opacity-0 invisible group-hover:visible group-hover:opacity-100 
                            transition-opacity z-50 hidden lg:block
                        ">
                            {link.name}
                        </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Rodapé do Usuário */}
        <div className={`mt-auto border-t border-border pt-4 ${hideElement ? 'text-center' : ''}`}>
            <div className={`flex items-center ${hideElement ? 'justify-center' : 'gap-3'}`}>
                <div 
                    className={`flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shrink-0`}
                >
                    {userInitials}
                </div>
                
                {!hideElement ? (
                    <div className='flex flex-col overflow-hidden'>
                        <span className="text-sm font-medium text-text-base truncate">{userName}</span>
                        <span className="text-xs text-text-muted">Acesso: {session?.user?.role || 'Funcionário'}</span>
                    </div>
                ) : null}
            </div>
            
            <div className={`text-xs text-text-muted mt-3 ${hideElement ? '' : 'text-left'}`}>
               v1.1
            </div>
        </div>

      </aside>
    </>
  )
}
