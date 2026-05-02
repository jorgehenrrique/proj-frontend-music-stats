import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArtworkPlaceholder } from '@/components/ui/ArtworkPlaceholder'
import { MonthlyChart } from '@/components/charts/MonthlyChart'
import { GenreBar } from '@/components/charts/GenreBar'
import { useSpotifyData } from '@/hooks/useSpotifyData'
import { useNowPlaying } from '@/hooks/useNowPlaying'
import { ScrollingName, TrackTooltip, type TooltipData } from './TrackRow'
import { NowPlayingCard } from './NowPlayingCard'

const RANGE_MAP = {
  '4s': 'short_term',
  '6m': 'medium_term',
  '∞': 'long_term',
} as const

export function Overview() {
  const { t } = useTranslation()
  const [range, setRange] = useState<'4s' | '6m' | '∞'>('6m')
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)

  const {
    isDemo,
    topTracks,
    topArtists,
    monthly,
    genres,
    totalHours,
    totalPlays,
    uniqueArtistsCount,
    activeDaysCount,
    loading,
  } = useSpotifyData(RANGE_MAP[range])

  const currentlyPlaying = useNowPlaying()

  const topArtist = topArtists[0]

  function openTooltip(e: React.MouseEvent, data: TooltipData) {
    setTooltip({ ...data, x: e.clientX, y: e.clientY })
  }

  function openSpotify(url: string | null | undefined) {
    if (url) window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Demo badge */}
      {isDemo && (
        <div className="glass2" style={{ padding: '10px 16px', fontSize: 12, color: 'rgba(235,231,255,0.5)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#F59E0B' }}>●</span>
          {t('dashboard.demo_notice')}
        </div>
      )}

      {/* Top artist hero */}
      {topArtist && (
        <div
          className="glass fu"
          style={{
            padding: 'clamp(14px,3vw,26px)',
            position: 'relative',
            overflow: 'hidden',
            background: `linear-gradient(135deg,rgba(233,30,99,0.11),rgba(7,7,26,0.55))`,
            border: '1px solid rgba(233,30,99,0.18)',
            cursor: 'spotifyUrl' in topArtist && topArtist.spotifyUrl ? 'pointer' : 'default',
          }}
          onClick={() => openSpotify('spotifyUrl' in topArtist ? topArtist.spotifyUrl as string | null : null)}
        >
          <div style={{ position: 'absolute', top: -50, right: -50, width: 220, height: 220, borderRadius: '50%', background: 'rgba(233,30,99,0.13)', filter: 'blur(55px)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px,2vw,16px)', position: 'relative', zIndex: 1, flexWrap: 'wrap' }}>
            <ArtworkPlaceholder gradient={topArtist.gradient} size={68} radius={16} imageUrl={'imageUrl' in topArtist ? topArtist.imageUrl as string | null : null} />
            <div style={{ flex: 1, minWidth: 140 }}>
              <div style={{ fontSize: 10.5, color: 'rgba(235,231,255,0.4)', fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 3 }}>
                {t('dashboard.top_artist_label', { year: new Date().getFullYear() })}
              </div>
              <div className="syne" style={{ fontSize: 'clamp(20px,3.5vw,28px)', fontWeight: 800, lineHeight: 1 }}>
                {topArtist.name}
              </div>
              <div style={{ fontSize: 12.5, color: 'rgba(235,231,255,0.45)', marginTop: 4 }}>
                {topArtist.tags}
              </div>
            </div>
            {topArtist.plays > 0 && (
              <div style={{ textAlign: 'right' }}>
                <div className="syne" style={{ fontSize: 'clamp(26px,4vw,36px)', fontWeight: 800, color: topArtist.color, lineHeight: 1 }}>
                  {topArtist.plays}
                </div>
                <div style={{ fontSize: 10.5, color: 'rgba(235,231,255,0.38)', marginTop: 2 }}>
                  {t('dashboard.total_plays')}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stat pills */}
      <div className="grid-4 fu d1">
        {[
          { label: t('dashboard.hours_listened'), value: `${totalHours}h`, color: '#1DB954' },
          { label: t('dashboard.scrobbles'), value: totalPlays > 0 ? totalPlays.toLocaleString() : '—', color: '#A78BFA' },
          { label: t('dashboard.unique_artists'), value: uniqueArtistsCount > 0 ? String(uniqueArtistsCount) : '—', color: '#06B6D4' },
          { label: t('dashboard.active_days'), value: activeDaysCount > 0 ? String(activeDaysCount) : '—', color: '#F59E0B' },
        ].map((s) => (
          <div key={s.label} className="glass2" style={{ padding: '14px 16px' }}>
            <div className="syne" style={{ fontSize: 'clamp(18px,2.5vw,23px)', fontWeight: 800, color: s.color, lineHeight: 1 }}>
              {loading ? '…' : s.value}
            </div>
            <div style={{ fontSize: 11.5, color: 'rgba(235,231,255,0.4)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid-2 fu d2">
        {/* Top tracks */}
        <div className="glass" style={{ padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13, gap: 8 }}>
            <span className="syne" style={{ fontSize: 14, fontWeight: 700 }}>{t('dashboard.top_tracks')}</span>
            <div style={{ display: 'flex', gap: 3 }}>
              {(['4s', '6m', '∞'] as const).map((r) => (
                <button key={r} className={`rtab ${range === r ? 'on' : ''}`} onClick={() => setRange(r)}>{r}</button>
              ))}
            </div>
          </div>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="trow" style={{ opacity: 0.3 }}>
                  <div style={{ width: 18, height: 12, background: 'rgba(255,255,255,0.1)', borderRadius: 4 }} />
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.08)' }} />
                  <div style={{ flex: 1 }}><div style={{ height: 12, background: 'rgba(255,255,255,0.08)', borderRadius: 4, marginBottom: 4 }} /></div>
                </div>
              ))
            : topTracks.slice(0, 6).map((tr) => {
                const spotifyUrl = 'spotifyUrl' in tr ? tr.spotifyUrl as string | null : null
                const imageUrl = 'imageUrl' in tr ? tr.imageUrl as string | null : null
                const albumName = 'albumName' in tr ? tr.albumName as string | null : null
                return (
                  <div
                    key={tr.rank}
                    className="trow"
                    style={{ cursor: spotifyUrl ? 'pointer' : 'default' }}
                    onClick={() => openSpotify(spotifyUrl)}
                    onMouseEnter={(e) => openTooltip(e, {
                      x: e.clientX, y: e.clientY,
                      name: tr.name,
                      subtitle: tr.artist,
                      imageUrl,
                      gradient: tr.gradient,
                      plays: tr.plays,
                      extra: albumName ? `Álbum: ${albumName}` : undefined,
                      spotifyUrl,
                    })}
                    onMouseLeave={() => setTooltip(null)}
                    onMouseMove={(e) => setTooltip((prev) => prev ? { ...prev, x: e.clientX, y: e.clientY } : prev)}
                  >
                    <span style={{ width: 18, fontSize: 11.5, color: 'rgba(235,231,255,0.25)', fontWeight: 700, textAlign: 'right', flexShrink: 0 }}>{tr.rank}</span>
                    <ArtworkPlaceholder gradient={tr.gradient} size={36} radius={8} imageUrl={imageUrl} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <ScrollingName name={tr.name} style={{ fontSize: 12.5, fontWeight: 500 }} />
                      <div style={{ fontSize: 11, color: 'rgba(235,231,255,0.38)' }}>{tr.artist}</div>
                    </div>
                    {tr.plays > 0 && (
                      <span style={{ fontSize: 11, color: 'rgba(235,231,255,0.32)', whiteSpace: 'nowrap', flexShrink: 0 }}>{tr.plays}×</span>
                    )}
                  </div>
                )
              })}
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          {/* Now playing / top track */}
          {currentlyPlaying ? (
            <NowPlayingCard
              currentlyPlaying={currentlyPlaying}
              onOpenSpotify={openSpotify}
            />
          ) : topTracks[0] ? (
            <div
              className="glass2"
              style={{ padding: '12px 15px', display: 'flex', alignItems: 'center', gap: 11, cursor: 'spotifyUrl' in topTracks[0] && topTracks[0].spotifyUrl ? 'pointer' : 'default' }}
              onClick={() => openSpotify('spotifyUrl' in topTracks[0] ? topTracks[0].spotifyUrl as string | null : null)}
            >
              <ArtworkPlaceholder gradient={topTracks[0].gradient} size={38} radius={8} imageUrl={'imageUrl' in topTracks[0] ? topTracks[0].imageUrl as string | null : null} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <ScrollingName name={topTracks[0].name} style={{ fontSize: 12, fontWeight: 600 }} />
                <div style={{ fontSize: 11, color: 'rgba(235,231,255,0.38)' }}>{topTracks[0].artist}</div>
              </div>
              <span className="chip" style={{ flexShrink: 0, background: 'rgba(255,255,255,0.07)', color: 'rgba(235,231,255,0.4)' }}>#1</span>
            </div>
          ) : null}

          <GenreBar genres={genres} />
        </div>
      </div>

      {monthly.length > 0
        ? <MonthlyChart data={monthly} totalHours={totalHours} />
        : !isDemo && !loading && (
          <div className="glass" style={{ padding: '20px 22px', textAlign: 'center', color: 'rgba(235,231,255,0.38)', fontSize: 13 }}>
            {t('dashboard.upload_hint')}
          </div>
        )
      }

      {tooltip && <TrackTooltip data={tooltip} />}
    </div>
  )
}
