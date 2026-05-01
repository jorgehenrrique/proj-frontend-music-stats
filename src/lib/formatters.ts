export function formatMs(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

export function formatHours(ms: number): string {
  return `${Math.round(ms / 3600000)}h`
}

export function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n.toString()
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function getGradientForIndex(index: number): [string, string] {
  const palettes: [string, string][] = [
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
  return palettes[index % palettes.length]
}

export function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')
}
