import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { PageHeader } from '@/components/layout/PageHeader'

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // h-screen + overflow-hidden impede que a tela inteira role, 
    // forçando o scroll apenas na área de conteúdo (comportamento de App Nativo)
    <div className="flex h-screen w-full overflow-hidden bg-bg-base text-text-base">
      
      {/* Sidebar (Fixa à esquerda) */}
      <Sidebar />

      {/* Área Principal (Flexível) */}
      <div className="relative flex flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out">
        
        {/* Navbar (Fixa no topo dentro do flex) */}
        <Navbar />

        {/* Conteúdo Scrollável 
           - scroll-smooth: Rolagem suave
           - animate-in fade-in: O conteúdo surge suavemente
        */}
        <main 
          id="main-content"
          className="flex-1 overflow-y-auto scroll-smooth p-4 sm:p-6 lg:p-8"
        >
          {/* Container Centralizado e Limitado */}
          <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
            
            {/* Cabeçalho de Navegação Automático */}
            <PageHeader />
            
            {/* Onde as páginas (Dashboard, Funcionários, etc) são renderizadas */}
            {children}

            {/* Espaço extra no final para não colar no rodapé da tela */}
            <div className="h-10" />
          </div>
        </main>
      </div>
    </div>
  )
}