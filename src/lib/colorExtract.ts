import { getColorSync, getPaletteSync, type Color } from 'colorthief'

const cache = new Map<string, string>()

function colorToHex(color: Color): string {
  const rgb = color.rgb()
  return '#' + [rgb.r, rgb.g, rgb.b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')
}

export async function extractDominantColor(imageUrl: string): Promise<string> {
  if (cache.has(imageUrl)) return cache.get(imageUrl)!

  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = () => {
      try {
        const color = getColorSync(img)
        if (!color) { resolve('#1DB954'); return }
        const hex = colorToHex(color)
        cache.set(imageUrl, hex)
        resolve(hex)
      } catch {
        resolve('#1DB954')
      }
    }
    img.onerror = () => resolve('#1DB954')
    img.src = imageUrl
  })
}

export async function extractPalette(imageUrl: string, count = 5): Promise<string[]> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = () => {
      try {
        const palette = getPaletteSync(img, { colorCount: count })
        if (!palette) { resolve(['#1DB954', '#6D28D9', '#DB2777', '#F59E0B', '#06B6D4']); return }
        resolve(palette.map(colorToHex))
      } catch {
        resolve(['#1DB954', '#6D28D9', '#DB2777', '#F59E0B', '#06B6D4'])
      }
    }
    img.onerror = () => resolve(['#1DB954', '#6D28D9', '#DB2777', '#F59E0B', '#06B6D4'])
    img.src = imageUrl
  })
}
