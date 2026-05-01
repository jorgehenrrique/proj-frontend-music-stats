import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SpotifyTokens {
  accessToken: string
  refreshToken: string | null
  expiresAt: number
}

interface AuthState {
  spotify: SpotifyTokens | null
  lastfmSession: string | null
  lastfmUsername: string | null
  setSpotify: (tokens: SpotifyTokens) => void
  setLastfm: (session: string, username: string) => void
  clearSpotify: () => void
  clearLastfm: () => void
  isSpotifyValid: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      spotify: null,
      lastfmSession: null,
      lastfmUsername: null,
      setSpotify: (tokens) => set({ spotify: tokens }),
      setLastfm: (session, username) => set({ lastfmSession: session, lastfmUsername: username }),
      clearSpotify: () => set({ spotify: null }),
      clearLastfm: () => set({ lastfmSession: null, lastfmUsername: null }),
      isSpotifyValid: () => {
        const { spotify } = get()
        if (!spotify) return false
        return Date.now() < spotify.expiresAt - 60000
      },
    }),
    { name: 'unwrapped-auth' }
  )
)
