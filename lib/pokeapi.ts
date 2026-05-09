import { PokemonData, AbilityOption } from './types'

const BASE = 'https://pokeapi.co/api/v2'

export async function fetchPokemon(query: string): Promise<PokemonData> {
  const normalized = query.toLowerCase().trim().replace(/\s+/g, '-')
  const res = await fetch(`${BASE}/pokemon/${normalized}`)
  if (!res.ok) throw new Error(`Pokémon no encontrado: ${query}`)
  const data = await res.json()

  const statKeys: Record<string, keyof PokemonData['stats']> = {
    hp: 'hp',
    attack: 'attack',
    defense: 'defense',
    'special-attack': 'spAttack',
    'special-defense': 'spDefense',
    speed: 'speed',
  }

  const stats: PokemonData['stats'] = {
    hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0,
  }
  for (const s of data.stats) {
    const k = statKeys[s.stat.name]
    if (k) stats[k] = s.base_stat
  }

  const displayName = data.name
    .split('-')
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  const sprite =
    data.sprites?.other?.['official-artwork']?.front_default ??
    data.sprites?.front_default ??
    ''

  const abilityOptions: AbilityOption[] = (data.abilities ?? []).map(
    (a: { ability: { name: string }; is_hidden: boolean }) => ({
      name: a.ability.name
        .split('-')
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' '),
      isHidden: a.is_hidden,
    })
  )

  return {
    id: data.id,
    name: data.name,
    displayName,
    types: data.types.map((t: { type: { name: string } }) => t.type.name),
    sprite,
    stats,
    abilityOptions,
    ability: abilityOptions.find(a => !a.isHidden)?.name,
  }
}

// Alternate forms with different types/stats not in the main 1025 list
const EXTRA_FORMS = [
  'rotom-heat', 'rotom-wash', 'rotom-fan', 'rotom-frost', 'rotom-mow',
  'lycanroc-midnight', 'lycanroc-dusk',
  'oricorio-pompom', 'oricorio-pau', 'oricorio-sensu',
  'toxtricity-low-key',
  'indeedee-female',
  'basculegion-female',
]

let cachedNames: string[] = []

export async function getPokemonNames(): Promise<string[]> {
  if (cachedNames.length) return cachedNames
  const res = await fetch(`${BASE}/pokemon?limit=1025`)
  const data = await res.json()
  const base: string[] = data.results.map((p: { name: string }) => p.name)
  cachedNames = [...base, ...EXTRA_FORMS]
  return cachedNames
}

export function filterNames(names: string[], query: string, limit = 10): string[] {
  const q = query.toLowerCase().trim()
  if (!q) return []
  const starts = names.filter(n => n.startsWith(q))
  const includes = names.filter(n => !n.startsWith(q) && n.includes(q))
  return [...starts, ...includes].slice(0, limit)
}

export function formatName(name: string): string {
  return name
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}
