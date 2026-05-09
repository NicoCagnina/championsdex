'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useStore } from '@/lib/store'
import { useT } from '@/lib/i18n'
import { PokemonSearch } from '@/components/PokemonSearch'
import { TypeBadge } from '@/components/TypeBadge'
import { getOffensiveScore, getDefensiveVulnerability } from '@/lib/typeEffectiveness'
import { getEffectiveSpeed, getMegaTypes, getMegaStats, isMegaStone } from '@/lib/items'
import { getNatureMult } from '@/lib/natures'
import { getMetaBuilds } from '@/lib/meta'
import { PokemonData } from '@/lib/types'

/* ── Helpers ─────────────────────────────────── */

function calcEffectiveSpeed(p: PokemonData): number {
  const nm = getNatureMult(p.nature, 'speed')
  return getEffectiveSpeed(p.stats.speed, p.statTraining?.speed ?? 0, p.item, nm)
}

type MatchupKey = 'counter' | 'offensive' | 'resistant' | 'critical' | 'weak' | 'neutral'

function matchupRating(attacker: PokemonData, defender: PokemonData): { key: MatchupKey; color: string; bg: string } {
  const off = getOffensiveScore(attacker.types, defender.types)
  const def = getDefensiveVulnerability(attacker.types, defender.types)
  if (off >= 2 && def <= 1) return { key: 'counter',    color: '#4ade80', bg: '#14532d33' }
  if (off >= 2)             return { key: 'offensive',  color: '#86efac', bg: '#14532d22' }
  if (def <= 0.5)           return { key: 'resistant',  color: '#60a5fa', bg: '#1e3a5f33' }
  if (def >= 4)             return { key: 'critical',   color: '#f87171', bg: '#7f1d1d33' }
  if (def >= 2 && off <= 1) return { key: 'weak',       color: '#fb923c', bg: '#7c2d1233' }
  return { key: 'neutral', color: 'var(--muted)', bg: 'var(--card)' }
}

/* ── Field Conditions ────────────────────────── */

type WeatherType = 'none' | 'sun' | 'rain' | 'snow' | 'sand'

interface FieldState {
  weather: WeatherType
  weatherTurns: number
  trickRoom: boolean
  trickRoomTurns: number
  tailwindMy: boolean
  tailwindMyTurns: number
  tailwindEnemy: boolean
  tailwindEnemyTurns: number
  stealthRockMy: boolean
  stealthRockEnemy: boolean
  spikesMy: number
  spikesEnemy: number
  toxicSpikesMy: number
  toxicSpikesEnemy: number
  stickyWebMy: boolean
  stickyWebEnemy: boolean
}

const DEFAULT_FIELD: FieldState = {
  weather: 'none', weatherTurns: 5,
  trickRoom: false, trickRoomTurns: 5,
  tailwindMy: false, tailwindMyTurns: 4,
  tailwindEnemy: false, tailwindEnemyTurns: 4,
  stealthRockMy: false, stealthRockEnemy: false,
  spikesMy: 0, spikesEnemy: 0,
  toxicSpikesMy: 0, toxicSpikesEnemy: 0,
  stickyWebMy: false, stickyWebEnemy: false,
}

