import { PokemonStats } from './types'

export interface Nature {
  name: string
  increased: keyof PokemonStats | null  // null = neutral nature
  decreased: keyof PokemonStats | null
}

export const NATURES: Nature[] = [
  // Neutral
  { name: 'Hardy',   increased: null,          decreased: null },
  { name: 'Docile',  increased: null,          decreased: null },
  { name: 'Serious', increased: null,          decreased: null },
  { name: 'Bashful', increased: null,          decreased: null },
  { name: 'Quirky',  increased: null,          decreased: null },
  // +ATK
  { name: 'Lonely',  increased: 'attack',      decreased: 'defense' },
  { name: 'Brave',   increased: 'attack',      decreased: 'speed' },
  { name: 'Adamant', increased: 'attack',      decreased: 'spAttack' },
  { name: 'Naughty', increased: 'attack',      decreased: 'spDefense' },
  // +DEF
  { name: 'Bold',    increased: 'defense',     decreased: 'attack' },
  { name: 'Relaxed', increased: 'defense',     decreased: 'speed' },
  { name: 'Impish',  increased: 'defense',     decreased: 'spAttack' },
  { name: 'Lax',     increased: 'defense',     decreased: 'spDefense' },
  // +VEL
  { name: 'Timid',   increased: 'speed',       decreased: 'attack' },
  { name: 'Hasty',   increased: 'speed',       decreased: 'defense' },
  { name: 'Jolly',   increased: 'speed',       decreased: 'spAttack' },
  { name: 'Naive',   increased: 'speed',       decreased: 'spDefense' },
  // +SpA
  { name: 'Modest',  increased: 'spAttack',    decreased: 'attack' },
  { name: 'Mild',    increased: 'spAttack',    decreased: 'defense' },
  { name: 'Quiet',   increased: 'spAttack',    decreased: 'speed' },
  { name: 'Rash',    increased: 'spAttack',    decreased: 'spDefense' },
  // +SpD
  { name: 'Calm',    increased: 'spDefense',   decreased: 'attack' },
  { name: 'Gentle',  increased: 'spDefense',   decreased: 'defense' },
  { name: 'Sassy',   increased: 'spDefense',   decreased: 'speed' },
  { name: 'Careful', increased: 'spDefense',   decreased: 'spAttack' },
]

// Grouped by what they boost (useful for UI)
export const NATURE_GROUPS: { stat: keyof PokemonStats | null; label: string; natures: Nature[] }[] = [
  { stat: 'speed',     label: '+VEL',  natures: NATURES.filter(n => n.increased === 'speed') },
  { stat: 'attack',    label: '+ATK',  natures: NATURES.filter(n => n.increased === 'attack') },
  { stat: 'spAttack',  label: '+SpA',  natures: NATURES.filter(n => n.increased === 'spAttack') },
  { stat: 'defense',   label: '+DEF',  natures: NATURES.filter(n => n.increased === 'defense') },
  { stat: 'spDefense', label: '+SpD',  natures: NATURES.filter(n => n.increased === 'spDefense') },
  { stat: null,        label: 'Neutra', natures: NATURES.filter(n => n.increased === null) },
]

export function getNature(name: string): Nature | undefined {
  return NATURES.find(n => n.name === name)
}

export function getNatureMult(nature: string | undefined, stat: keyof PokemonStats): number {
  if (!nature) return 1
  const n = getNature(nature)
  if (!n) return 1
  if (n.increased === stat) return 1.1
  if (n.decreased === stat) return 0.9
  return 1
}

const STAT_SHORT: Record<keyof PokemonStats, string> = {
  hp: 'HP', attack: 'ATK', defense: 'DEF',
  spAttack: 'SpA', spDefense: 'SpD', speed: 'VEL',
}

export function getNatureLabel(nature: Nature): string {
  if (!nature.increased) return 'Neutra'
  return `${STAT_SHORT[nature.increased]}↑ / ${STAT_SHORT[nature.decreased!]}↓`
}
