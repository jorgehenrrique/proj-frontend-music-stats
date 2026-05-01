export const DEMO_TRACKS = [
  { rank: 1, name: 'Blinding Lights', artist: 'The Weeknd', plays: 147, gradient: ['#E91E63', '#880E4F'] as [string, string] },
  { rank: 2, name: 'Save Your Tears', artist: 'The Weeknd', plays: 134, gradient: ['#9C27B0', '#4A148C'] as [string, string] },
  { rank: 3, name: 'Levitating', artist: 'Dua Lipa', plays: 119, gradient: ['#3F51B5', '#1A237E'] as [string, string] },
  { rank: 4, name: 'As It Was', artist: 'Harry Styles', plays: 98, gradient: ['#FF7043', '#BF360C'] as [string, string] },
  { rank: 5, name: 'good 4 u', artist: 'Olivia Rodrigo', plays: 87, gradient: ['#43A047', '#1B5E20'] as [string, string] },
  { rank: 6, name: 'Stay', artist: 'The Kid LAROI', plays: 76, gradient: ['#F59E0B', '#78350F'] as [string, string] },
  { rank: 7, name: 'Heat Waves', artist: 'Glass Animals', plays: 71, gradient: ['#06B6D4', '#164E63'] as [string, string] },
  { rank: 8, name: 'Industry Baby', artist: 'Lil Nas X', plays: 64, gradient: ['#EC4899', '#831843'] as [string, string] },
]

export const DEMO_ARTISTS = [
  { rank: 1, name: 'The Weeknd', plays: 423, tags: 'R&B · Synth-Pop', gradient: ['#E91E63', '#4A148C'] as [string, string], color: '#E91E63' },
  { rank: 2, name: 'Dua Lipa', plays: 287, tags: 'Pop · Dance', gradient: ['#06B6D4', '#0C4A6E'] as [string, string], color: '#06B6D4' },
  { rank: 3, name: 'Drake', plays: 198, tags: 'Hip-Hop · Rap', gradient: ['#F59E0B', '#78350F'] as [string, string], color: '#F59E0B' },
  { rank: 4, name: 'Harry Styles', plays: 165, tags: 'Pop · Indie Rock', gradient: ['#FF7043', '#7C2D12'] as [string, string], color: '#FF7043' },
  { rank: 5, name: 'Olivia Rodrigo', plays: 143, tags: 'Pop · Bedroom Pop', gradient: ['#8B5CF6', '#2E1065'] as [string, string], color: '#8B5CF6' },
]

export const DEMO_MONTHLY = [
  { month: 'Jan', hours: 62 }, { month: 'Fev', hours: 58 }, { month: 'Mar', hours: 71 },
  { month: 'Abr', hours: 84 }, { month: 'Mai', hours: 93 }, { month: 'Jun', hours: 78 },
  { month: 'Jul', hours: 101 }, { month: 'Ago', hours: 88 }, { month: 'Set', hours: 95 },
  { month: 'Out', hours: 110 }, { month: 'Nov', hours: 87 }, { month: 'Dez', hours: 120 },
]

export const DEMO_HOURLY = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}h`,
  plays: Math.round(
    i >= 22 || i <= 1
      ? 80 + Math.random() * 35
      : i >= 8 && i <= 10
        ? 65 + Math.random() * 25
        : i >= 17 && i <= 19
          ? 55 + Math.random() * 25
          : 8 + Math.random() * 22
  ),
}))

export const DEMO_WEEKLY = [
  { day: 'Seg', plays: 89 }, { day: 'Ter', plays: 134 }, { day: 'Qua', plays: 67 },
  { day: 'Qui', plays: 198 }, { day: 'Sex', plays: 245 }, { day: 'Sáb', plays: 312 },
  { day: 'Dom', plays: 178 },
]

export const DEMO_GENRES = [
  { genre: 'R&B / Soul', percentage: 32, color: '#E91E63' },
  { genre: 'Pop', percentage: 28, color: '#1DB954' },
  { genre: 'Hip-Hop', percentage: 18, color: '#A78BFA' },
  { genre: 'Eletrônico', percentage: 13, color: '#06B6D4' },
  { genre: 'Indie', percentage: 9, color: '#F59E0B' },
]
