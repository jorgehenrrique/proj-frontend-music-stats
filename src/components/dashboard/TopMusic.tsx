import { useState, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Calendar, X } from 'lucide-react'
import { ArtworkPlaceholder } from '@/components/ui/ArtworkPlaceholder'
import { useSpotifyData } from '@/hooks/useSpotifyData'

const RANGE_MAP = {
  '4s': 'short_term',
  '6m': 'medium_term',
  'todo': 'long_term',
} as const

type RangeKey = keyof typeof RANGE_MAP

interface TooltipData {
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

function ScrollingName({ name, style }: { name: string; style?: React.CSSProperties }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const [scrolling, setScrolling] = useState(false)
  const [offset, setOffset] = useState(0)
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

    const duration = overflow * 18 // ~18ms per pixel
    const animate = (now: number) => {
      if (!startTimeRef.current) startTimeRef.current = now
      const elapsed = now - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      setOffset(-overflow * progress)
      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate)
      }
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

function Tooltip({ data }: { data: TooltipData; onClose?: () => void }) {
  const dominantColor = data.gradient[0]

  // Ensure text is always readable: if bg is too light use dark text, otherwise white
  function textColor(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.55 ? '#0D0A1E' : '#EBE7FF'
  }

  const tc = textColor(dominantColor)

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
        boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)`,
        background: `linear-gradient(135deg, ${dominantColor}22 0%, #0D0A1E 60%)`,
        backdropFilter: 'blur(20px)',
        pointerEvents: 'none',
      }}
    >
      {/* Image strip */}
      {data.imageUrl ? (
        <img
          src={data.imageUrl}
          alt={data.name}
          style={{ width: '100%', height: 130, objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <div style={{ width: '100%', height: 100, background: `linear-gradient(135deg,${data.gradient[0]},${data.gradient[1]})` }} />
      )}

      {/* Info */}
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.3, marginBottom: 3, color: '#EBE7FF', wordBreak: 'break-word' }}>
          {data.name}
        </div>
        <div style={{ fontSize: 11.5, color: 'rgba(235,231,255,0.55)', marginBottom: data.plays > 0 || data.extra ? 10 : 0 }}>
          {data.subtitle}
        </div>
        {data.plays > 0 && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 20, background: `${dominantColor}33`, marginBottom: data.extra ? 6 : 0 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: dominantColor }}>{data.plays.toLocaleString()}</span>
            <span style={{ fontSize: 10.5, color: `${dominantColor}bb` }}>plays</span>
          </div>
        )}
        {data.extra && (
          <div style={{ fontSize: 10.5, color: 'rgba(235,231,255,0.38)', marginTop: 4 }}>{data.extra}</div>
        )}
        {data.spotifyUrl && (
          <div style={{ marginTop: 10, fontSize: 10.5, color: `${dominantColor}99`, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: dominantColor }}>●</span> Abrir no Spotify
          </div>
        )}
      </div>
      <div style={{ position: 'absolute', top: 6, right: 6, width: 18, height: 18, borderRadius: '50%', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <X size={10} color={tc} />
      </div>
    </div>
  )
}

function CustomRangePicker({
  onSelect,
  onClose,
}: {
  onSelect: (label: string, days: number) => void
  onClose: () => void
}) {
  const [unit, setUnit] = useState<'days' | 'weeks' | 'months'>('months')
  const [value, setValue] = useState(6)

  const unitRanges: Record<typeof unit, { min: number; max: number; step: number }> = {
    days: { min: 1, max: 30, step: 1 },
    weeks: { min: 1, max: 52, step: 1 },
    months: { min: 1, max: 24, step: 1 },
  }

  const toDays = () => {
    if (unit === 'days') return value
    if (unit === 'weeks') return value * 7
    return value * 30
  }

  const label = `${value} ${unit === 'days' ? (value === 1 ? 'dia' : 'dias') : unit === 'weeks' ? (value === 1 ? 'semana' : 'semanas') : (value === 1 ? 'mês' : 'meses')}`

  return (
    <div
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        marginTop: 6,
        zIndex: 200,
        background: 'rgba(13,10,30,0.97)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 14,
        padding: '14px 16px',
        width: 240,
        backdropFilter: 'blur(20px)',
        boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
      }}
    >
      <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
        {(['days', 'weeks', 'months'] as const).map((u) => (
          <button
            key={u}
            className={`rtab ${unit === u ? 'on' : ''}`}
            style={{ fontSize: 11, flex: 1, textAlign: 'center' }}
            onClick={() => { setUnit(u); setValue(unitRanges[u].min) }}
          >
            {u === 'days' ? 'Dias' : u === 'weeks' ? 'Semanas' : 'Meses'}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: 'rgba(235,231,255,0.4)', marginBottom: 6 }}>
          Período: <span style={{ color: '#1DB954', fontWeight: 600 }}>{label}</span>
        </div>
        <input
          type="range"
          min={unitRanges[unit].min}
          max={unitRanges[unit].max}
          step={unitRanges[unit].step}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#1DB954' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(235,231,255,0.3)', marginTop: 2 }}>
          <span>{unitRanges[unit].min}</span>
          <span>{unitRanges[unit].max}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        <button
          className="btn-g"
          style={{ flex: 1, justifyContent: 'center', fontSize: 12, padding: '7px 0' }}
          onClick={() => { onSelect(label, toDays()); onClose() }}
        >
          Aplicar
        </button>
        <button
          className="btn-o"
          style={{ padding: '7px 12px', fontSize: 12 }}
          onClick={onClose}
        >
          <X size={12} />
        </button>
      </div>
    </div>
  )
}

