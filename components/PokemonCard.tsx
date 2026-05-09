'use client'
import Image from 'next/image'
import { PokemonData } from '@/lib/types'
import { TypeBadge } from './TypeBadge'
import { TYPE_COLORS } from '@/lib/typeEffectiveness'
import { getNature, getNatureLabel } from '@/lib/natures'
import { isMegaStone } from '@/lib/items'
import { useT } from '@/lib/i18n'

interface Props {
  pokemon: PokemonData
  isActive?: boolean
  compact?: boolean
  onClick?: () => void
  onRemove?: () => void
  onEdit?: () => void
  dimmed?: boolean
}

export function PokemonCard({ pokemon, isActive, compact, onClick, onRemove, onEdit, dimmed }: Props) {
  const { t } = useT()
  const primaryColor = TYPE_COLORS[pokemon.types[0]] ?? '#888'
  const natureObj = pokemon.nature ? getNature(pokemon.nature) : undefined
  const hasMega = isMegaStone(pokemon.item)

  return (
    <div
      className={`
        relative rounded-xl overflow-hidden transition-all duration-200 select-none
        ${onClick ? 'cursor-pointer' : ''}
        ${isActive ? 'ring-2 scale-[1.02]' : onClick ? 'hover:scale-[1.01]' : ''}
        ${dimmed ? 'opacity-40' : ''}
        ${compact ? 'p-2.5' : 'p-3'}
      `}
      style={{
        background: 'var(--card)',
        border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
        boxShadow: isActive ? '0 0 18px var(--accent-glow)' : undefined,
        backdropFilter: 'blur(10px)',
      }}
      onClick={onClick}
    >
      {/* Type gradient bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 80% 20%, ${primaryColor}18, transparent 60%)`,
        }}
      />

      {/* Action buttons top-right */}
      <div className="absolute top-1.5 right-1.5 z-10 flex gap-1">
        {onEdit && (
          <button
            onClick={e => { e.stopPropagation(); onEdit() }}
            className="w-5 h-5 rounded flex items-center justify-center transition-colors hover:bg-[var(--border)]"
            style={{ color: 'var(--muted)' }}
            title="Editar"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        )}
        {onRemove && (
          <button
            onClick={e => { e.stopPropagation(); onRemove() }}
            className="w-5 h-5 rounded flex items-center justify-center text-sm transition-colors hover:text-red-400"
            style={{ color: 'var(--muted)' }}
          >
            ×
          </button>
        )}
      </div>

      <div className="relative z-10 flex items-center gap-2.5">
        {/* Sprite */}
        <div
          className="relative shrink-0"
          style={{ width: compact ? 44 : 56, height: compact ? 44 : 56 }}
        >
          {pokemon.sprite ? (
            <Image
              src={pokemon.sprite}
              alt={pokemon.displayName}
              fill
              className="object-contain drop-shadow-sm"
              sizes={compact ? '44px' : '56px'}
            />
          ) : (
            <div className="w-full h-full rounded-full" style={{ background: 'var(--border)' }} />
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div
            className={`font-bold truncate ${compact ? 'text-xs' : 'text-sm'}`}
            style={{ color: 'var(--text)' }}
          >
            {pokemon.displayName}
          </div>
          <div className="flex gap-1 mt-0.5 flex-wrap">
            {pokemon.types.map(t => <TypeBadge key={t} type={t} size="xs" />)}
          </div>

          {/* Item + ability + nature badges */}
          {(pokemon.item || pokemon.ability || pokemon.nature) && (
            <div className="flex gap-1 mt-1 flex-wrap">
              {pokemon.item && (
                <span
                  className="text-[8px] font-mono font-bold px-1.5 py-px rounded"
                  style={{ background: hasMega ? '#c084fc22' : 'var(--warm)22', color: hasMega ? '#c084fc' : 'var(--warm)' }}
                >
                  {hasMega ? '◈' : ''}{pokemon.item}
                </span>
              )}
              {pokemon.ability && (
                <span
                  className="text-[8px] font-mono px-1.5 py-px rounded"
                  style={{ background: 'var(--border)', color: 'var(--muted)' }}
                >
                  {pokemon.ability}
                </span>
              )}
              {natureObj && (
                <span
                  className="text-[8px] font-mono px-1.5 py-px rounded"
                  style={{ background: 'var(--border)', color: 'var(--muted)' }}
                >
                  {pokemon.nature}{natureObj.increased ? ` ${getNatureLabel(natureObj)}` : ''}
                </span>
              )}
            </div>
          )}

          {!compact && (
            <div className="font-mono text-[10px] mt-1 flex gap-2" style={{ color: 'var(--muted)' }}>
              <span>
                {t('statLabels.speed')} <span style={{ color: 'var(--accent)' }}>
                  {pokemon.stats.speed + (pokemon.statTraining?.speed ?? 0)}
                </span>
              </span>
              <span>
                ATK <span style={{ color: 'var(--text)' }}>
                  {pokemon.stats.attack + (pokemon.statTraining?.attack ?? 0)}
                </span>
              </span>
              <span>
                SpA <span style={{ color: 'var(--text)' }}>
                  {pokemon.stats.spAttack + (pokemon.statTraining?.spAttack ?? 0)}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>

      {isActive && (
        <div className="absolute bottom-0 inset-x-0 h-0.5" style={{ background: 'var(--accent)' }} />
      )}
    </div>
  )
}
