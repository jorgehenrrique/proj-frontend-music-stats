import { create } from 'zustand'
import { persist, type StorageValue } from 'zustand/middleware'
import type { ProcessedHistory } from '@/types/stats'

// Sets are not JSON-serializable — store as arrays and restore on rehydration
interface SerializedHistory {
  totalMs: number
  totalPlays: number
  uniqueArtists: string[]
  uniqueTracks: string[]
  activeDays: string[]
  byHour: Record<number, number>
  byWeekday: Record<number, number>
  byMonth: Record<string, number>
  topTracks: { name: string; artist: string; plays: number }[]
  topArtists: { name: string; plays: number }[]
}

interface HistoryState {
  history: ProcessedHistory | null
  setHistory: (h: ProcessedHistory) => void
  clearHistory: () => void
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      history: null,
      setHistory: (h) => set({ history: h }),
      clearHistory: () => set({ history: null }),
    }),
    {
      name: 'unwrapped-history',
      storage: {
        getItem: (key): StorageValue<HistoryState> | null => {
          const raw = localStorage.getItem(key)
          if (!raw) return null
          const { state } = JSON.parse(raw) as { state: { history: SerializedHistory | null } }
          if (!state.history) return { state: { history: null, setHistory: () => {}, clearHistory: () => {} }, version: 0 }
          const h = state.history
          return {
            state: {
              history: {
                ...h,
                uniqueArtists: new Set(h.uniqueArtists),
                uniqueTracks: new Set(h.uniqueTracks),
                activeDays: new Set(h.activeDays),
              } as ProcessedHistory,
              setHistory: () => {},
              clearHistory: () => {},
            },
            version: 0,
          }
        },
        setItem: (key, value) => {
          const { state } = value as { state: HistoryState }
          const h = state.history
          const serialized = {
            state: {
              history: h
                ? {
                    ...h,
                    uniqueArtists: [...h.uniqueArtists],
                    uniqueTracks: [...h.uniqueTracks],
                    activeDays: [...h.activeDays],
                  }
                : null,
            },
            version: 0,
          }
          localStorage.setItem(key, JSON.stringify(serialized))
        },
        removeItem: (key) => localStorage.removeItem(key),
      },
    }
  )
)
