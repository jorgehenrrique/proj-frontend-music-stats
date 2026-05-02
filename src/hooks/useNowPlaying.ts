import { useEffect, useRef, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { spotifyApi } from '@/api/spotify'
import type { SpotifyCurrentlyPlaying } from '@/types/spotify'

const POLL_INTERVAL_MS = 30_000 // 30s — well within Spotify rate limits

export function useNowPlaying(): SpotifyCurrentlyPlaying | null {
  const spotify = useAuthStore((s) => s.spotify)
  const isAuthenticated = !!spotify
  const [nowPlaying, setNowPlaying] = useState<SpotifyCurrentlyPlaying | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  async function fetchNow() {
    try {
      const result = await spotifyApi.getCurrentlyPlaying()
      setNowPlaying(result)
    } catch {
      // silently ignore — network or 204 No Content
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      setNowPlaying(null)
      return
    }

    fetchNow()

    function schedule() {
      timerRef.current = setTimeout(async () => {
        await fetchNow()
        schedule()
      }, POLL_INTERVAL_MS)
    }

    schedule()

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isAuthenticated])

  return nowPlaying
}
