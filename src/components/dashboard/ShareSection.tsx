import { useState, useRef } from 'react'
import { Share2, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ArtworkPlaceholder } from '@/components/ui/ArtworkPlaceholder'
import { DEMO_TRACKS, DEMO_ARTISTS } from './DEMO_DATA'
import { useSpotifyData } from '@/hooks/useSpotifyData'

type CardType = 'top5' | 'artista' | 'ano'

function getSiteUrl(): string {
  const redirect = import.meta.env.VITE_SPOTIFY_REDIRECT_URI as string | undefined
  if (redirect) {
    try {
      const url = new URL(redirect)
      return url.origin
    } catch {
      // fall through
    }
  }
  return window.location.origin
}

export function ShareSection() {
  const { t } = useTranslation()
  const { isDemo, topTracks, topArtists, totalHours, totalPlays, uniqueArtistsCount, genres } = useSpotifyData()
  const siteUrl = getSiteUrl().replace(/^https?:\/\//, '')
  const [type, setType] = useState<CardType>('top5')
  const [copied, setCopied] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Use real data when authenticated, demo data only for preview
  const displayTracks = isDemo ? DEMO_TRACKS : topTracks
  const displayArtists = isDemo ? DEMO_ARTISTS : topArtists

  const year = new Date().getFullYear()
  const topArtist = displayArtists[0]

  const yearStats = isDemo
    ? [
        { label: t('dashboard.year_hours'), value: '847h', color: '#1DB954' },
        { label: t('dashboard.year_artists'), value: '284', color: '#A78BFA' },
        { label: t('dashboard.year_scrobbles'), value: '12.4k', color: '#06B6D4' },
        { label: t('dashboard.year_genres'), value: '47', color: '#F59E0B' },
      ]
    : [
        { label: t('dashboard.year_hours'), value: totalHours > 0 ? `${totalHours}h` : '—', color: '#1DB954' },
        { label: t('dashboard.year_artists'), value: uniqueArtistsCount > 0 ? String(uniqueArtistsCount) : String(topArtists.length), color: '#A78BFA' },
        { label: t('dashboard.year_scrobbles'), value: totalPlays > 0 ? totalPlays > 9999 ? `${(totalPlays / 1000).toFixed(1)}k` : String(totalPlays) : '—', color: '#06B6D4' },
        { label: t('dashboard.year_genres'), value: genres.length > 0 ? String(genres.length) : '—', color: '#F59E0B' },
      ]

  const handleDownload = async () => {
    if (!cardRef.current) return
    try {
      const html2canvas = (await import('html2canvas')).default

      const clone = cardRef.current.cloneNode(true) as HTMLElement
      clone.style.width = '400px'
      clone.style.height = 'auto'
      clone.style.borderRadius = '22px'
      clone.style.overflow = 'hidden'

      const wrapper = document.createElement('div')
      wrapper.style.position = 'fixed'
      wrapper.style.top = '-9999px'
      wrapper.style.left = '-9999px'
      wrapper.style.width = '400px'
      wrapper.style.borderRadius = '22px'
      wrapper.style.overflow = 'hidden'
      wrapper.appendChild(clone)
      document.body.appendChild(wrapper)

      const canvas = await html2canvas(wrapper, {
        backgroundColor: '#0D0A1E',
        scale: 2,
        width: 400,
        windowWidth: 400,
      })
      document.body.removeChild(wrapper)

      const link = document.createElement('a')
      link.download = `unwrapped-${type}-${Date.now()}.png`
      link.href = canvas.toDataURL()
      link.click()
    } catch {
      alert('Erro ao exportar. Tente novamente.')
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        {[
          { k: 'top5' as CardType, l: t('dashboard.card_top5') },
          { k: 'artista' as CardType, l: t('dashboard.card_artist') },
          { k: 'ano' as CardType, l: t('dashboard.card_year') },
        ].map((c) => (
          <button
            key={c.k}
            className={`rtab ${type === c.k ? 'on' : ''}`}
            style={{ fontSize: 13 }}
            onClick={() => setType(c.k)}
          >
            {c.l}
          </button>
        ))}
      </div>

      <div className="grid-2-share">
        {/* Card preview */}
        <div
          ref={cardRef}
          className="ci"
          style={{
            borderRadius: 22,
            overflow: 'hidden',
            padding: 26,
            background:
              'radial-gradient(ellipse at 90% 10%, rgba(233,30,99,0.18) 0%, transparent 55%), ' +
              'radial-gradient(ellipse at 10% 90%, rgba(29,185,84,0.12) 0%, transparent 55%), ' +
              'linear-gradient(135deg,#0D0A1E 0%,#180A22 50%,#091A14 100%)',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div className="syne" style={{ fontSize: 17, fontWeight: 800 }}>Unwrapped</div>
            <span style={{ fontSize: 10.5, color: 'rgba(235,231,255,0.35)' }}>{year}</span>
          </div>

          {/* Top 5 tracks */}
          {type === 'top5' && (
            <>
              <div style={{ fontSize: 10, letterSpacing: '1.4px', color: 'rgba(235,231,255,0.38)', textTransform: 'uppercase', marginBottom: 11 }}>
                {t('dashboard.top_tracks')}
              </div>
              {displayTracks.slice(0, 5).map((tr) => (
                <div key={tr.rank} style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 9 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: tr.gradient[0], width: 14, flexShrink: 0 }}>
                    {tr.rank}
                  </span>
                  <ArtworkPlaceholder
                    gradient={tr.gradient}
                    size={32}
                    radius={7}
                    imageUrl={'imageUrl' in tr ? tr.imageUrl as string | null : null}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11.5, fontWeight: 600, wordBreak: 'break-word' }}>{tr.name}</div>
                    <div style={{ fontSize: 10, color: 'rgba(235,231,255,0.38)' }}>{tr.artist}</div>
                  </div>
                  {tr.plays > 0 && (
                    <span style={{ fontSize: 10.5, color: 'rgba(235,231,255,0.32)', flexShrink: 0, marginLeft: 4 }}>
                      {tr.plays}×
                    </span>
                  )}
                </div>
              ))}
            </>
          )}

          {/* Top artist */}
          {type === 'artista' && topArtist && (
            <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <ArtworkPlaceholder
                gradient={topArtist.gradient}
                size={76}
                radius={19}
                imageUrl={'imageUrl' in topArtist ? topArtist.imageUrl as string | null : null}
              />
              <div style={{ marginTop: 11, fontSize: 10, color: 'rgba(235,231,255,0.38)', letterSpacing: '1.2px', textTransform: 'uppercase' }}>
                {t('dashboard.my_top_artist')}
              </div>
              <div className="syne" style={{ fontSize: 26, fontWeight: 800, marginTop: 3 }}>
                {topArtist.name}
              </div>
              {topArtist.plays > 0 && (
                <>
                  <div className="syne" style={{ fontSize: 34, fontWeight: 800, color: '#E91E63', marginTop: 6 }}>
                    {topArtist.plays.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(235,231,255,0.38)' }}>{t('dashboard.plays_year')}</div>
                </>
              )}
            </div>
          )}

          {/* Year in review */}
          {type === 'ano' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              {yearStats.map((s) => (
                <div key={s.label} style={{ textAlign: 'center', padding: '9px', background: 'rgba(255,255,255,0.05)', borderRadius: 9 }}>
                  <div className="syne" style={{ fontSize: 19, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: 'rgba(235,231,255,0.38)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <span style={{ fontSize: 10.5, color: 'rgba(235,231,255,0.28)' }}>{siteUrl}</span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          <div className="glass" style={{ padding: 18 }}>
            <div className="syne" style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>
              {t('dashboard.share_title')}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(235,231,255,0.42)', marginBottom: 15 }}>
              {t('dashboard.share_desc')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button className="btn-g" style={{ width: '100%', justifyContent: 'center' }} onClick={handleDownload}>
                <Share2 size={15} /> {t('dashboard.share_image')}
              </button>
              <button className="btn-o" style={{ width: '100%', justifyContent: 'center' }} onClick={handleCopy}>
                {copied ? <><Check size={14} />{t('dashboard.copied')}</> : t('dashboard.copy_link')}
              </button>
            </div>
          </div>
          <div className="glass2" style={{ padding: 15 }}>
            <div style={{ fontSize: 11.5, color: 'rgba(235,231,255,0.38)', marginBottom: 7 }}>
              {t('dashboard.how_card_title')}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(235,231,255,0.55)', lineHeight: 1.55 }}>
              {t('dashboard.how_card_desc')}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
