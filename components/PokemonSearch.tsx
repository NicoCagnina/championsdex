'use client'
import { useState, useEffect, useRef } from 'react'
import { fetchPokemon, getPokemonNames, filterNames, formatName } from '@/lib/pokeapi'
import { PokemonData } from '@/lib/types'
import { useT } from '@/lib/i18n'

interface Props {
  onSelect: (pokemon: PokemonData) => void
  placeholder?: string
  disabled?: boolean
  clearOnSelect?: boolean
}

export function PokemonSearch({
  onSelect,
  placeholder = 'Search Pokémon...',
  disabled,
  clearOnSelect = true,
}: Props) {
  const { locale } = useT()
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [allNames, setAllNames] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getPokemonNames().then(setAllNames)
  }, [])

  useEffect(() => {
    if (query.length < 2) { setSuggestions([]); return }
    setSuggestions(filterNames(allNames, query))
  }, [query, allNames])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  async function selectPokemon(name: string) {
    setLoading(true)
    setError('')
    try {
      const p = await fetchPokemon(name)
      onSelect(p)
      if (clearOnSelect) setQuery('')
      else setQuery(formatName(name))
      setOpen(false)
    } catch {
      setError(locale === 'es' ? 'Pokémon no encontrado' : 'Pokémon not found')
    } finally {
      setLoading(false)
    }
  }

  async function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && query.length >= 2) {
      const match = suggestions[0] ?? query
      await selectPokemon(match)
    }
    if (e.key === 'Escape') setOpen(false)
  }

  return (
    <div ref={wrapRef} className="relative">
      <div
        className="flex items-center gap-2 rounded-xl px-3 py-2.5 transition-all"
        style={{
          background: 'var(--card)',
          border: `1px solid ${open ? 'var(--accent)' : 'var(--border)'}`,
          boxShadow: open ? '0 0 0 3px var(--accent-glow)' : undefined,
        }}
      >
        {loading ? (
          <span className="text-sm animate-spin" style={{ color: 'var(--accent)' }}>◌</span>
        ) : (
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5"
            style={{ color: 'var(--muted)', flexShrink: 0 }}
          >
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        )}
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); setError('') }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          disabled={disabled || loading}
          className="flex-1 bg-transparent outline-none text-sm"
          style={{ color: 'var(--text)' }}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setSuggestions([]); setError('') }}
            className="text-sm transition-colors hover:text-red-400"
            style={{ color: 'var(--muted)' }}
          >
            ×
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs mt-1 px-1" style={{ color: '#f87171' }}>{error}</p>
      )}

      {open && suggestions.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-50 shadow-2xl animate-slide-up"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
          }}
        >
          {suggestions.map(name => (
            <button
              key={name}
              onClick={() => selectPokemon(name)}
              className="w-full text-left px-3 py-2 text-sm transition-colors hover:bg-[var(--border)] font-medium"
              style={{ color: 'var(--text)' }}
            >
              #{String(allNames.indexOf(name) + 1).padStart(4, '0')} {formatName(name)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
