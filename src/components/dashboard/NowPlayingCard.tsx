import { useEffect, useRef, useState } from 'react'
import { ArtworkPlaceholder } from '@/components/ui/ArtworkPlaceholder'
import { ScrollingName, TrackTooltip, type TooltipData } from './TrackRow'
import type { SpotifyCurrentlyPlaying } from '@/types/spotify'

interface Props {
  currentlyPlaying: SpotifyCurrentlyPlaying
  onOpenSpotify?: (url: string) => void
}

function formatMs(ms: number): string {
  const s = Math.floor(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

function extractDominantColor(imgEl: HTMLImageElement): string {
  try {
    const canvas = document.createElement('canvas')
    canvas.width = 8
    canvas.height = 8
    const ctx = canvas.getContext('2d')
    if (!ctx) return '#1DB954'
    ctx.drawImage(imgEl, 0, 0, 8, 8)
    const data = ctx.getImageData(0, 0, 8, 8).data
    let r = 0, g = 0, b = 0, count = 0
    for (let i = 0; i < data.length; i += 4) {
      // skip very dark or very bright pixels
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3
      if (brightness < 20 || brightness > 235) continue
      r += data[i]; g += data[i + 1]; b += data[i + 2]; count++
    }
    if (!count) return '#1DB954'
    r = Math.round(r / count)
    g = Math.round(g / count)
    b = Math.round(b / count)
    // boost saturation
    const max = Math.max(r, g, b)
    const factor = max > 0 ? Math.min(255 / max, 1.6) : 1
    r = Math.min(255, Math.round(r * factor))
    g = Math.min(255, Math.round(g * factor))
    b = Math.min(255, Math.round(b * factor))
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  } catch {
    return '#1DB954'
  }
}

export function NowPlayingCard({ currentlyPlaying, onOpenSpotify }: Props) {
  const { item: track, progress_ms, is_playing } = currentlyPlaying
  if (!track) return null

  const duration = track.duration_ms
  const progress = progress_ms ?? 0
  const ratio = duration > 0 ? Math.min(progress / duration, 1) : 0

  const imageUrl = track.album?.images?.[0]?.url ?? null
  const spotifyUrl = track.external_urls?.spotify ?? null
  const albumName = track.album?.name ?? null
  const artistName = track.artists?.[0]?.name ?? ''

  const [dominantColor, setDominantColor] = useState('#1DB954')
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  // Live progress — tick every second while playing
  const [liveProgress, setLiveProgress] = useState(progress)
  useEffect(() => {
    setLiveProgress(progress)
    if (!is_playing) return
    const interval = setInterval(() => {
      setLiveProgress((p) => Math.min(p + 1000, duration))
    }, 1000)
    return () => clearInterval(interval)
  }, [progress, is_playing, duration])

  const liveRatio = duration > 0 ? Math.min(liveProgress / duration, 1) : ratio

  function handleImgLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    imgRef.current = e.currentTarget
    setDominantColor(extractDominantColor(e.currentTarget))
  }

  // Readable text: ensure contrast against dominantColor
  const colorHex = dominantColor.replace('#', '')
  const rr = parseInt(colorHex.slice(0, 2), 16)
  const gg = parseInt(colorHex.slice(2, 4), 16)
  const bb = parseInt(colorHex.slice(4, 6), 16)
  const bgOverlay = `rgba(${rr},${gg},${bb},0.13)`
  const progressColor = dominantColor
  const dim = 'rgba(235,231,255,0.38)'

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 14,
        overflow: 'hidden',
        cursor: spotifyUrl ? 'pointer' : 'default',
        background: `linear-gradient(90deg, ${bgOverlay} 0%, rgba(255,255,255,0.04) 100%)`,
        border: `1px solid ${dominantColor}28`,
      }}
      onClick={() => spotifyUrl && onOpenSpotify?.(spotifyUrl)}
      onMouseEnter={(e) =>
        setTooltip({
          x: e.clientX, y: e.clientY,
          name: track.name,
          subtitle: artistName,
          imageUrl,
          gradient: [dominantColor, '#0D0A1E'],
          plays: 0,
          extra: albumName ? `Álbum: ${albumName}` : undefined,
          spotifyUrl,
        })
      }
      onMouseLeave={() => setTooltip(null)}
      onMouseMove={(e) => setTooltip((prev) => prev ? { ...prev, x: e.clientX, y: e.clientY } : prev)}
    >
      {/* Progress fill — gradient from left (transparent) to right (color) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(90deg, transparent 0%, ${progressColor}1A ${Math.max(0, liveRatio * 100 - 15)}%, ${progressColor}38 ${liveRatio * 100}%)`,
          width: `${liveRatio * 100}%`,
          transition: is_playing ? 'width 1s linear' : 'none',
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 11 }}>
        {/* Animated bars or pause icon */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2.5, height: 18, flexShrink: 0 }}>
          {is_playing
            ? ['w1', 'w2', 'w3'].map((w) => (
                <div key={w} className={w} style={{ width: 3, height: 14, background: progressColor, borderRadius: 2, transformOrigin: 'bottom' }} />
              ))
            : <div style={{ fontSize: 10, color: dim, fontWeight: 600, letterSpacing: 0.5 }}>II</div>
          }
        </div>

        {/* Artwork with hidden img for color extraction */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          {imageUrl && (
            <img
              src={imageUrl}
              alt=""
              onLoad={handleImgLoad}
              crossOrigin="anonymous"
              style={{ position: 'absolute', opacity: 0, width: 1, height: 1, pointerEvents: 'none' }}
            />
          )}
          <ArtworkPlaceholder gradient={[dominantColor, '#0D0A1E']} size={40} radius={9} imageUrl={imageUrl} />
        </div>

        {/* Track info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <ScrollingName name={track.name} style={{ fontSize: 12.5, fontWeight: 600 }} />
          <div style={{ fontSize: 11, color: dim, marginTop: 1 }}>{artistName}</div>
        </div>

        {/* Right side: status + time */}
        <div style={{ flexShrink: 0, textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
          <span
            className="chip"
            style={{
              background: is_playing ? `${progressColor}22` : 'rgba(255,255,255,0.06)',
              color: is_playing ? progressColor : dim,
              fontSize: 9.5,
              padding: '2px 7px',
            }}
          >
            {is_playing ? '● ao vivo' : '⏸ pausado'}
          </span>
          {duration > 0 && (
            <div style={{ fontSize: 10, color: dim, fontVariantNumeric: 'tabular-nums' }}>
              {formatMs(liveProgress)} / {formatMs(duration)}
            </div>
          )}
        </div>
      </div>

      {/* Progress bar line at bottom */}
      <div style={{ position: 'relative', height: 2, background: 'rgba(255,255,255,0.06)' }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${liveRatio * 100}%`,
            background: `linear-gradient(90deg, ${progressColor}66, ${progressColor})`,
            transition: is_playing ? 'width 1s linear' : 'none',
            borderRadius: 1,
          }}
        />
      </div>

      {tooltip && <TrackTooltip data={tooltip} />}
    </div>
  )
}
