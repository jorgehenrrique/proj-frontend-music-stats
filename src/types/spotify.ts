export interface SpotifyUser {
  id: string
  display_name: string
  email: string
  images: { url: string; height: number; width: number }[]
  followers: { total: number }
  country: string
}

export interface SpotifyTrack {
  id: string
  name: string
  artists: { id: string; name: string }[]
  album: {
    id: string
    name: string
    images: { url: string; height: number; width: number }[]
  }
  duration_ms: number
  popularity: number
  external_urls: { spotify: string }
}

export interface SpotifyArtist {
  id: string
  name: string
  genres: string[]
  images: { url: string; height: number; width: number }[]
  popularity: number
  followers: { total: number }
  external_urls: { spotify: string }
}

export interface SpotifyRecentlyPlayed {
  track: SpotifyTrack
  played_at: string
  context: { type: string; uri: string } | null
}

export type SpotifyTimeRange = 'short_term' | 'medium_term' | 'long_term'

export interface SpotifyTopTracksResponse {
  items: SpotifyTrack[]
  total: number
  limit: number
  offset: number
}

export interface SpotifyTopArtistsResponse {
  items: SpotifyArtist[]
  total: number
  limit: number
  offset: number
}

export interface SpotifyRecentlyPlayedResponse {
  items: SpotifyRecentlyPlayed[]
  cursors: { after: string; before: string }
  limit: number
  next: string | null
}

export interface SpotifyCurrentlyPlaying {
  is_playing: boolean
  item: SpotifyTrack | null
  progress_ms: number
  timestamp: number
}
