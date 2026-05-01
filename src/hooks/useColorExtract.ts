import { useState, useEffect } from 'react'
import { extractDominantColor } from '@/lib/colorExtract'

export function useColorExtract(imageUrl: string | null | undefined): string {
  const [color, setColor] = useState('#1DB954')

  useEffect(() => {
    if (!imageUrl) return
    extractDominantColor(imageUrl).then(setColor)
  }, [imageUrl])

  return color
}
