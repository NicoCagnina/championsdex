'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { PokemonData, PokemonStats } from '@/lib/types'
import { ITEM_CATEGORIES, ALL_ITEMS } from '@/lib/items'
import { getMetaBuilds } from '@/lib/meta'
import { NATURE_GROUPS, getNature, getNatureMult, getNatureLabel } from '@/lib/natures'
import { fetchPokemon } from '@/lib/pokeapi'
import { TypeBadge } from './TypeBadge'
import { TYPE_COLORS } from '@/lib/typeEffectiveness'
import { useT } from '@/lib/i18n'

const FORM_GROUPS: Record<string, { label: string; form: string; types: string[] }[]> = {
  rotom: [
    { label: 'Normal', form: 'rotom',        types: ['electric', 'ghost'] },
    { label: 'Heat',   form: 'rotom-heat',   types: ['electric', 'fire'] },
    { label: 'Wash',   form: 'rotom-wash',   types: ['electric', 'water'] },
    { label: 'Fan',    form: 'rotom-fan',    types: ['electric', 'flying'] },
    { label: 'Frost',  form: 'rotom-frost',  types: ['electric', 'ice'] },
    { label: 'Mow',    form: 'rotom-mow',    types: ['electric', 'grass'] },
  ],
  lycanroc: [
    { label: 'Midday',   form: 'lycanroc',           types: ['rock'] },
    { label: 'Midnight', form: 'lycanroc-midnight',   types: ['rock'] },
    { label: 'Dusk',     form: 'lycanroc-dusk',       types: ['rock'] },
  ],
  oricorio: [
    { label: 'Baile',    form: 'oricorio',          types: ['fire', 'flying'] },
    { label: 'Pom-Pom',  form: 'oricorio-pompom',   types: ['electric', 'flying'] },
    { label: "Pa'u",     form: 'oricorio-pau',       types: ['psychic', 'flying'] },
    { label: 'Sensu',    form: 'oricorio-sensu',     types: ['ghost', 'flying'] },
  ],
}

function getFormGroup(name: string) {
  for (const forms of Object.values(FORM_GROUPS)) {
    if (forms.some(f => f.form === name)) return forms
  }
  return null
}

interface Props {
  pokemon: PokemonData
  slotIndex: number
  onUpdate: (updates: Partial<PokemonData>) => void
  onClose: () => void
}

type Tab = 'item' | 'ability' | 'nature' | 'training'

const STAT_KEYS: (keyof PokemonStats)[] = ['hp', 'attack', 'defense', 'spAttack', 'spDefense', 'speed']
const STAT_COLORS: Record<keyof PokemonStats, string> = {
  hp: '#4ade80', attack: '#f87171', defense: '#60a5fa',
  spAttack: '#c084fc', spDefense: '#34d399', speed: '#fbbf24',
}

const MAX_SP_PER_STAT = 32
const MAX_SP_TOTAL = 66

