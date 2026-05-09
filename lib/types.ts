export interface PokemonStats {
  hp: number
  attack: number
  defense: number
  spAttack: number
  spDefense: number
  speed: number
}

export interface AbilityOption {
  name: string
  isHidden: boolean
}

export interface PokemonData {
  id: number
  name: string
  displayName: string
  types: string[]
  sprite: string
  stats: PokemonStats
  // Extended build fields
  item?: string
  ability?: string
  nature?: string
  abilityOptions?: AbilityOption[]
  statTraining?: Partial<PokemonStats>
}

export interface SavedTeam {
  name: string
  team: (PokemonData | null)[]
  savedAt: string
}
