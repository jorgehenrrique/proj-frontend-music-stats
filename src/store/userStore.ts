import { create } from 'zustand'
import type { SpotifyUser } from '@/types/spotify'

interface UserState {
  spotifyUser: SpotifyUser | null
  dominantColor: string
  historyLoaded: boolean
  setSpotifyUser: (user: SpotifyUser) => void
  setDominantColor: (color: string) => void
  setHistoryLoaded: (loaded: boolean) => void
  reset: () => void
}

export const useUserStore = create<UserState>((set) => ({
  spotifyUser: null,
  dominantColor: '#1DB954',
  historyLoaded: false,
  setSpotifyUser: (user) => set({ spotifyUser: user }),
  setDominantColor: (color) => set({ dominantColor: color }),
  setHistoryLoaded: (loaded) => set({ historyLoaded: loaded }),
  reset: () => set({ spotifyUser: null, dominantColor: '#1DB954', historyLoaded: false }),
}))
