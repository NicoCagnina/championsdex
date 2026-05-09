// Attacking type → defender type → multiplier (omitted = 1×)
export const TYPE_CHART: Record<string, Record<string, number>> = {
  normal:   { rock: 0.5, ghost: 0, steel: 0.5 },
  fire:     { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water:    { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass:    { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice:      { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison:   { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground:   { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying:   { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic:  { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug:      { fire: 0.5, grass: 2, fighting: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock:     { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost:    { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon:   { dragon: 2, steel: 0.5, fairy: 0 },
  dark:     { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel:    { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy:    { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
}

export const ALL_TYPES = Object.keys(TYPE_CHART)

// Effectiveness of one attack type against a defender's type combination
export function getEffectiveness(attackType: string, defenderTypes: string[]): number {
  let mult = 1
  for (const def of defenderTypes) {
    mult *= TYPE_CHART[attackType]?.[def] ?? 1
  }
  return mult
}

// Best effectiveness score using attacker's own types as STAB moves
export function getOffensiveScore(attackerTypes: string[], defenderTypes: string[]): number {
  return Math.max(...attackerTypes.map(t => getEffectiveness(t, defenderTypes)))
}

// Worst vulnerability: highest effectiveness the enemy types can hit you with
export function getDefensiveVulnerability(myTypes: string[], enemyTypes: string[]): number {
  return Math.max(...enemyTypes.map(t => getEffectiveness(t, myTypes)))
}

// Full chart of every type vs defender — for the "weaknesses" display
export function getAllAttackersVsDefender(defenderTypes: string[]): Record<string, number> {
  const result: Record<string, number> = {}
  for (const atk of ALL_TYPES) {
    result[atk] = getEffectiveness(atk, defenderTypes)
  }
  return result
}

export function multLabel(mult: number): string {
  if (mult === 0) return '0×'
  if (mult === 0.25) return '¼×'
  if (mult === 0.5) return '½×'
  if (mult === 2) return '2×'
  if (mult === 4) return '4×'
  return `${mult}×`
}

export const TYPE_COLORS: Record<string, string> = {
  normal:   '#A8A77A',
  fire:     '#EE8130',
  water:    '#6390F0',
  electric: '#F7D02C',
  grass:    '#7AC74C',
  ice:      '#96D9D6',
  fighting: '#C22E28',
  poison:   '#A33EA1',
  ground:   '#E2BF65',
  flying:   '#A98FF3',
  psychic:  '#F95587',
  bug:      '#A6B91A',
  rock:     '#B6A136',
  ghost:    '#735797',
  dragon:   '#6F35FC',
  dark:     '#705746',
  steel:    '#B7B7CE',
  fairy:    '#D685AD',
}

export const TYPE_TEXT: Record<string, string> = {
  normal: '#fff', fire: '#fff', water: '#fff', electric: '#1a1400',
  grass: '#fff', ice: '#0a2020', fighting: '#fff', poison: '#fff',
  ground: '#1a1200', flying: '#fff', psychic: '#fff', bug: '#fff',
  rock: '#fff', ghost: '#fff', dragon: '#fff', dark: '#fff',
  steel: '#0a0a20', fairy: '#fff',
}
