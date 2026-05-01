import { LASTFM_API_BASE } from '@/lib/constants'
import type { LastfmPeriod, LastfmUser, LastfmTrack, LastfmArtist } from '@/types/lastfm'

const apiKey = () => import.meta.env.VITE_LASTFM_API_KEY as string

interface LastfmErrorResponse {
  error: number
  message: string
}

async function lastfmFetch<T>(params: Record<string, string>): Promise<T> {
  const url = new URL(LASTFM_API_BASE)
  url.search = new URLSearchParams({
    ...params,
    api_key: apiKey(),
    format: 'json',
  }).toString()

  const response = await fetch(url.toString())
  if (!response.ok) throw new Error(`Last.fm API error: ${response.status}`)

  const data = (await response.json()) as T | LastfmErrorResponse
  if ('error' in (data as object)) {
    const err = data as LastfmErrorResponse
    throw new Error(`Last.fm error ${err.error}: ${err.message}`)
  }

  return data as T
}

export const lastfmApi = {
  getUser: (username: string) =>
    lastfmFetch<{ user: LastfmUser }>({ method: 'user.getinfo', user: username }),

  getTopTracks: (username: string, period: LastfmPeriod = 'overall', limit = 50) =>
    lastfmFetch<{ toptracks: { track: LastfmTrack[] } }>({
      method: 'user.gettoptracks',
      user: username,
      period,
      limit: String(limit),
    }),

  getTopArtists: (username: string, period: LastfmPeriod = 'overall', limit = 50) =>
    lastfmFetch<{ topartists: { artist: LastfmArtist[] } }>({
      method: 'user.gettopartists',
      user: username,
      period,
      limit: String(limit),
    }),

  getRecentTracks: (username: string, page = 1, limit = 200) =>
    lastfmFetch<{
      recenttracks: {
        track: LastfmTrack[]
        '@attr': { total: string; totalPages: string }
      }
    }>({
      method: 'user.getrecenttracks',
      user: username,
      page: String(page),
      limit: String(limit),
    }),
}
