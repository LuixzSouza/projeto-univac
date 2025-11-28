'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, ArrowLeft, Home } from 'lucide-react'
import { Button } from '@/components/ui/Button'

// Dicionário para traduzir as rotas
const routeNames: Record<string, string> = {
  dashboard: 'Dashboard',
  funcionarios: 'Gestão de Funcionários',
  vacinas: 'Catálogo de Vacinas',
  agenda: 'Agenda de Vacinação',
  perfil: 'Meu Perfil',
  configuracoes: 'Configurações',
}

export function PageHeader() {
  const pathname = usePathname()
  const router = useRouter()
  
  const segments = pathname.split('/').filter(Boolean)

  if (pathname === '/dashboard' || pathname === '/') return null

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-in fade-in slide-in-from-top-2 duration-300">
      
      <div className="flex items-center text-sm text-text-muted">
        
        <Button 
          variant="ghost" 
          size="sm"      
          onClick={() => router.back()} 
          className="
            mr-3 h-9 w-9 rounded-full p-0 shrink-0
            bg-primary/5 text-primary        /* Fundo verde bem suave, ícone verde */
            hover:bg-primary/15              /* Escurece um pouco no hover */
            hover:scale-105 active:scale-95  /* Micro-interação de clique */
            transition-all
          "
          title="Voltar para a página anterior"
        >
          <ArrowLeft size={18} /> 
        </Button>

        {/* Breadcrumbs */}
        <div className="flex items-center flex-wrap gap-1.5">
            <Link 
                href="/dashboard" 
                className="flex items-center justify-center h-6 w-6 rounded-md hover:bg-bg-base hover:text-primary transition-colors"
                title="Dashboard"
            >
                <Home size={14} />
            </Link>

            {segments.map((segment, index) => {
            const isLast = index === segments.length - 1
            const href = `/${segments.slice(0, index + 1).join('/')}`
            
            let name = routeNames[segment] || segment
            if (!isNaN(Number(segment))) name = 'Detalhes'
            if (segment === 'add') name = 'Novo Cadastro'

            return (
                <div key={href} className="flex items-center">
                <ChevronRight size={14} className="text-text-muted/60 mx-1" />
                {isLast ? (
                    <span className="font-semibold text-text-base capitalize truncate max-w-[200px]">
                    {name}
                    </span>
                ) : (
                    <Link 
                    href={href} 
                    className="hover:text-primary transition-colors capitalize truncate max-w-[150px] hover:underline decoration-primary/30 underline-offset-2"
                    >
                    {name}
                    </Link>
                )}
                </div>
            )
            })}
        </div>
      </div>
    </div>
  )
}