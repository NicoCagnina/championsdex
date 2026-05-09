import type { Metadata } from 'next'
import { Syne, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Header } from '@/components/Header'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Champions Companion',
  description: 'Asistente de batalla para Pokémon Champions',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${syne.variable} ${mono.variable}`}>
        <ThemeProvider>
          <div className="relative min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 relative z-10 pt-14">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
