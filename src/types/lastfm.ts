export interface LastfmUser {
  name: string
  realname: string
  url: string
  image: { '#text': string; size: string }[]
  playcount: string
  registered: { '#text': string; unixtime: string }
  country: string
}

export interface LastfmTrack {
  name: string
  artist: { name: string; mbid: string; url: string }
  album: { '#text': string; mbid: string }
  url: string
  image: { '#text': string; size: string }[]
  playcount?: string
  '@attr'?: { rank: string }
  date?: { uts: string; '#text': string }
}

export interface LastfmArtist {
  name: string
  playcount: string
  url: string
  image: { '#text': string; size: string }[]
  '@attr'?: { rank: string }
}

export interface LastfmTag {
  name: string
  count: number
  url: string
}

export type LastfmPeriod = 'overall' | '7day' | '1month' | '3month' | '6month' | '12month'