export function PokemonEditor({ pokemon, onUpdate, onClose }: Props) {
  const { t } = useT()
  const [tab, setTab] = useState<Tab>('item')
  const [itemSearch, setItemSearch] = useState('')
  const [item, setItem] = useState(pokemon.item ?? '')
  const [ability, setAbility] = useState(pokemon.ability ?? '')
  const [nature, setNature] = useState(pokemon.nature ?? '')
  const [training, setTraining] = useState<Partial<PokemonStats>>(
    pokemon.statTraining ?? { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 }
  )

  const STAT_LABELS: Record<keyof PokemonStats, string> = {
    hp: t('statLabels.hp'),
    attack: t('statLabels.attack'),
    defense: t('statLabels.defense'),
    spAttack: t('statLabels.spAttack'),
    spDefense: t('statLabels.spDefense'),
    speed: t('statLabels.speed'),
  }

  const TAB_LABELS: Record<Tab, string> = {
    item: t('editor.tabs.item'),
    ability: t('editor.tabs.ability'),
    nature: t('editor.tabs.nature'),
    training: t('editor.tabs.training'),
  }

  const metaBuilds = getMetaBuilds(pokemon.name)
  const selectedNature = nature ? getNature(nature) : undefined
  const formGroup = getFormGroup(pokemon.name)
  const [formLoading, setFormLoading] = useState(false)

  async function switchForm(formName: string) {
    if (formName === pokemon.name || formLoading) return
    setFormLoading(true)
    try {
      const newData = await fetchPokemon(formName)
      const newAbility = newData.abilityOptions?.some(a => a.name === ability)
        ? ability
        : newData.ability ?? ''
      onUpdate({
        id: newData.id,
        name: newData.name,
        displayName: newData.displayName,
        types: newData.types,
        stats: newData.stats,
        sprite: newData.sprite,
        abilityOptions: newData.abilityOptions,
        ability: newAbility || undefined,
      })
      setAbility(newAbility)
    } catch {
      // silently fail
    } finally {
      setFormLoading(false)
    }
  }

  useEffect(() => {
    onUpdate({
      item: item || undefined,
      ability: ability || undefined,
      nature: nature || undefined,
      statTraining: training,
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, ability, nature, training])

  const totalTraining = STAT_KEYS.reduce((sum, k) => sum + (training[k] ?? 0), 0)

  function adjustStat(stat: keyof PokemonStats, delta: number) {
    setTraining(prev => {
      const cur = prev[stat] ?? 0
      const remaining = MAX_SP_TOTAL - totalTraining
      const maxAdd = Math.min(MAX_SP_PER_STAT - cur, remaining)
      const next = delta > 0
        ? Math.min(MAX_SP_PER_STAT, cur + Math.min(delta, maxAdd))
        : Math.max(0, cur + delta)
      return { ...prev, [stat]: next }
    })
  }

  function resetTraining() {
    setTraining({ hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 })
  }

  function applyMetaBuild(build: ReturnType<typeof getMetaBuilds>[0]) {
    setItem(build.item)
    setAbility(build.ability)
  }

  const filteredItems = itemSearch.trim()
    ? ALL_ITEMS.filter(i => i.name.toLowerCase().includes(itemSearch.toLowerCase()))
    : null

  return (
    <div
      className="fixed inset-x-0 bottom-0 top-14 z-[100] flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg sm:mx-4 rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', maxHeight: '92vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
          {pokemon.sprite && (
            <div className="relative w-12 h-12 shrink-0">
              <Image src={pokemon.sprite} alt={pokemon.displayName} fill className="object-contain" sizes="48px" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm truncate" style={{ color: 'var(--text)' }}>{pokemon.displayName}</div>
            <div className="flex gap-1 mt-0.5">
              {pokemon.types.map(t => <TypeBadge key={t} type={t} size="xs" />)}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            {item && (
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ background: 'var(--border)', color: 'var(--accent)' }}>
                {item}
              </span>
            )}
            {nature && selectedNature && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'var(--border)', color: 'var(--muted)' }}>
                {nature} · {getNatureLabel(selectedNature)}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors hover:bg-[var(--border)]"
            style={{ color: 'var(--muted)' }}
          >×</button>
        </div>

        {/* Form switcher */}
        {formGroup && (
          <div className="px-4 py-2.5 shrink-0 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border)', background: 'var(--card)' }}>
            <span className="section-label shrink-0">{t('editor.formaLabel')}</span>
            <div className="flex gap-1.5 overflow-x-auto pb-0.5 flex-1">
              {formGroup.map(f => {
                const isActive = f.form === pokemon.name
                const primaryColor = TYPE_COLORS[f.types[1] ?? f.types[0]] ?? '#888'
                return (
                  <button
                    key={f.form}
                    onClick={() => switchForm(f.form)}
                    disabled={formLoading}
                    className="shrink-0 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all disabled:opacity-50 flex items-center gap-1.5"
                    style={{
                      background: isActive ? `${primaryColor}33` : 'var(--surface)',
                      border: `1px solid ${isActive ? primaryColor : 'var(--border)'}`,
                      color: isActive ? primaryColor : 'var(--muted)',
                    }}
                  >
                    {f.label}
                    <div className="flex gap-0.5">
                      {f.types.map(t => (
                        <div key={t} className="w-2 h-2 rounded-full" style={{ background: TYPE_COLORS[t] ?? '#888' }} />
                      ))}
                    </div>
                  </button>
                )
              })}
            </div>
            {formLoading && (
              <div className="w-3 h-3 rounded-full border border-t-transparent animate-spin shrink-0"
                style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
          {(['item', 'ability', 'nature', 'training'] as Tab[]).map(tabKey => (
            <button
              key={tabKey}
              onClick={() => setTab(tabKey)}
              className="flex-1 py-2.5 text-[10px] font-bold uppercase tracking-wide transition-all"
              style={{
                color: tab === tabKey ? 'var(--accent)' : 'var(--muted)',
                borderBottom: tab === tabKey ? '2px solid var(--accent)' : '2px solid transparent',
              }}
            >
              {TAB_LABELS[tabKey]}
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">

          {/* Item tab */}
          {tab === 'item' && (
            <div className="p-4 space-y-4">
              {item ? (
                <div className="flex items-center justify-between px-3 py-2 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--accent)' }}>
                  <div>
                    <div className="text-xs font-bold" style={{ color: 'var(--accent)' }}>{item}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: 'var(--muted)' }}>
                      {ALL_ITEMS.find(i => i.name === item)?.desc}
                    </div>
                  </div>
                  <button onClick={() => setItem('')} className="text-sm hover:text-red-400 transition-colors ml-2 shrink-0" style={{ color: 'var(--muted)' }}>×</button>
                </div>
              ) : (
                <div className="px-3 py-2 rounded-xl text-xs text-center" style={{ background: 'var(--card)', border: '1px dashed var(--border)', color: 'var(--muted)' }}>
                  {t('editor.noItem')}
                </div>
              )}

              <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--muted)', flexShrink: 0 }}>
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  value={itemSearch}
                  onChange={e => setItemSearch(e.target.value)}
                  placeholder={t('editor.searchItem')}
                  className="flex-1 bg-transparent outline-none text-xs"
                  style={{ color: 'var(--text)' }}
                />
                {itemSearch && <button onClick={() => setItemSearch('')} className="text-sm" style={{ color: 'var(--muted)' }}>×</button>}
              </div>

              {filteredItems ? (
                <div className="space-y-1">
                  {filteredItems.length === 0 && (
                    <p className="text-xs text-center py-4" style={{ color: 'var(--muted)' }}>{t('editor.noResults')}</p>
                  )}
                  {filteredItems.map(i => (
                    <ItemRow key={i.name} item={i} selected={item === i.name} onSelect={() => setItem(i.name)} />
                  ))}
                </div>
              ) : (
                ITEM_CATEGORIES.map(cat => (
                  <div key={cat.label}>
                    <p className="section-label mb-1.5">{cat.label}</p>
                    <div className="space-y-1">
                      {cat.items.map(i => (
                        <ItemRow key={i.name} item={i} selected={item === i.name} onSelect={() => setItem(i.name)} />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Ability tab */}
          {tab === 'ability' && (
            <div className="p-4 space-y-3">
              {!pokemon.abilityOptions || pokemon.abilityOptions.length === 0 ? (
                <p className="text-xs text-center py-8" style={{ color: 'var(--muted)' }}>
                  {t('editor.noAbilities')}
                </p>
              ) : (
                pokemon.abilityOptions.map(opt => (
                  <button
                    key={opt.name}
                    onClick={() => setAbility(opt.name)}
                    className="w-full text-left px-4 py-3 rounded-xl transition-all"
                    style={{
                      background: ability === opt.name ? 'var(--border)' : 'var(--card)',
                      border: `1px solid ${ability === opt.name ? 'var(--accent)' : 'var(--border)'}`,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: ability === opt.name ? 'var(--accent)' : 'var(--border)' }} />
                      <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{opt.name}</span>
                      {opt.isHidden && (
                        <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-full ml-auto" style={{ background: '#7c3aed22', color: '#a78bfa' }}>
                          {t('editor.hidden')}
                        </span>
                      )}
                    </div>
                  </button>
                ))
              )}

              {metaBuilds.length > 0 && (
                <div className="pt-2">
                  <p className="section-label mb-2">{t('editor.metaAbilities')}</p>
                  <div className="space-y-1">
                    {metaBuilds.map((b, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded" style={{ background: 'var(--border)', color: 'var(--muted)' }}>{b.ability}</span>
                        <span className="text-[10px]" style={{ color: 'var(--muted)' }}>{b.notes.split('.')[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Nature tab */}
          {tab === 'nature' && (
            <div className="p-4 space-y-4">
              <div className="px-3 py-2.5 rounded-xl flex items-center justify-between" style={{ background: 'var(--card)', border: `1px solid ${nature ? 'var(--accent)' : 'var(--border)'}` }}>
                {nature && selectedNature ? (
                  <>
                    <div>
                      <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{nature}</span>
                      <span className="text-xs ml-2 font-mono" style={{ color: 'var(--muted)' }}>{getNatureLabel(selectedNature)}</span>
                    </div>
                    <button onClick={() => setNature('')} className="text-sm ml-2 hover:text-red-400 transition-colors shrink-0" style={{ color: 'var(--muted)' }}>×</button>
                  </>
                ) : (
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>{t('editor.noNature')}</p>
                )}
              </div>

              {NATURE_GROUPS.map(group => (
                <div key={group.label}>
                  <p className="section-label mb-1.5">{group.label}</p>
                  <div className="grid grid-cols-2 gap-1">
                    {group.natures.map(n => {
                      const isSelected = nature === n.name
                      return (
                        <button
                          key={n.name}
                          onClick={() => setNature(isSelected ? '' : n.name)}
                          className="text-left px-3 py-2 rounded-xl transition-all"
                          style={{ background: isSelected ? 'var(--border)' : 'var(--card)', border: `1px solid ${isSelected ? 'var(--accent)' : 'transparent'}` }}
                        >
                          <span className="text-xs font-semibold" style={{ color: isSelected ? 'var(--accent)' : 'var(--text)' }}>{n.name}</span>
                          <span className="text-[8px] font-mono block mt-0.5" style={{ color: 'var(--muted)' }}>
                            {n.increased ? getNatureLabel(n) : t('editor.neutral')}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Training tab */}
          {tab === 'training' && (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="section-label">{t('editor.statPoints')}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: totalTraining > MAX_SP_TOTAL ? '#f87171' : 'var(--muted)' }}>
                    {totalTraining} / {MAX_SP_TOTAL} SP · {MAX_SP_PER_STAT} {t('editor.maxPerStat')}
                  </p>
                </div>
                <button
                  onClick={resetTraining}
                  className="text-xs px-2.5 py-1 rounded-lg transition-colors hover:text-red-400"
                  style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}
                >
                  {t('editor.reset')}
                </button>
              </div>

              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border-subtle)' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, (totalTraining / MAX_SP_TOTAL) * 100)}%`,
                    background: totalTraining > MAX_SP_TOTAL ? '#f87171' : 'var(--accent)',
                  }}
                />
              </div>

              <div className="space-y-3">
                {STAT_KEYS.map(stat => {
                  const base = pokemon.stats[stat]
                  const bonus = training[stat] ?? 0
                  const natureMult = getNatureMult(nature || undefined, stat)
                  const subtotal = base + bonus
                  const effective = Math.floor(subtotal * natureMult)
                  const pct = Math.min(100, (effective / 300) * 100)
                  const isNatureBoosted = natureMult > 1
                  const isNatureLowered = natureMult < 1
                  const labelColor = isNatureBoosted ? '#4ade80' : isNatureLowered ? '#f87171' : STAT_COLORS[stat]

                  return (
                    <div key={stat}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold w-8" style={{ color: labelColor }}>
                          {STAT_LABELS[stat]}
                          {isNatureBoosted && <span style={{ fontSize: 8 }}>↑</span>}
                          {isNatureLowered && <span style={{ fontSize: 8 }}>↓</span>}
                        </span>
                        <span className="font-mono text-[10px] w-8 text-right" style={{ color: 'var(--muted)' }}>{base}</span>
                        <span className="text-[9px]" style={{ color: 'var(--muted)' }}>+</span>
                        <div className="flex items-center rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                          <button onClick={() => adjustStat(stat, -1)} className="w-7 h-6 flex items-center justify-center text-sm transition-colors hover:bg-[var(--border)]" style={{ color: 'var(--muted)' }}>−</button>
                          <input
                            type="number"
                            value={bonus}
                            min={0}
                            max={MAX_SP_PER_STAT}
                            onChange={e => {
                              const v = Math.max(0, Math.min(MAX_SP_PER_STAT, parseInt(e.target.value) || 0))
                              setTraining(prev => ({ ...prev, [stat]: v }))
                            }}
                            className="w-10 text-center text-xs font-mono bg-transparent outline-none py-1"
                            style={{ color: 'var(--text)' }}
                          />
                          <button
                            onClick={() => adjustStat(stat, +1)}
                            disabled={totalTraining >= MAX_SP_TOTAL && bonus >= MAX_SP_PER_STAT}
                            className="w-7 h-6 flex items-center justify-center text-sm transition-colors hover:bg-[var(--border)] disabled:opacity-30"
                            style={{ color: 'var(--muted)' }}
                          >+</button>
                        </div>
                        <span className="text-[9px]" style={{ color: 'var(--muted)' }}>=</span>
                        <span className="font-mono text-xs font-bold w-8" style={{ color: labelColor }}>{effective}</span>
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border-subtle)' }}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: labelColor }} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {nature && selectedNature && (
                <div className="rounded-xl px-3 py-2 text-[10px] font-mono" style={{ background: 'var(--card)', color: 'var(--muted)' }}>
                  {TAB_LABELS.nature}: <span style={{ color: 'var(--accent)' }}>{nature}</span> · {getNatureLabel(selectedNature)} {t('editor.natureApplied')}
                </div>
              )}
            </div>
          )}

          {/* Meta builds */}
          {metaBuilds.length > 0 && (
            <div className="px-4 py-4 space-y-2" style={{ borderTop: '1px solid var(--border)' }}>
              <p className="section-label mb-3">{t('editor.metaBuilds')}</p>
              {metaBuilds.map((build, i) => (
                <div key={i} className="rounded-xl p-3" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-1.5 mb-1.5">
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ background: 'var(--accent)22', color: 'var(--accent)' }}>{build.item}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: '#7c3aed22', color: '#a78bfa' }}>{build.ability}</span>
                      </div>
                      {build.evSpread && (
                        <p className="text-[9px] font-mono mb-1" style={{ color: 'var(--muted)' }}>SP: {build.evSpread}</p>
                      )}
                      <p className="text-[10px] leading-relaxed" style={{ color: 'var(--muted)' }}>{build.notes}</p>
                    </div>
                    <button
                      onClick={() => applyMetaBuild(build)}
                      className="shrink-0 text-[9px] font-bold px-2 py-1 rounded-lg transition-colors"
                      style={{ background: 'var(--border)', color: 'var(--accent)', border: '1px solid var(--border)' }}
                    >
                      {t('editor.apply')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ItemRow({ item, selected, onSelect }: {
  item: { name: string; desc: string; speedMult?: number; atkMult?: number; spAtkMult?: number; megaTypes?: string[] }
  selected: boolean
  onSelect: () => void
}) {
  const { t } = useT()
  return (
    <button
      onClick={onSelect}
      className="w-full text-left px-3 py-2 rounded-xl transition-all"
      style={{ background: selected ? 'var(--border)' : 'transparent', border: `1px solid ${selected ? 'var(--accent)' : 'transparent'}` }}
    >
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: selected ? 'var(--accent)' : 'var(--muted)' }} />
        <div className="flex-1 min-w-0">
          <span className="text-xs font-semibold" style={{ color: selected ? 'var(--accent)' : 'var(--text)' }}>{item.name}</span>
          {item.megaTypes && (
            <span className="font-mono text-[8px] ml-2 px-1 py-px rounded" style={{ background: '#c084fc22', color: '#c084fc' }}>MEGA ◈</span>
          )}
          {(item.speedMult || item.atkMult || item.spAtkMult) && (
            <span className="font-mono text-[8px] ml-2 px-1 py-px rounded" style={{ background: '#fbbf2422', color: '#fbbf24' }}>
              {item.speedMult ? `${t('statLabels.speed')} ×${item.speedMult}` : item.atkMult ? `ATK ×${item.atkMult}` : `SpA ×${item.spAtkMult}`}
            </span>
          )}
        </div>
        <span className="text-[9px] shrink-0 hidden sm:block" style={{ color: 'var(--muted)' }}>
          {item.desc.slice(0, 40)}{item.desc.length > 40 ? '…' : ''}
        </span>
      </div>
    </button>
  )
}
