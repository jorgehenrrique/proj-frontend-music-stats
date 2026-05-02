import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useHistoryStore } from '@/store/historyStore'
import { spotifyApi } from '@/api/spotify'
import { lastfmApi } from '@/api/lastfm'
import type { SpotifyTrack, SpotifyArtist, SpotifyCurrentlyPlaying } from '@/types/spotify'
import type { MonthlyStats, HourlyStats, WeeklyStats } from '@/types/stats'
import {
  DEMO_TRACKS,
  DEMO_ARTISTS,
  DEMO_MONTHLY,
  DEMO_HOURLY,
  DEMO_WEEKLY,
  DEMO_GENRES,
} from '@/components/dashboard/DEMO_DATA'

const GRADIENT_POOL: [string, string][] = [
  ['#E91E63', '#880E4F'],
  ['#9C27B0', '#4A148C'],
  ['#3F51B5', '#1A237E'],
  ['#FF7043', '#BF360C'],
  ['#43A047', '#1B5E20'],
  ['#F59E0B', '#78350F'],
  ['#06B6D4', '#164E63'],
  ['#EC4899', '#831843'],
]

function gradient(i: number): [string, string] {
  return GRADIENT_POOL[i % GRADIENT_POOL.length]
}

const WEEKDAY_KEYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export interface SpotifyDataResult {
  isDemo: boolean
  topTracks: typeof DEMO_TRACKS
  topArtists: typeof DEMO_ARTISTS
  monthly: MonthlyStats[]
  hourly: HourlyStats[]
  weekly: WeeklyStats[]
  genres: typeof DEMO_GENRES
  totalHours: number
  totalPlays: number
  uniqueArtistsCount: number
  activeDaysCount: number
  currentlyPlaying: SpotifyCurrentlyPlaying | null
  loading: boolean
}

