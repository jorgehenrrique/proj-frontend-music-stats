export const SPOTIFY_SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-top-read',
  'user-read-recently-played',
  'user-read-currently-playing',
  'user-read-playback-state',
].join(' ')

export const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize'
export const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'
export const SPOTIFY_API_BASE = 'https://api.spotify.com/v1'
export const LASTFM_API_BASE = 'https://ws.audioscrobbler.com/2.0'

export const GENRE_COLORS: Record<string, string> = {
  'R&B': '#E91E63',
  Soul: '#E91E63',
  Pop: '#1DB954',
  'Hip-Hop': '#A78BFA',
  Rap: '#A78BFA',
  Electronic: '#06B6D4',
  Dance: '#06B6D4',
  Indie: '#F59E0B',
  Rock: '#FF7043',
  Jazz: '#FCD34D',
  Classical: '#93C5FD',
  Metal: '#EF4444',
  Folk: '#86EFAC',
  Country: '#FDE68A',
  Alternative: '#C4B5FD',
}

export const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
export const MONTHS = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
]

export const GRADIENT_PALETTES = [
  ['#E91E63', '#880E4F'],
  ['#9C27B0', '#4A148C'],
  ['#3F51B5', '#1A237E'],
  ['#FF7043', '#BF360C'],
  ['#43A047', '#1B5E20'],
  ['#F59E0B', '#78350F'],
  ['#06B6D4', '#164E63'],
  ['#EC4899', '#831843'],
  ['#8B5CF6', '#2E1065'],
  ['#059669', '#064E3B'],
]
