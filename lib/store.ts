import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PokemonData, SavedTeam } from './types'

interface AppStore {
  // Locale
  locale: string
  setLocale: (locale: 'en' | 'es') => void

  // Team builder
  myTeam: (PokemonData | null)[]
  activeSlot: number
  savedTeams: SavedTeam[]

  // Battle screen
  enemyTeam: (PokemonData | null)[]
  myBattleActive: number[]
  enemyBattleActive: number[]

  // Team builder actions
  setTeamSlot: (index: number, pokemon: PokemonData | null) => void
  setActiveSlot: (index: number) => void
  updateSlot: (index: number, updates: Partial<PokemonData>) => void
  clearTeam: () => void

  // Battle actions
  setEnemyTeamSlot: (index: number, pokemon: PokemonData | null) => void
  updateEnemySlot: (index: number, updates: Partial<PokemonData>) => void
  clearEnemyTeam: () => void
  toggleMyBattleActive: (index: number) => void
  toggleEnemyBattleActive: (index: number) => void

  // Saved teams
  saveTeam: (name: string) => void
  loadTeam: (name: string) => void
  deleteSavedTeam: (name: string) => void
}

function toggleActive(current: number[], index: number): number[] {
  if (current.includes(index)) return current.filter(i => i !== index)
  if (current.length < 2) return [...current, index]
  return [current[1], index]
}

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      locale: 'en',
      setLocale: (locale) => set({ locale }),

      myTeam: Array(6).fill(null),
      activeSlot: 0,
      savedTeams: [],
      enemyTeam: Array(6).fill(null),
      myBattleActive: [],
      enemyBattleActive: [],

      setTeamSlot: (index, pokemon) =>
        set(s => {
          const team = [...s.myTeam]
          team[index] = pokemon
          const myBattleActive = pokemon ? s.myBattleActive : s.myBattleActive.filter(i => i !== index)
          return { myTeam: team, myBattleActive }
        }),

      setActiveSlot: index => set({ activeSlot: index }),

      updateSlot: (index, updates) =>
        set(s => {
          const team = [...s.myTeam]
          if (team[index]) team[index] = { ...team[index]!, ...updates }
          return { myTeam: team }
        }),

      clearTeam: () => set({ myTeam: Array(6).fill(null), activeSlot: 0, myBattleActive: [] }),

      setEnemyTeamSlot: (index, pokemon) =>
        set(s => {
          const team = [...s.enemyTeam]
          team[index] = pokemon
          const enemyBattleActive = pokemon ? s.enemyBattleActive : s.enemyBattleActive.filter(i => i !== index)
          return { enemyTeam: team, enemyBattleActive }
        }),

      updateEnemySlot: (index, updates) =>
        set(s => {
          const team = [...s.enemyTeam]
          if (team[index]) team[index] = { ...team[index]!, ...updates }
          return { enemyTeam: team }
        }),

      clearEnemyTeam: () => set({ enemyTeam: Array(6).fill(null), enemyBattleActive: [] }),

      toggleMyBattleActive: index =>
        set(s => ({ myBattleActive: toggleActive(s.myBattleActive, index) })),

      toggleEnemyBattleActive: index =>
        set(s => ({ enemyBattleActive: toggleActive(s.enemyBattleActive, index) })),

      saveTeam: (name) =>
        set(s => ({
          savedTeams: [
            ...s.savedTeams.filter(t => t.name !== name),
            { name, team: [...s.myTeam], savedAt: new Date().toISOString() },
          ],
        })),

      loadTeam: (name) => {
        const saved = get().savedTeams.find(t => t.name === name)
        if (saved) set({ myTeam: [...saved.team], activeSlot: 0, myBattleActive: [] })
      },

      deleteSavedTeam: (name) =>
        set(s => ({ savedTeams: s.savedTeams.filter(t => t.name !== name) })),
    }),
    { name: 'pcc-v2' }
  )
)