export function useSpotifyData(timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term'): SpotifyDataResult {
  const { spotify, lastfmUsername } = useAuthStore()
  const history = useHistoryStore((s) => s.history)
  const isAuthenticated = !!spotify

  const [loading, setLoading] = useState(isAuthenticated)
  const [tracks, setTracks] = useState<SpotifyTrack[]>([])
  const [artists, setArtists] = useState<SpotifyArtist[]>([])
  const [currentlyPlaying, setCurrentlyPlaying] = useState<SpotifyCurrentlyPlaying | null>(null)
  const [lastfmTopTracks, setLastfmTopTracks] = useState<{ name: string; artist: string; plays: number }[]>([])

  useEffect(() => {
    if (!isAuthenticated) return

    setLoading(true)
    const periodMap: Record<string, string> = {
      short_term: '1month',
      medium_term: '6month',
      long_term: 'overall',
    }

    Promise.allSettled([
      spotifyApi.getTopTracks(timeRange, 50),
      spotifyApi.getTopArtists(timeRange, 50),
      spotifyApi.getCurrentlyPlaying(),
      lastfmUsername
        ? lastfmApi.getTopTracks(lastfmUsername, periodMap[timeRange] as never, 50)
        : Promise.resolve(null),
    ]).then(([tracksRes, artistsRes, playingRes, lastfmRes]) => {
      if (tracksRes.status === 'fulfilled') setTracks(tracksRes.value.items)
      if (artistsRes.status === 'fulfilled') setArtists(artistsRes.value.items)
      if (playingRes.status === 'fulfilled') setCurrentlyPlaying(playingRes.value)
      if (lastfmRes.status === 'fulfilled' && lastfmRes.value) {
        const lfTracks = lastfmRes.value.toptracks?.track ?? []
        setLastfmTopTracks(
          lfTracks.map((t) => ({
            name: t.name,
            artist: t.artist.name,
            plays: Number(t.playcount ?? 0),
          }))
        )
      }
      setLoading(false)
    })
  }, [isAuthenticated, timeRange, lastfmUsername])

  // Not authenticated — return demo data
  if (!isAuthenticated) {
    return {
      isDemo: true,
      topTracks: DEMO_TRACKS,
      topArtists: DEMO_ARTISTS,
      monthly: DEMO_MONTHLY,
      hourly: DEMO_HOURLY,
      weekly: DEMO_WEEKLY,
      genres: DEMO_GENRES,
      totalHours: DEMO_MONTHLY.reduce((a, b) => a + b.hours, 0),
      totalPlays: 12483,
      uniqueArtistsCount: 284,
      activeDaysCount: 287,
      currentlyPlaying: null,
      loading: false,
    }
  }

  // Build real track list — prefer Last.fm play counts merged with Spotify order
  const realTracks = tracks.slice(0, 50).map((tr, i) => {
    const lfMatch = lastfmTopTracks.find(
      (lf) => lf.name.toLowerCase() === tr.name.toLowerCase()
    )
    return {
      rank: i + 1,
      name: tr.name,
      artist: tr.artists[0]?.name ?? '',
      plays: lfMatch?.plays ?? 0,
      gradient: gradient(i),
      imageUrl: tr.album?.images?.[0]?.url ?? null,
    }
  })

  const realArtists = artists.slice(0, 20).map((a, i) => ({
    rank: i + 1,
    name: a.name,
    plays: 0,
    tags: a.genres?.slice(0, 2).join(' · ') ?? '',
    gradient: gradient(i),
    color: GRADIENT_POOL[i % GRADIENT_POOL.length][0],
    imageUrl: a.images?.[0]?.url ?? null,
  }))

  // Monthly / hourly / weekly — use uploaded history if available, else empty
  let monthly: MonthlyStats[] = []
  let hourly: HourlyStats[] = []
  let weekly: WeeklyStats[] = []
  let totalHours = 0
  let totalPlays = tracks.length > 0 ? realTracks.reduce((a, b) => a + b.plays, 0) : 0
  let uniqueArtistsCount = artists.length
  let activeDaysCount = 0

  if (history) {
    totalHours = Math.round(history.totalMs / 3600000)
    totalPlays = history.totalPlays
    uniqueArtistsCount = history.uniqueArtists.size
    activeDaysCount = history.activeDays.size

    // Monthly
    monthly = Object.entries(history.byMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, ms]) => ({
        month: month.slice(0, 7),
        hours: Math.round(ms / 3600000),
        plays: 0,
      }))

    // Hourly
    hourly = Array.from({ length: 24 }, (_, h) => ({
      hour: `${h}h`,
      plays: history.byHour[h] ?? 0,
    }))

    // Weekly
    weekly = WEEKDAY_KEYS.map((day, i) => ({
      day,
      plays: history.byWeekday[i] ?? 0,
    }))

    // Merge history top tracks with Spotify data for play counts
    if (history.topTracks.length > 0 && realTracks.every((t) => t.plays === 0)) {
      history.topTracks.slice(0, 50).forEach((ht) => {
        const match = realTracks.find(
          (rt) => rt.name.toLowerCase() === ht.name.toLowerCase()
        )
        if (match) match.plays = ht.plays
      })
    }
  }

  // Genres from artist data
  const genreCount: Record<string, number> = {}
  artists.forEach((a) => a.genres?.forEach((g) => { genreCount[g] = (genreCount[g] ?? 0) + 1 }))
  const topGenres = Object.entries(genreCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
  const totalGenreCount = topGenres.reduce((s, [, c]) => s + c, 0)
  const genreColors = ['#1DB954', '#A78BFA', '#E91E63', '#06B6D4', '#F59E0B']
  const genres =
    topGenres.length > 0
      ? topGenres.map(([genre, count], i) => ({
          genre,
          percentage: Math.round((count / totalGenreCount) * 100),
          color: genreColors[i],
        }))
      : DEMO_GENRES

  return {
    isDemo: false,
    topTracks: realTracks,
    topArtists: realArtists,
    monthly: monthly.length > 0 ? monthly : DEMO_MONTHLY,
    hourly: hourly.some((h) => h.plays > 0) ? hourly : DEMO_HOURLY,
    weekly: weekly.some((w) => w.plays > 0) ? weekly : DEMO_WEEKLY,
    genres,
    totalHours: totalHours || DEMO_MONTHLY.reduce((a, b) => a + b.hours, 0),
    totalPlays,
    uniqueArtistsCount,
    activeDaysCount,
    currentlyPlaying,
    loading,
  }
}
