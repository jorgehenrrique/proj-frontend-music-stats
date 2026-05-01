import { Music2 } from 'lucide-react'

interface Props {
  gradient: [string, string]
  size?: number
  radius?: number
  imageUrl?: string | null
}

export function ArtworkPlaceholder({ gradient, size = 40, radius = 10, imageUrl }: Props) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt=""
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          flexShrink: 0,
          objectFit: 'cover',
        }}
      />
    )
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        flexShrink: 0,
        background: `linear-gradient(135deg,${gradient[0]},${gradient[1]})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Music2 size={size * 0.38} color="rgba(255,255,255,0.55)" />
    </div>
  )
}
