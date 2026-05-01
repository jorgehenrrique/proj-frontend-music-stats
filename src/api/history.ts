import type { ProcessedHistory, StreamingEntry } from '@/types/stats'

export function parseSpotifyHistory(files: File[]): Promise<ProcessedHistory> {
  return new Promise((resolve, reject) => {
    const readers = files.map(
      (file) =>
        new Promise<StreamingEntry[]>((res, rej) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            try {
              const data = JSON.parse(e.target?.result as string) as StreamingEntry[]
              res(Array.isArray(data) ? data : [])
            } catch {
              rej(new Error(`Failed to parse ${file.name}`))
            }
          }
          reader.onerror = () => rej(new Error(`Failed to read ${file.name}`))
          reader.readAsText(file)
        })
    )

    Promise.all(readers)
      .then((results) => {
        const entries = results.flat()
        resolve(processEntries(entries))
      })
      .catch(reject)
  })
}

function processEntries(entries: StreamingEntry[]): ProcessedHistory {
  const result: ProcessedHistory = {
    totalMs: 0,
    totalPlays: 0,
    uniqueArtists: new Set(),
    uniqueTracks: new Set(),
    activeDays: new Set(),
    byHour: {},
    byWeekday: {},
    byMonth: {},
    topTracks: [],
    topArtists: [],
  }

  const trackCounts: Record<string, { name: string; artist: string; plays: number }> = {}
  const artistCounts: Record<string, number> = {}

  for (const entry of entries) {
    if (!entry.master_metadata_track_name || entry.ms_played < 30000) continue

    result.totalMs += entry.ms_played
    result.totalPlays++

    const date = new Date(entry.ts)
    const artist = entry.master_metadata_album_artist_name ?? 'Unknown'
    const track = entry.master_metadata_track_name

    result.uniqueArtists.add(artist)
    result.uniqueTracks.add(`${artist}::${track}`)
    result.activeDays.add(date.toISOString().slice(0, 10))

    const hour = date.getHours()
    result.byHour[hour] = (result.byHour[hour] ?? 0) + 1

    const weekday = date.getDay()
    result.byWeekday[weekday] = (result.byWeekday[weekday] ?? 0) + 1

    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    result.byMonth[month] = (result.byMonth[month] ?? 0) + entry.ms_played

    const trackKey = `${artist}::${track}`
    if (!trackCounts[trackKey]) trackCounts[trackKey] = { name: track, artist, plays: 0 }
    trackCounts[trackKey].plays++

    artistCounts[artist] = (artistCounts[artist] ?? 0) + 1
  }

  result.topTracks = Object.values(trackCounts)
    .sort((a, b) => b.plays - a.plays)
    .slice(0, 50)

  result.topArtists = Object.entries(artistCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 50)
    .map(([name, plays]) => ({ name, plays }))

  return result
}
