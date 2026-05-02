import { useState, useRef, useCallback } from 'react'
import { X } from 'lucide-react'

export interface TooltipData {
  x: number
  y: number
  name: string
  subtitle: string
  imageUrl: string | null
  gradient: [string, string]
  plays: number
  extra?: string
  spotifyUrl: string | null
}

export function ScrollingName({ name, style }: { name: string; style?: React.CSSProperties }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)
  const [scrolling, setScrolling] = useState(false)
  const animRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  const startScroll = useCallback(() => {
    const container = containerRef.current
    const text = textRef.current
    if (!container || !text) return
    const overflow = text.scrollWidth - container.clientWidth
    if (overflow <= 0) return
    setScrolling(true)
    startTimeRef.current = null
    const duration = overflow * 18
    const animate = (now: number) => {
      if (!startTimeRef.current) startTimeRef.current = now
      const elapsed = now - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      setOffset(-overflow * progress)
      if (progress < 1) animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
  }, [])

  const stopScroll = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    setScrolling(false)
    setOffset(0)
  }, [])

  return (
    <div
      ref={containerRef}
      onMouseEnter={startScroll}
      onMouseLeave={stopScroll}
      style={{ overflow: 'hidden', cursor: 'default', ...style }}
    >
      <div
        ref={textRef}
        style={{
          whiteSpace: 'nowrap',
          transform: `translateX(${offset}px)`,
          transition: scrolling ? 'none' : 'transform 0.3s ease',
          display: 'inline-block',
        }}
      >
        {name}
      </div>
    </div>
  )
}

function readableTextColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.55 ? '#0D0A1E' : '#EBE7FF'
}

export function TrackTooltip({ data }: { data: TooltipData }) {
  const color = data.gradient[0]
  const tc = readableTextColor(color)

  return (
    <div
      style={{
        position: 'fixed',
        top: Math.min(data.y - 10, window.innerHeight - 280),
        left: Math.min(data.x + 12, window.innerWidth - 260),
        zIndex: 9999,
        width: 240,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)',
        background: `linear-gradient(135deg, ${color}22 0%, #0D0A1E 60%)`,
        backdropFilter: 'blur(20px)',
        pointerEvents: 'none',
      }}
    >
      {data.imageUrl ? (
        <img src={data.imageUrl} alt={data.name} style={{ width: '100%', height: 130, objectFit: 'cover', display: 'block' }} />
      ) : (
        <div style={{ width: '100%', height: 100, background: `linear-gradient(135deg,${data.gradient[0]},${data.gradient[1]})` }} />
      )}
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.3, marginBottom: 3, color: '#EBE7FF', wordBreak: 'break-word' }}>
          {data.name}
        </div>
        <div style={{ fontSize: 11.5, color: 'rgba(235,231,255,0.55)', marginBottom: data.plays > 0 || data.extra ? 10 : 0 }}>
          {data.subtitle}
        </div>
        {data.plays > 0 && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 20, background: `${color}33`, marginBottom: data.extra ? 6 : 0 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color }}>{data.plays.toLocaleString()}</span>
            <span style={{ fontSize: 10.5, color: `${color}bb` }}>plays</span>
          </div>
        )}
        {data.extra && (
          <div style={{ fontSize: 10.5, color: 'rgba(235,231,255,0.38)', marginTop: 4 }}>{data.extra}</div>
        )}
        {data.spotifyUrl && (
          <div style={{ marginTop: 10, fontSize: 10.5, color: `${color}99`, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color }}>●</span> Abrir no Spotify
          </div>
        )}
      </div>
      <div style={{ position: 'absolute', top: 6, right: 6, width: 18, height: 18, borderRadius: '50%', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <X size={10} color={tc} />
      </div>
    </div>
  )
}
