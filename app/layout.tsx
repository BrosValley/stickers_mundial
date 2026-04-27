import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Album Checklist',
  description: 'Track your sticker collection progress',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-900 text-slate-100 min-h-screen`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
