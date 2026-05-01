import { useQuery } from '@tanstack/react-query'
import { spotifyApi } from '@/api/spotify'
import { useAuthStore } from '@/store/authStore'
import type { SpotifyTimeRange } from '@/types/spotify'

export function useSpotifyMe() {
  const isValid = useAuthStore((s) => s.isSpotifyValid())
  return useQuery({
    queryKey: ['spotify', 'me'],
    queryFn: () => spotifyApi.getMe(),
    enabled: isValid,
    staleTime: 1000 * 60 * 5,
  })
}

export function useTopTracks(timeRange: SpotifyTimeRange = 'medium_term') {
  const isValid = useAuthStore((s) => s.isSpotifyValid())
  return useQuery({
    queryKey: ['spotify', 'top-tracks', timeRange],
    queryFn: () => spotifyApi.getTopTracks(timeRange),
    enabled: isValid,
    staleTime: 1000 * 60 * 10,
  })
}

export function useTopArtists(timeRange: SpotifyTimeRange = 'medium_term') {
  const isValid = useAuthStore((s) => s.isSpotifyValid())
  return useQuery({
    queryKey: ['spotify', 'top-artists', timeRange],
    queryFn: () => spotifyApi.getTopArtists(timeRange),
    enabled: isValid,
    staleTime: 1000 * 60 * 10,
  })
}

export function useRecentlyPlayed() {
  const isValid = useAuthStore((s) => s.isSpotifyValid())
  return useQuery({
    queryKey: ['spotify', 'recently-played'],
    queryFn: () => spotifyApi.getRecentlyPlayed(),
    enabled: isValid,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 30,
  })
}

export function useCurrentlyPlaying() {
  const isValid = useAuthStore((s) => s.isSpotifyValid())
  return useQuery({
    queryKey: ['spotify', 'currently-playing'],
    queryFn: () => spotifyApi.getCurrentlyPlaying(),
    enabled: isValid,
    staleTime: 1000 * 15,
    refetchInterval: 1000 * 15,
  })
}
