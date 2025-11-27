import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { PageHeader } from '@/components/layout/PageHeader'
// Importe o UniBot
import { UniBot }  from '@/components/features/ai/UniBot' 

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg-base text-text-base">
      
      <Sidebar />

      <div className="relative flex flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out">
        <Navbar />

        <main id="main-content" className="flex-1 overflow-y-auto scroll-smooth p-4 sm:p-6 lg:p-8 relative">
          <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
            <PageHeader />
            {children}
            <div className="h-10" />
          </div>

          <UniBot />
          
        </main>
      </div>
    </div>
  )
}