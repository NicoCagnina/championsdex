'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useStore } from '@/lib/store'
import { useT } from '@/lib/i18n'
import { PokemonSearch } from '@/components/PokemonSearch'
import { PokemonCard } from '@/components/PokemonCard'
import { PokemonEditor } from '@/components/PokemonEditor'
import { StatBar } from '@/components/StatBar'
import { PokemonData } from '@/lib/types'

/* ── Stats widget ──────────────────────────────── */

function AnimatedNumber({ value }: { value: number }) {
  const [displayed, setDisplayed] = useState(value)
  const rafRef = useRef<number | null>(null)
  const prevRef = useRef(value)

  useEffect(() => {
    const from = prevRef.current
    const to = value
    prevRef.current = value
    if (from === to) return
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    const duration = 700
    const start = performance.now()
    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - (1 - t) ** 3
      setDisplayed(Math.round(from + (to - from) * eased))
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [value])

  return <>{displayed.toLocaleString()}</>
}

function StatsWidget() {
  const { t } = useT()
  const [stats, setStats] = useState<{ teams: number; battles: number; trainers: number } | null>(null)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const fetchStats = () =>
      fetch('/api/stats')
        .then(r => r.json())
        .then(data => {
          setStats(prev => {
            if (prev && (prev.teams !== data.teams || prev.battles !== data.battles || prev.trainers !== data.trainers)) {
              setPulse(true)
              setTimeout(() => setPulse(false), 600)
            }
            return data
          })
        })
        .catch(() => {})
    fetchStats()
    const id = setInterval(fetchStats, 10_000)
    return () => clearInterval(id)
  }, [])

  if (!stats) return null

  const items = [
    { value: stats.trainers, label: t('stats.trainers'),        icon: '✦' },
    { value: stats.teams,    label: t('stats.teamsCreated'),    icon: '◈' },
    { value: stats.battles,  label: t('stats.battlesAssisted'), icon: '⚔' },
  ]

  return (
    <div
      className="flex items-center justify-center gap-8 py-8 mt-6 border-t transition-all"
      style={{ borderColor: 'var(--border)', opacity: pulse ? 0.7 : 1 }}
    >
      {items.map(({ value, label, icon }) => (
        <div key={label} className="text-center">
          <div className="font-mono text-xl font-black" style={{ color: 'var(--accent)' }}>
            <AnimatedNumber value={value} />
          </div>
          <div className="text-[9px] uppercase tracking-wider mt-0.5" style={{ color: 'var(--muted)' }}>
            {icon} {label}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── Main page ─────────────────────────────────── */

export default function TeamBuilder() {
  const {
    myTeam, setTeamSlot, activeSlot, setActiveSlot, clearTeam, updateSlot,
    savedTeams, saveTeam, loadTeam, deleteSavedTeam,
  } = useStore()
  const { t } = useT()
  const locale = useStore(s => s.locale)

  const [editingSlot, setEditingSlot] = useState<number | null>(null)
  const [saveInput, setSaveInput] = useState('')
  const [showSaved, setShowSaved] = useState(false)
  const [confirmLoad, setConfirmLoad] = useState<string | null>(null)

  const filledCount = myTeam.filter(Boolean).length
  const activePokemon = myTeam[activeSlot]
  const editingPokemon = editingSlot !== null ? myTeam[editingSlot] : null

  /* Trainer counter — once per device */
  useEffect(() => {
    if (!localStorage.getItem('pcc-trainer-v1')) {
      fetch('/api/stats/trainers', { method: 'POST' }).catch(() => {})
      localStorage.setItem('pcc-trainer-v1', '1')
    }
  }, [])

  /* Teams counter — fires when team reaches 6, resets if dropped below */
  const teamWasFullRef = useRef(false)
  useEffect(() => {
    if (filledCount === 6 && !teamWasFullRef.current) {
      teamWasFullRef.current = true
      fetch('/api/stats/teams', { method: 'POST' }).catch(() => {})
    } else if (filledCount < 6) {
      teamWasFullRef.current = false
    }
  }, [filledCount])

  function addPokemon(pokemon: PokemonData) {
    if (myTeam.some(p => p?.id === pokemon.id)) return
    const slot = myTeam.findIndex(p => p === null)
    if (slot !== -1) {
      setTeamSlot(slot, pokemon)
      setActiveSlot(slot)
    }
  }

  function removePokemon(i: number) {
    setTeamSlot(i, null)
    if (activeSlot === i) {
      const next = myTeam.findIndex((p, j) => p && j !== i)
      setActiveSlot(next >= 0 ? next : 0)
    }
  }

  function handleSave() {
    const name = saveInput.trim()
    if (!name || filledCount === 0) return
    saveTeam(name)
    setSaveInput('')
  }

  function handleLoad(name: string) {
    loadTeam(name)
    setConfirmLoad(null)
    setShowSaved(false)
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] px-4 py-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <p className="section-label mb-1">{t('teamBuilder.sectionLabel')}</p>
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text)' }}>
            {t('teamBuilder.title')}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
            {filledCount} / 6 Pokémon
          </p>
        </div>

        <div className="flex gap-2 items-center flex-wrap">
          <button
            onClick={() => setShowSaved(s => !s)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
            style={{
              border: '1px solid var(--border)',
              color: showSaved ? 'var(--accent)' : 'var(--muted)',
              background: showSaved ? 'var(--border)' : 'transparent',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
            </svg>
            {t('teamBuilder.savedTeamsBtn')} ({savedTeams.length})
          </button>
          {filledCount > 0 && (
            <button
              onClick={clearTeam}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors hover:bg-red-500/10 hover:text-red-400"
              style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}
            >
              {t('teamBuilder.clearBtn')}
            </button>
          )}
          {filledCount > 0 && (
            <Link
              href="/battle"
              className="px-4 py-1.5 rounded-lg text-sm font-bold transition-all hover:opacity-90 flex items-center gap-1.5"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              {t('teamBuilder.goToBattle')}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          )}
        </div>
      </div>

      {/* Saved teams panel */}
      {showSaved && (
        <div
          className="mb-6 rounded-2xl p-4 animate-fade-in"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="section-label">{t('teamBuilder.savedTeamsTitle')}</p>
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={saveInput}
              onChange={e => setSaveInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              placeholder={t('teamBuilder.teamNamePlaceholder')}
              className="flex-1 px-3 py-2 rounded-xl text-sm bg-transparent outline-none"
              style={{ border: '1px solid var(--border)', color: 'var(--text)' }}
            />
            <button
              onClick={handleSave}
              disabled={!saveInput.trim() || filledCount === 0}
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-40"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              {t('teamBuilder.saveBtn')}
            </button>
          </div>

          {savedTeams.length === 0 ? (
            <p className="text-xs text-center py-4" style={{ color: 'var(--muted)' }}>
              {t('teamBuilder.noSavedTeams')}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {savedTeams.map(team => (
                <div
                  key={team.name}
                  className="rounded-xl p-3 flex items-center gap-3"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                  <div className="flex gap-0.5 shrink-0">
                    {team.team.slice(0, 6).map((p, i) =>
                      p ? (
                        <div key={i} className="relative w-8 h-8">
                          <Image src={p.sprite} alt={p.displayName} fill className="object-contain" sizes="32px" />
                        </div>
                      ) : (
                        <div key={i} className="w-8 h-8 rounded opacity-20" style={{ background: 'var(--border)' }} />
                      )
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate" style={{ color: 'var(--text)' }}>
                      {team.name}
                    </div>
                    <div className="text-[9px] font-mono" style={{ color: 'var(--muted)' }}>
                      {team.team.filter(Boolean).length} Pokémon •{' '}
                      {new Date(team.savedAt).toLocaleDateString(t('teamBuilder.dateLocale'), { day: '2-digit', month: 'short' })}
                    </div>
                  </div>

                  <div className="flex gap-1 shrink-0">
                    {confirmLoad === team.name ? (
                      <>
                        <button onClick={() => handleLoad(team.name)} className="text-[10px] font-bold px-2 py-1 rounded-lg" style={{ background: 'var(--accent)', color: '#fff' }}>
                          {t('common.ok')}
                        </button>
                        <button onClick={() => setConfirmLoad(null)} className="text-[10px] px-2 py-1 rounded-lg" style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}>
                          {t('common.no')}
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setConfirmLoad(team.name)} className="text-[10px] font-semibold px-2 py-1 rounded-lg transition-colors" style={{ border: '1px solid var(--border)', color: 'var(--accent)' }}>
                          {t('common.load')}
                        </button>
                        <button onClick={() => deleteSavedTeam(team.name)} className="text-[10px] px-2 py-1 rounded-lg transition-colors hover:text-red-400" style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}>
                          ×
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        {/* Left: team slots + search */}
        <div>
          <div className="mb-4 max-w-md">
            <PokemonSearch
              onSelect={addPokemon}
              placeholder={filledCount < 6 ? t('teamBuilder.searchAdd') : t('teamBuilder.searchFull')}
              disabled={filledCount >= 6}
            />
            {filledCount >= 6 && (
              <p className="text-xs mt-1.5 px-1" style={{ color: 'var(--warm)' }}>
                {t('teamBuilder.fullTeamHint')}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array.from({ length: 6 }, (_, i) => {
              const p = myTeam[i]
              if (p) {
                return (
                  <PokemonCard
                    key={i}
                    pokemon={p}
                    isActive={activeSlot === i}
                    onClick={() => setActiveSlot(i)}
                    onRemove={() => removePokemon(i)}
                    onEdit={() => setEditingSlot(i)}
                  />
                )
              }
              return (
                <div
                  key={i}
                  className="rounded-xl flex items-center justify-center h-[88px] border-dashed"
                  style={{ background: 'var(--card)', border: '1.5px dashed var(--border)', opacity: 0.5 }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--muted)' }}>
                    <circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>
                  </svg>
                </div>
              )
            })}
          </div>

          {filledCount === 0 && (
            <div className="mt-12 text-center">
              <div className="text-5xl mb-4 opacity-20">◈</div>
              <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>
                {t('teamBuilder.emptyHint')}
              </p>
            </div>
          )}
        </div>

        {/* Right: active Pokémon detail */}
        {activePokemon && (
          <div className="glass rounded-2xl p-5 h-fit animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <p className="section-label">{t('teamBuilder.activePokemon')}</p>
              <button
                onClick={() => setEditingSlot(activeSlot)}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors"
                style={{ border: '1px solid var(--border)', color: 'var(--accent)' }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                {t('common.edit')}
              </button>
            </div>

            <div className="relative w-32 h-32 mx-auto mb-3">
              <Image src={activePokemon.sprite} alt={activePokemon.displayName} fill className="object-contain drop-shadow-lg" sizes="128px" />
            </div>

            <div className="text-center mb-4">
              <h2 className="text-xl font-extrabold" style={{ color: 'var(--text)' }}>
                {activePokemon.displayName}
              </h2>
              <p className="font-mono text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                #{String(activePokemon.id).padStart(4, '0')}
              </p>
              <div className="flex justify-center gap-1.5 mt-2 flex-wrap">
                {activePokemon.item && (
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded" style={{ background: 'var(--warm)22', color: 'var(--warm)' }}>
                    {activePokemon.item}
                  </span>
                )}
                {activePokemon.ability && (
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded" style={{ background: '#7c3aed22', color: '#a78bfa' }}>
                    {activePokemon.ability}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              {[
                ['HP',  activePokemon.stats.hp,        activePokemon.statTraining?.hp        ?? 0],
                ['ATK', activePokemon.stats.attack,     activePokemon.statTraining?.attack    ?? 0],
                ['DEF', activePokemon.stats.defense,    activePokemon.statTraining?.defense   ?? 0],
                ['SpA', activePokemon.stats.spAttack,   activePokemon.statTraining?.spAttack  ?? 0],
                ['SpD', activePokemon.stats.spDefense,  activePokemon.statTraining?.spDefense ?? 0],
                [t('statLabels.speed'), activePokemon.stats.speed, activePokemon.statTraining?.speed ?? 0],
              ].map(([label, base, bonus]) => (
                <StatBar key={label as string} label={label as string} value={(base as number) + (bonus as number)} max={255} />
              ))}
            </div>

            <div className="mt-4 pt-4 flex items-center justify-between" style={{ borderTop: '1px solid var(--border)' }}>
              <span className="section-label">{t('teamBuilder.totalBST')}</span>
              <span className="font-mono font-bold text-sm" style={{ color: 'var(--accent)' }}>
                {Object.values(activePokemon.stats).reduce((a, b) => a + b, 0)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Stats row */}
      <StatsWidget />

      {/* Editor modal */}
      {editingSlot !== null && editingPokemon && (
        <PokemonEditor
          pokemon={editingPokemon}
          slotIndex={editingSlot}
          onUpdate={updates => updateSlot(editingSlot, updates)}
          onClose={() => setEditingSlot(null)}
        />
      )}
    </div>
  )
}
