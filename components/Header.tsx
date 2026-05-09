'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'
import { useStore } from '@/lib/store'
import { useT } from '@/lib/i18n'

export function Header() {
  const path = usePathname()
  const { t, locale } = useT()
  const setLocale = useStore(s => s.setLocale)

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 h-14 flex items-center border-b"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-black tracking-[-0.04em]" style={{ color: 'var(--accent)' }}>◈</span>
          <span className="text-sm font-bold tracking-tight hidden sm:block" style={{ color: 'var(--text)' }}>Champions Companion</span>
        </div>

        <nav className="flex items-center gap-1">
          {([{ href: '/', label: t('nav.team') }, { href: '/battle', label: t('nav.battle') }]).map(({ href, label }) => {
            const active = path === href
            return (
              <Link key={href} href={href} className="px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
                style={active ? { background: 'var(--accent)', color: '#fff' } : { color: 'var(--muted)' }}>
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg overflow-hidden text-[10px] font-bold" style={{ border: '1px solid var(--border)' }}>
            {(['en', 'es'] as const).map(lang => (
              <button key={lang} onClick={() => setLocale(lang)} className="px-2 py-1 transition-all uppercase"
                style={{ background: locale === lang ? 'var(--accent)' : 'transparent', color: locale === lang ? '#fff' : 'var(--muted)' }}>
                {lang}
              </button>
            ))}
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