export function TopMusic() {
  const { t } = useTranslation()
  const [range, setRange] = useState<RangeKey>('6m')
  const [customLabel, setCustomLabel] = useState<string | null>(null)
  const [showPicker, setShowPicker] = useState(false)
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)
  const pickerRef = useRef<HTMLDivElement>(null)

  // Custom range always maps to the nearest Spotify range
  const spotifyRange = RANGE_MAP[range]
  const { topTracks, topArtists, loading } = useSpotifyData(spotifyRange)

  function handleRangeSelect(key: RangeKey) {
    setRange(key)
    setCustomLabel(null)
  }

  function handleCustomApply(label: string, _days: number) {
    setCustomLabel(label)
    // Map days to nearest Spotify range
    const days = _days
    if (days <= 35) setRange('4s')
    else if (days <= 180) setRange('6m')
    else setRange('todo')
  }

  function openTooltip(e: React.MouseEvent, data: TooltipData) {
    setTooltip({ ...data, x: e.clientX, y: e.clientY })
  }

  function openSpotify(url: string | null) {
    if (url) window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Range tabs */}
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center', position: 'relative' }} ref={pickerRef}>
        {([
          { k: '4s' as RangeKey, l: t('dashboard.period_4w') },
          { k: '6m' as RangeKey, l: t('dashboard.period_6m') },
          { k: 'todo' as RangeKey, l: t('dashboard.period_all') },
        ]).map((r) => (
          <button
            key={r.k}
            className={`rtab ${range === r.k && !customLabel ? 'on' : ''}`}
            style={{ fontSize: 13 }}
            onClick={() => handleRangeSelect(r.k)}
          >
            {r.l}
          </button>
        ))}

        {/* Custom range button */}
        <button
          className={`rtab ${customLabel ? 'on' : ''}`}
          style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}
          onClick={() => setShowPicker((v) => !v)}
        >
          <Calendar size={12} />
          {customLabel ?? t('dashboard.period_custom')}
        </button>

        {showPicker && (
          <CustomRangePicker
            onSelect={handleCustomApply}
            onClose={() => setShowPicker(false)}
          />
        )}
      </div>

      <div className="grid-2-alt">
        {/* Top Tracks */}
        <div className="glass" style={{ padding: 20 }}>
          <div className="syne" style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>
            {t('dashboard.top_tracks')}
          </div>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="trow" style={{ opacity: 0.3 }}>
                  <div style={{ width: 22, height: 12, background: 'rgba(255,255,255,0.1)', borderRadius: 4 }} />
                  <div style={{ width: 40, height: 40, borderRadius: 9, background: 'rgba(255,255,255,0.08)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 12, background: 'rgba(255,255,255,0.08)', borderRadius: 4 }} />
                  </div>
                </div>
              ))
            : topTracks.map((tr) => {
                const hasUrl = 'spotifyUrl' in tr && !!tr.spotifyUrl
                return (
                  <div
                    key={tr.rank}
                    className="trow"
                    style={{ cursor: hasUrl ? 'pointer' : 'default' }}
                    onClick={() => openSpotify('spotifyUrl' in tr ? tr.spotifyUrl as string | null : null)}
                    onMouseEnter={(e) =>
                      openTooltip(e, {
                        x: e.clientX,
                        y: e.clientY,
                        name: tr.name,
                        subtitle: tr.artist,
                        imageUrl: 'imageUrl' in tr ? tr.imageUrl as string | null : null,
                        gradient: tr.gradient,
                        plays: tr.plays,
                        extra: 'albumName' in tr && tr.albumName ? `Álbum: ${tr.albumName as string}` : undefined,
                        spotifyUrl: 'spotifyUrl' in tr ? tr.spotifyUrl as string | null : null,
                      })
                    }
                    onMouseLeave={() => setTooltip(null)}
                    onMouseMove={(e) => setTooltip((prev) => prev ? { ...prev, x: e.clientX, y: e.clientY } : prev)}
                  >
                    <span style={{ width: 22, textAlign: 'center', fontSize: 12, color: 'rgba(235,231,255,0.22)', fontWeight: 700, flexShrink: 0 }}>
                      {tr.rank}
                    </span>
                    <ArtworkPlaceholder
                      gradient={tr.gradient}
                      size={40}
                      radius={9}
                      imageUrl={'imageUrl' in tr ? tr.imageUrl as string | null : null}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <ScrollingName name={tr.name} style={{ fontSize: 13, fontWeight: 500 }} />
                      <div style={{ fontSize: 11, color: 'rgba(235,231,255,0.38)' }}>{tr.artist}</div>
                    </div>
                    {tr.plays > 0 && (
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: tr.gradient[0] }}>{tr.plays.toLocaleString()}×</div>
                      </div>
                    )}
                  </div>
                )
              })}
        </div>

        {/* Top Artists */}
        <div className="glass" style={{ padding: 20 }}>
          <div className="syne" style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>
            {t('dashboard.top_artists')}
          </div>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="trow" style={{ opacity: 0.3 }}>
                  <div style={{ width: 16, height: 12, background: 'rgba(255,255,255,0.1)', borderRadius: 4 }} />
                  <div style={{ width: 42, height: 42, borderRadius: 21, background: 'rgba(255,255,255,0.08)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 12, background: 'rgba(255,255,255,0.08)', borderRadius: 4 }} />
                  </div>
                </div>
              ))
            : topArtists.map((a) => {
                const hasUrl = 'spotifyUrl' in a && !!a.spotifyUrl
                return (
                  <div
                    key={a.rank}
                    className="trow"
                    style={{ cursor: hasUrl ? 'pointer' : 'default' }}
                    onClick={() => openSpotify('spotifyUrl' in a ? a.spotifyUrl as string | null : null)}
                    onMouseEnter={(e) =>
                      openTooltip(e, {
                        x: e.clientX,
                        y: e.clientY,
                        name: a.name,
                        subtitle: a.tags,
                        imageUrl: 'imageUrl' in a ? a.imageUrl as string | null : null,
                        gradient: a.gradient,
                        plays: a.plays,
                        extra: 'followers' in a && (a.followers as number) > 0
                          ? `${(a.followers as number).toLocaleString()} seguidores`
                          : undefined,
                        spotifyUrl: 'spotifyUrl' in a ? a.spotifyUrl as string | null : null,
                      })
                    }
                    onMouseLeave={() => setTooltip(null)}
                    onMouseMove={(e) => setTooltip((prev) => prev ? { ...prev, x: e.clientX, y: e.clientY } : prev)}
                  >
                    <span style={{ width: 16, fontSize: 11.5, color: 'rgba(235,231,255,0.22)', fontWeight: 700, flexShrink: 0 }}>
                      {a.rank}
                    </span>
                    <ArtworkPlaceholder
                      gradient={a.gradient}
                      size={42}
                      radius={21}
                      imageUrl={'imageUrl' in a ? a.imageUrl as string | null : null}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <ScrollingName name={a.name} style={{ fontSize: 13, fontWeight: 500 }} />
                      <div style={{ fontSize: 10.5, color: 'rgba(235,231,255,0.36)' }}>{a.tags}</div>
                    </div>
                    {a.plays > 0 && (
                      <div style={{ fontSize: 13, fontWeight: 600, color: a.color, flexShrink: 0 }}>
                        {a.plays.toLocaleString()}
                      </div>
                    )}
                  </div>
                )
              })}
        </div>
      </div>

      {/* Floating tooltip */}
      {tooltip && <Tooltip data={tooltip} onClose={() => setTooltip(null)} />}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
