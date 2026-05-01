import {
  SPOTIFY_API_BASE,
  SPOTIFY_AUTH_URL,
  SPOTIFY_SCOPES,
  SPOTIFY_TOKEN_URL,
} from '@/lib/constants'
import { useAuthStore } from '@/store/authStore'
import type {
  SpotifyTimeRange,
  SpotifyTopArtistsResponse,
  SpotifyTopTracksResponse,
  SpotifyUser,
  SpotifyRecentlyPlayedResponse,
  SpotifyCurrentlyPlaying,
} from '@/types/spotify'

function generateCodeVerifier(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const data = new TextEncoder().encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

export async function initiateSpotifyAuth(): Promise<void> {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string
  const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI as string

  const verifier = generateCodeVerifier()
  const challenge = await generateCodeChallenge(verifier)

  sessionStorage.setItem('spotify_verifier', verifier)

  const state = crypto.randomUUID()
  sessionStorage.setItem('spotify_state', state)

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: SPOTIFY_SCOPES,
    state,
    code_challenge_method: 'S256',
    code_challenge: challenge,
  })

  window.location.href = `${SPOTIFY_AUTH_URL}?${params}`
}

export async function exchangeSpotifyCode(code: string): Promise<void> {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string
  const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI as string
  const verifier = sessionStorage.getItem('spotify_verifier')

  if (!verifier) throw new Error('No code verifier found')

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: verifier,
    }),
  })

  if (!response.ok) throw new Error('Token exchange failed')

  const data = (await response.json()) as {
    access_token: string
    refresh_token?: string
    expires_in: number
  }
  useAuthStore.getState().setSpotify({
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? null,
    expiresAt: Date.now() + data.expires_in * 1000,
  })

  sessionStorage.removeItem('spotify_verifier')
  sessionStorage.removeItem('spotify_state')
}

export async function refreshSpotifyToken(): Promise<void> {
  const { spotify, setSpotify, clearSpotify } = useAuthStore.getState()
  if (!spotify?.refreshToken) {
    clearSpotify()
    throw new Error('No refresh token available')
  }

  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: spotify.refreshToken,
      client_id: clientId,
    }),
  })

  if (!response.ok) {
    clearSpotify()
    throw new Error('Token refresh failed')
  }

  const data = (await response.json()) as {
    access_token: string
    refresh_token?: string
    expires_in: number
  }

  setSpotify({
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? spotify.refreshToken,
    expiresAt: Date.now() + data.expires_in * 1000,
  })
}

async function spotifyFetch<T>(endpoint: string): Promise<T> {
  const { spotify, isSpotifyValid } = useAuthStore.getState()
  if (!spotify) throw new Error('Not authenticated with Spotify')

  if (!isSpotifyValid()) {
    await refreshSpotifyToken()
  }

  const { spotify: freshSpotify } = useAuthStore.getState()
  if (!freshSpotify) throw new Error('Not authenticated with Spotify')

  const response = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
    headers: { Authorization: `Bearer ${freshSpotify.accessToken}` },
  })

  if (!response.ok) throw new Error(`Spotify API error: ${response.status}`)
  return response.json() as Promise<T>
}

export const spotifyApi = {
  getMe: () => spotifyFetch<SpotifyUser>('/me'),
  getTopTracks: (timeRange: SpotifyTimeRange = 'medium_term', limit = 50) =>
    spotifyFetch<SpotifyTopTracksResponse>(`/me/top/tracks?time_range=${timeRange}&limit=${limit}`),
  getTopArtists: (timeRange: SpotifyTimeRange = 'medium_term', limit = 50) =>
    spotifyFetch<SpotifyTopArtistsResponse>(
      `/me/top/artists?time_range=${timeRange}&limit=${limit}`
    ),
  getRecentlyPlayed: (limit = 50) =>
    spotifyFetch<SpotifyRecentlyPlayedResponse>(`/me/player/recently-played?limit=${limit}`),
  getCurrentlyPlaying: () => spotifyFetch<SpotifyCurrentlyPlaying>('/me/player/currently-playing'),
}
