import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers"; 
// 1. Importe o Toaster do Sonner
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistema UniVac",
  description: "Gerenciamento de Vacinação",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground`}>
        <Providers> 
          {children}
          
          {/* 2. Adicione o componente aqui, dentro do Providers ou logo após o children */}
          <Toaster 
            richColors 
            position="top-right"
            closeButton
            theme="system"
            style={{ zIndex: 99999 }} 
            toastOptions={{
              style: { zIndex: 99999 }
            }}
          />
        </Providers>
      </body>
    </html>
  );
}