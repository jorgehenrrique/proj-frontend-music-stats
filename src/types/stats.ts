export interface MonthlyStats {
  month: string
  hours: number
  plays: number
}

export interface HourlyStats {
  hour: string
  plays: number
}

export interface WeeklyStats {
  day: string
  plays: number
}

export interface GenreStats {
  genre: string
  percentage: number
  color: string
}

export interface StreamingEntry {
  ts: string
  ms_played: number
  master_metadata_track_name: string | null
  master_metadata_album_artist_name: string | null
  master_metadata_album_album_name: string | null
  spotify_track_uri: string | null
  reason_start: string
  reason_end: string
  skipped: boolean | null
}

export interface ProcessedHistory {
  totalMs: number
  totalPlays: number
  uniqueArtists: Set<string>
  uniqueTracks: Set<string>
  activeDays: Set<string>
  byHour: Record<number, number>
  byWeekday: Record<number, number>
  byMonth: Record<string, number>
  topTracks: { name: string; artist: string; plays: number }[]
  topArtists: { name: string; plays: number }[]
}

export interface DashboardStats {
  hoursListened: number
  totalPlays: number
  uniqueArtists: number
  activeDays: number
  monthly: MonthlyStats[]
  hourly: HourlyStats[]
  weekly: WeeklyStats[]
  genres: GenreStats[]
}
