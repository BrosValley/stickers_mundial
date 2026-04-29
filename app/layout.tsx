import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { PwaSetup } from '@/components/ui/PwaSetup'
import { OfflineBanner } from '@/components/ui/OfflineBanner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Album Checklist',
  description: 'Registra tu colección de estampas',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} bg-[var(--bg)] text-[var(--text)] min-h-screen`} suppressHydrationWarning>
        <ThemeProvider>
          {children}
          <OfflineBanner />
        </ThemeProvider>
        <PwaSetup />
      </body>
    </html>
  )
}