function HazardColumn({
  tailwind, tailwindTurns, onTailwindToggle, onTailwindDec, onTailwindInc,
  stealthRock, onStealthRockToggle,
  spikes, onSpikesClick,
  toxicSpikes, onToxicClick,
  stickyWeb, onStickyWebToggle,
}: {
  tailwind: boolean; tailwindTurns: number
  onTailwindToggle: () => void; onTailwindDec: () => void; onTailwindInc: () => void
  stealthRock: boolean; onStealthRockToggle: () => void
  spikes: number; onSpikesClick: () => void
  toxicSpikes: number; onToxicClick: () => void
  stickyWeb: boolean; onStickyWebToggle: () => void
}) {
  const { t } = useT()
  return (
    <div className="space-y-1">
      <button onClick={onTailwindToggle} className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg transition-all"
        style={{ background: tailwind ? '#4ade8018' : 'transparent', border: `1px solid ${tailwind ? '#4ade8044' : 'var(--border)'}` }}>
        <span className="text-[9px] font-bold" style={{ color: tailwind ? '#4ade80' : 'var(--muted)' }}>{t('field.tailwind')}</span>
        {tailwind ? (
          <div className="flex items-center gap-0.5" onClick={e => e.stopPropagation()}>
            <button onClick={e => { e.stopPropagation(); onTailwindDec() }} className="w-3.5 h-3.5 rounded text-[8px] font-bold flex items-center justify-center hover:opacity-70 transition-opacity" style={{ background: '#4ade8033', color: '#4ade80' }}>−</button>
            <span className="w-4 text-center font-mono text-[9px] font-bold" style={{ color: '#4ade80' }}>{tailwindTurns}</span>
            <button onClick={e => { e.stopPropagation(); onTailwindInc() }} className="w-3.5 h-3.5 rounded text-[8px] font-bold flex items-center justify-center hover:opacity-70 transition-opacity" style={{ background: '#4ade8033', color: '#4ade80' }}>+</button>
          </div>
        ) : <span className="text-[8px]" style={{ color: 'var(--border)' }}>○</span>}
      </button>

      <button onClick={onStealthRockToggle} className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg transition-all"
        style={{ background: stealthRock ? '#f8717118' : 'transparent', border: `1px solid ${stealthRock ? '#f8717144' : 'var(--border)'}` }}>
        <span className="text-[9px] font-bold" style={{ color: stealthRock ? '#f87171' : 'var(--muted)' }}>{t('field.stealthRock')}</span>
        <div className="w-2 h-2 rounded-full transition-colors" style={{ background: stealthRock ? '#f87171' : 'var(--border)' }} />
      </button>

      <button onClick={onSpikesClick} className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg transition-all"
        style={{ background: spikes > 0 ? '#fb923c18' : 'transparent', border: `1px solid ${spikes > 0 ? '#fb923c44' : 'var(--border)'}` }}>
        <span className="text-[9px] font-bold" style={{ color: spikes > 0 ? '#fb923c' : 'var(--muted)' }}>{t('field.spikes')}</span>
        <div className="flex gap-0.5">
          {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full transition-colors" style={{ background: i < spikes ? '#fb923c' : 'var(--border)' }} />)}
        </div>
      </button>

      <button onClick={onToxicClick} className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg transition-all"
        style={{ background: toxicSpikes > 0 ? '#a855f718' : 'transparent', border: `1px solid ${toxicSpikes > 0 ? '#a855f744' : 'var(--border)'}` }}>
        <span className="text-[9px] font-bold" style={{ color: toxicSpikes > 0 ? '#a855f7' : 'var(--muted)' }}>{t('field.toxicSpikes')}</span>
        <div className="flex gap-0.5">
          {[0,1].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full transition-colors" style={{ background: i < toxicSpikes ? '#a855f7' : 'var(--border)' }} />)}
        </div>
      </button>

      <button onClick={onStickyWebToggle} className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg transition-all"
        style={{ background: stickyWeb ? '#a16f4818' : 'transparent', border: `1px solid ${stickyWeb ? '#a16f4844' : 'var(--border)'}` }}>
        <span className="text-[9px] font-bold" style={{ color: stickyWeb ? '#a16f48' : 'var(--muted)' }}>{t('field.stickyWeb')}</span>
        <div className="w-2 h-2 rounded-full transition-colors" style={{ background: stickyWeb ? '#a16f48' : 'var(--border)' }} />
      </button>
    </div>
  )
}

function FieldConditionsPanel({ field, set }: { field: FieldState; set: (u: Partial<FieldState>) => void }) {
  const { t } = useT()

  const WEATHER_CFG = [
    { type: 'sun'  as WeatherType, labelKey: 'field.sun',  color: '#fbbf24', icon: '☀' },
    { type: 'rain' as WeatherType, labelKey: 'field.rain', color: '#60a5fa', icon: '⛈' },
    { type: 'snow' as WeatherType, labelKey: 'field.snow', color: '#93c5fd', icon: '❄' },
    { type: 'sand' as WeatherType, labelKey: 'field.sand', color: '#d97706', icon: '≋' },
  ]

  const hasAny = field.weather !== 'none' || field.trickRoom ||
    field.tailwindMy || field.tailwindEnemy ||
    field.stealthRockMy || field.stealthRockEnemy ||
    field.spikesMy > 0 || field.spikesEnemy > 0 ||
    field.toxicSpikesMy > 0 || field.toxicSpikesEnemy > 0 ||
    field.stickyWebMy || field.stickyWebEnemy

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="section-label">{t('field.title')}</p>
        {hasAny && (
          <button onClick={() => set(DEFAULT_FIELD)} className="text-[9px] px-1.5 py-0.5 rounded transition-colors hover:text-red-400"
            style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}>
            {t('field.clear')}
          </button>
        )}
      </div>

      {/* Weather */}
      <div className="mb-3">
        <p className="text-[8px] font-mono mb-1.5 uppercase tracking-wider" style={{ color: 'var(--muted)' }}>{t('field.weather')}</p>
        <div className="flex gap-1.5 flex-wrap">
          {WEATHER_CFG.map(w => {
            const active = field.weather === w.type
            return (
              <button key={w.type}
                onClick={() => set(active ? { weather: 'none' } : { weather: w.type, weatherTurns: 5 })}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-bold transition-all"
                style={{ background: active ? w.color + '22' : 'transparent', border: `1px solid ${active ? w.color + '66' : 'var(--border)'}`, color: active ? w.color : 'var(--muted)' }}>
                <span>{w.icon}</span>
                <span>{t(w.labelKey)}</span>
                {active && (
                  <div className="flex items-center gap-0.5 ml-0.5" onClick={e => e.stopPropagation()}>
                    <button onClick={e => { e.stopPropagation(); set({ weatherTurns: Math.max(0, field.weatherTurns - 1) }) }} className="w-3 h-3 rounded text-[7px] flex items-center justify-center hover:opacity-70 transition-opacity" style={{ background: w.color + '33', color: w.color }}>−</button>
                    <span className="w-3.5 text-center font-mono text-[9px] font-bold" style={{ color: w.color }}>{field.weatherTurns}</span>
                    <button onClick={e => { e.stopPropagation(); set({ weatherTurns: Math.min(8, field.weatherTurns + 1) }) }} className="w-3 h-3 rounded text-[7px] flex items-center justify-center hover:opacity-70 transition-opacity" style={{ background: w.color + '33', color: w.color }}>+</button>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Trick Room */}
      <div className="mb-3">
        <button onClick={() => set({ trickRoom: !field.trickRoom, trickRoomTurns: 5 })}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all"
          style={{ background: field.trickRoom ? '#a78bfa1a' : 'transparent', border: `1.5px solid ${field.trickRoom ? '#a78bfa55' : 'var(--border)'}` }}>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] font-black" style={{ color: field.trickRoom ? '#a78bfa' : 'var(--muted)' }}>{t('field.trickRoom')}</span>
            {field.trickRoom && (
              <span className="text-[7px] font-bold px-1.5 py-px rounded-full" style={{ background: '#a78bfa22', color: '#a78bfa' }}>{t('field.inverted')}</span>
            )}
          </div>
          {field.trickRoom ? (
            <div className="flex items-center gap-0.5" onClick={e => e.stopPropagation()}>
              <button onClick={e => { e.stopPropagation(); set({ trickRoomTurns: Math.max(0, field.trickRoomTurns - 1) }) }} className="w-3.5 h-3.5 rounded text-[8px] font-bold flex items-center justify-center hover:opacity-70 transition-opacity" style={{ background: '#a78bfa33', color: '#a78bfa' }}>−</button>
              <span className="w-4 text-center font-mono text-[10px] font-bold" style={{ color: '#a78bfa' }}>{field.trickRoomTurns}</span>
              <button onClick={e => { e.stopPropagation(); set({ trickRoomTurns: Math.min(5, field.trickRoomTurns + 1) }) }} className="w-3.5 h-3.5 rounded text-[8px] font-bold flex items-center justify-center hover:opacity-70 transition-opacity" style={{ background: '#a78bfa33', color: '#a78bfa' }}>+</button>
            </div>
          ) : (
            <span className="text-[8px]" style={{ color: 'var(--muted)' }}>{t('field.activate')}</span>
          )}
        </button>
      </div>

      {/* Side columns */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-[8px] font-mono mb-1.5 uppercase tracking-wider" style={{ color: 'var(--muted)' }}>{t('field.mySide')}</p>
          <HazardColumn
            tailwind={field.tailwindMy} tailwindTurns={field.tailwindMyTurns}
            onTailwindToggle={() => set({ tailwindMy: !field.tailwindMy, tailwindMyTurns: 4 })}
            onTailwindDec={() => set({ tailwindMyTurns: Math.max(0, field.tailwindMyTurns - 1) })}
            onTailwindInc={() => set({ tailwindMyTurns: Math.min(4, field.tailwindMyTurns + 1) })}
            stealthRock={field.stealthRockMy} onStealthRockToggle={() => set({ stealthRockMy: !field.stealthRockMy })}
            spikes={field.spikesMy} onSpikesClick={() => set({ spikesMy: (field.spikesMy + 1) % 4 })}
            toxicSpikes={field.toxicSpikesMy} onToxicClick={() => set({ toxicSpikesMy: (field.toxicSpikesMy + 1) % 3 })}
            stickyWeb={field.stickyWebMy} onStickyWebToggle={() => set({ stickyWebMy: !field.stickyWebMy })}
          />
        </div>
        <div>
          <p className="text-[8px] font-mono mb-1.5 uppercase tracking-wider" style={{ color: 'var(--muted)' }}>{t('field.rivalSide')}</p>
          <HazardColumn
            tailwind={field.tailwindEnemy} tailwindTurns={field.tailwindEnemyTurns}
            onTailwindToggle={() => set({ tailwindEnemy: !field.tailwindEnemy, tailwindEnemyTurns: 4 })}
            onTailwindDec={() => set({ tailwindEnemyTurns: Math.max(0, field.tailwindEnemyTurns - 1) })}
            onTailwindInc={() => set({ tailwindEnemyTurns: Math.min(4, field.tailwindEnemyTurns + 1) })}
            stealthRock={field.stealthRockEnemy} onStealthRockToggle={() => set({ stealthRockEnemy: !field.stealthRockEnemy })}
            spikes={field.spikesEnemy} onSpikesClick={() => set({ spikesEnemy: (field.spikesEnemy + 1) % 4 })}
            toxicSpikes={field.toxicSpikesEnemy} onToxicClick={() => set({ toxicSpikesEnemy: (field.toxicSpikesEnemy + 1) % 3 })}
            stickyWeb={field.stickyWebEnemy} onStickyWebToggle={() => set({ stickyWebEnemy: !field.stickyWebEnemy })}
          />
        </div>
      </div>
    </div>
  )
}

/* ── Sub-components ──────────────────────────── */

function TeamSlot({ pokemon, isActive, onToggle, onRemove, showRemove = false }: {
  pokemon: PokemonData | null; isActive: boolean; onToggle: () => void; onRemove?: () => void; showRemove?: boolean
}) {
  const { t } = useT()
  if (!pokemon) {
    return (
      <div className="h-12 rounded-xl flex items-center justify-center border-dashed opacity-30" style={{ border: '1.5px dashed var(--border)' }}>
        <span className="text-[10px]" style={{ color: 'var(--muted)' }}>{t('battle.emptySlot')}</span>
      </div>
    )
  }
  const speed = calcEffectiveSpeed(pokemon)
  const hasMega = isMegaStone(pokemon.item)
  return (
    <button onClick={onToggle} className="w-full rounded-xl p-2 flex items-center gap-2 text-left transition-all hover:scale-[1.01] relative group"
      style={{ background: 'var(--card)', border: `1.5px solid ${isActive ? '#4ade80' : 'var(--border)'}`, boxShadow: isActive ? '0 0 12px #4ade8033' : undefined }}>
      <div className="w-2 h-2 rounded-full shrink-0 transition-all" style={{ background: isActive ? '#4ade80' : 'var(--border)' }} />
      <div className="relative w-8 h-8 shrink-0">
        <Image src={pokemon.sprite} alt={pokemon.displayName} fill className="object-contain" sizes="32px" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-bold truncate" style={{ color: 'var(--text)' }}>{pokemon.displayName}</div>
        <div className="flex gap-1 mt-0.5 items-center">
          {pokemon.types.map(tt => <TypeBadge key={tt} type={tt} size="xs" />)}
          {hasMega && <span className="text-[7px] font-mono px-1 py-px rounded" style={{ background: '#c084fc22', color: '#c084fc' }}>◈</span>}
        </div>
      </div>
      <div className="shrink-0 text-right">
        <div className="font-mono text-[10px] font-bold" style={{ color: isActive ? '#4ade80' : 'var(--muted)' }}>{speed}</div>
        <div className="text-[8px]" style={{ color: 'var(--muted)' }}>{t('statLabels.speed')}</div>
      </div>
      {showRemove && onRemove && (
        <button onClick={e => { e.stopPropagation(); onRemove() }}
          className="absolute top-1 right-1 w-4 h-4 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400 text-xs"
          style={{ color: 'var(--muted)' }}>×</button>
      )}
    </button>
  )
}

function SpeedRankRow({ rank, pokemon, team, maxSpeed, displaySpeed, isBoosted }: {
  rank: number; pokemon: PokemonData; team: 'my' | 'enemy'; maxSpeed: number; displaySpeed: number; isBoosted: boolean
}) {
  const { t } = useT()
  const pct = Math.max(6, Math.round((displaySpeed / Math.max(maxSpeed, 1)) * 100))
  const RANK_COLORS = ['#4ade80', '#a3e635', '#fbbf24', '#f87171']
  const color = RANK_COLORS[rank - 1] ?? '#9ca3af'
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0" style={{ background: color + '22', color }}>{rank}</div>
      <div className="relative w-7 h-7 shrink-0">
        <Image src={pokemon.sprite} alt={pokemon.displayName} fill className="object-contain" sizes="28px" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[11px] font-bold truncate" style={{ color: 'var(--text)' }}>{pokemon.displayName}</span>
          <span className="text-[7px] font-mono font-bold px-1 py-px rounded shrink-0"
            style={{ background: team === 'my' ? 'var(--accent)22' : '#f8717122', color: team === 'my' ? 'var(--accent)' : '#f87171' }}>
            {team === 'my' ? t('battle.me') : t('battle.rival')}
          </span>
          {pokemon.item === 'Choice Scarf' && (
            <span className="text-[7px] font-mono px-1 py-px rounded shrink-0" style={{ background: '#fbbf2422', color: '#fbbf24' }}>Scarf</span>
          )}
          {isMegaStone(pokemon.item) && (
            <span className="text-[7px] font-mono px-1 py-px rounded shrink-0" style={{ background: '#c084fc22', color: '#c084fc' }}>◈Mega</span>
          )}
          {isBoosted && (
            <span className="text-[7px] font-mono px-1 py-px rounded shrink-0" style={{ background: '#4ade8022', color: '#4ade80' }}>⬆×2</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border-subtle)' }}>
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
          </div>
          <span className="font-mono text-[11px] font-bold shrink-0 w-8 text-right" style={{ color }}>{displaySpeed}</span>
        </div>
      </div>
    </div>
  )
}

function MatchupRow({ mine, enemy }: { mine: PokemonData; enemy: PokemonData }) {
  const { t } = useT()
  const rating = matchupRating(mine, enemy)
  const mySpeed = calcEffectiveSpeed(mine)
  const enSpeed = calcEffectiveSpeed(enemy)
  const faster = mySpeed > enSpeed
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        <div className="relative w-6 h-6 shrink-0"><Image src={mine.sprite} alt={mine.displayName} fill className="object-contain" sizes="24px" /></div>
        <span className="text-[10px] font-bold truncate" style={{ color: 'var(--text)' }}>{mine.displayName}</span>
      </div>
      <span className="text-[9px] shrink-0" style={{ color: 'var(--muted)' }}>vs</span>
      <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
        <span className="text-[10px] font-bold truncate" style={{ color: 'var(--text)' }}>{enemy.displayName}</span>
        <div className="relative w-6 h-6 shrink-0"><Image src={enemy.sprite} alt={enemy.displayName} fill className="object-contain" sizes="24px" /></div>
      </div>
      <div className="flex flex-col items-end gap-0.5 shrink-0 ml-1">
        <span className="text-[8px] font-mono font-bold px-1.5 py-px rounded" style={{ background: rating.bg, color: rating.color }}>
          {t(`matchup.${rating.key}`)}
        </span>
        <span className="text-[8px] font-mono" style={{ color: faster ? '#4ade80' : '#f87171' }}>
          {faster ? `⚡ ${mySpeed}` : `⬇ ${mySpeed}`}
        </span>
      </div>
    </div>
  )
}

/* ── Main page ────────────────────────────────── */

export default function BattlePage() {
  const { myTeam, myBattleActive, toggleMyBattleActive, enemyTeam, enemyBattleActive, toggleEnemyBattleActive, setEnemyTeamSlot, clearEnemyTeam } = useStore()
  const { t } = useT()

  const [enemyMegaActiveSlots, setEnemyMegaActiveSlots] = useState<number[]>([])
  const [field, setFieldState] = useState<FieldState>(DEFAULT_FIELD)

  function setField(update: Partial<FieldState>) {
    setFieldState(prev => ({ ...prev, ...update }))
  }

  /* Battle counter — once per session */
  useEffect(() => {
    const validMyTeam = myTeam.filter(Boolean)
    if (validMyTeam.length > 0 && !sessionStorage.getItem('pcc-battle-counted')) {
      fetch('/api/stats/battles', { method: 'POST' }).catch(() => {})
      sessionStorage.setItem('pcc-battle-counted', '1')
    }
  }, [myTeam])

  function calcSpeedWithField(p: PokemonData, team: 'my' | 'enemy'): number {
    const base = calcEffectiveSpeed(p)
    const tailwind = team === 'my' ? field.tailwindMy : field.tailwindEnemy
    return tailwind ? base * 2 : base
  }

  const validMyTeam = myTeam.filter(Boolean) as PokemonData[]
  const filledEnemyCount = enemyTeam.filter(Boolean).length

  const myActivePokemon = myBattleActive.map(i => myTeam[i]).filter(Boolean) as PokemonData[]

  const enemyActivePokemon = enemyBattleActive.map(i => {
    const p = enemyTeam[i]
    if (!p) return null
    if (enemyMegaActiveSlots.includes(i) && p.item) {
      const megaStats = getMegaStats(p.item)
      const megaTypes = getMegaTypes(p.item)
      return { ...p, types: megaTypes ?? p.types, stats: megaStats ? { ...p.stats, ...megaStats } : p.stats }
    }
    return p
  }).filter(Boolean) as PokemonData[]

  type ActiveEntry = { pokemon: PokemonData; team: 'my' | 'enemy' }
  const allActive: ActiveEntry[] = [
    ...myActivePokemon.map(p => ({ pokemon: p, team: 'my' as const })),
    ...enemyActivePokemon.map(p => ({ pokemon: p, team: 'enemy' as const })),
  ].sort((a, b) => {
    const sA = calcSpeedWithField(a.pokemon, a.team)
    const sB = calcSpeedWithField(b.pokemon, b.team)
    return field.trickRoom ? sA - sB : sB - sA
  })

  const maxSpeed = allActive[0] ? calcSpeedWithField(allActive[0].pokemon, allActive[0].team) : 1
  const matchupPairs = myActivePokemon.flatMap(mine => enemyActivePokemon.map(enemy => ({ mine, enemy })))

  function addEnemy(pokemon: PokemonData) {
    if (enemyTeam.some(p => p?.id === pokemon.id)) return
    const slot = enemyTeam.findIndex(p => p === null)
    if (slot === -1) return
    const builds = getMetaBuilds(pokemon.name)
    const build = builds[0]
    const enhanced = build ? { ...pokemon, item: build.item, ability: build.ability } : pokemon
    setEnemyTeamSlot(slot, enhanced)
    if (enemyBattleActive.length < 2) toggleEnemyBattleActive(slot)
  }

  function toggleEnemyMega(slotIndex: number) {
    setEnemyMegaActiveSlots(prev => prev.includes(slotIndex) ? prev.filter(i => i !== slotIndex) : [...prev, slotIndex])
  }

  if (validMyTeam.length === 0) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4 opacity-20">◈</div>
          <p className="font-semibold text-lg mb-1" style={{ color: 'var(--text)' }}>{t('battle.noTeam')}</p>
          <p className="text-sm mb-5" style={{ color: 'var(--muted)' }}>{t('battle.noTeamHint')}</p>
          <Link href="/" className="px-5 py-2 rounded-xl font-bold text-sm" style={{ background: 'var(--accent)', color: '#fff' }}>
            {t('battle.buildTeam')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] px-3 py-5 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_240px] gap-4">

        {/* Col 1: My Team */}
        <aside>
          <div className="flex items-center justify-between mb-2">
            <p className="section-label">{t('battle.myTeam')}</p>
            <span className="text-[9px] font-mono" style={{ color: 'var(--muted)' }}>{myBattleActive.length}/2 {t('battle.activeLabel')}</span>
          </div>
          <p className="text-[10px] mb-3" style={{ color: 'var(--muted)' }}>{t('battle.activeTip')}</p>
          <div className="space-y-1.5">
            {myTeam.map((p, i) => (
              <TeamSlot key={i} pokemon={p} isActive={myBattleActive.includes(i)} onToggle={() => p && toggleMyBattleActive(i)} />
            ))}
          </div>
        </aside>

        {/* Col 2: Analysis */}
        <div className="space-y-4">
          <FieldConditionsPanel field={field} set={setField} />

          {/* Speed ranking */}
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="section-label">{t('battle.speedRanking')}</p>
              <span className="text-[9px] font-mono" style={{ color: 'var(--muted)' }}>{allActive.length} {t('battle.inPlay')}</span>
            </div>

            {field.trickRoom && (
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg mb-2" style={{ background: '#a78bfa1a', border: '1px solid #a78bfa33' }}>
                <span className="text-[9px] font-black" style={{ color: '#a78bfa' }}>⊞</span>
                <span className="text-[9px] font-bold" style={{ color: '#a78bfa' }}>{t('battle.trickRoomActive')}</span>
                <span className="ml-auto font-mono text-[9px] font-bold" style={{ color: '#a78bfa' }}>{field.trickRoomTurns}t</span>
              </div>
            )}

            {allActive.length === 0 ? (
              <div className="py-8 text-center">
                <div className="text-3xl mb-2 opacity-20">⚡</div>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>{t('battle.noActivePlaceholder')}</p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {allActive.map(({ pokemon, team }, i) => {
                  const displaySpeed = calcSpeedWithField(pokemon, team)
                  return (
                    <SpeedRankRow key={`${team}-${pokemon.id}`} rank={i + 1} pokemon={pokemon} team={team}
                      maxSpeed={maxSpeed} displaySpeed={displaySpeed} isBoosted={displaySpeed !== calcEffectiveSpeed(pokemon)} />
                  )
                })}
              </div>
            )}

            {allActive.length >= 2 && (() => {
              const speeds = allActive.map(a => calcSpeedWithField(a.pokemon, a.team))
              const hasTie = speeds.some((s, i) => speeds.indexOf(s) !== i)
              return hasTie ? (
                <p className="text-[9px] mt-2 pt-2 border-t" style={{ color: 'var(--muted)', borderColor: 'var(--border)' }}>{t('battle.speedTie')}</p>
              ) : null
            })()}
          </div>

          {/* Matchups */}
          {matchupPairs.length > 0 && (
            <div className="glass rounded-2xl p-4">
              <p className="section-label mb-3">{t('battle.matchups')}</p>
              <div className="space-y-2">
                {matchupPairs.map(({ mine, enemy }) => (
                  <MatchupRow key={`${mine.id}-${enemy.id}`} mine={mine} enemy={enemy} />
                ))}
              </div>
            </div>
          )}

          {myActivePokemon.length === 0 && enemyActivePokemon.length === 0 && (
            <div className="glass rounded-2xl p-8 text-center">
              <div className="text-4xl mb-3 opacity-20">⚔</div>
              <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{t('battle.selectActiveTitle')}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{t('battle.selectActiveSub')}</p>
            </div>
          )}
        </div>

        {/* Col 3: Enemy Team */}
        <aside>
          <div className="flex items-center justify-between mb-2">
            <p className="section-label">{t('battle.enemyTeam')}</p>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-mono" style={{ color: 'var(--muted)' }}>{enemyBattleActive.length}/2 {t('battle.activeLabel')}</span>
              {filledEnemyCount > 0 && (
                <button onClick={clearEnemyTeam} className="text-[9px] px-1.5 py-0.5 rounded transition-colors hover:text-red-400"
                  style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}>{t('battle.clearEnemy')}</button>
              )}
            </div>
          </div>

          <div className="mb-3">
            <PokemonSearch
              onSelect={addEnemy}
              placeholder={filledEnemyCount < 6 ? t('battle.enemySearchPlaceholder') : t('battle.enemySearchFull')}
              disabled={filledEnemyCount >= 6}
              clearOnSelect
            />
          </div>

          <div className="space-y-1.5">
            {enemyTeam.map((p, i) => (
              <div key={i}>
                <TeamSlot pokemon={p} isActive={enemyBattleActive.includes(i)} onToggle={() => p && toggleEnemyBattleActive(i)} onRemove={() => setEnemyTeamSlot(i, null)} showRemove />
                {p && isMegaStone(p.item) && enemyBattleActive.includes(i) && (
                  <button onClick={() => toggleEnemyMega(i)} className="w-full mt-0.5 text-[8px] font-bold py-0.5 rounded-lg transition-all"
                    style={{
                      background: enemyMegaActiveSlots.includes(i) ? '#c084fc22' : 'transparent',
                      color: enemyMegaActiveSlots.includes(i) ? '#c084fc' : 'var(--muted)',
                      border: `1px solid ${enemyMegaActiveSlots.includes(i) ? '#c084fc44' : 'var(--border)'}`,
                    }}>
                    {enemyMegaActiveSlots.includes(i) ? t('battle.megaActive') : t('battle.megaView')}
                  </button>
                )}
              </div>
            ))}
          </div>

          {filledEnemyCount === 0 && (
            <p className="text-[10px] mt-4 text-center" style={{ color: 'var(--muted)' }}>{t('battle.metaHint')}</p>
          )}
        </aside>
      </div>
    </div>
  )
}
