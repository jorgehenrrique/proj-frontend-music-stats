import { useState, useRef } from 'react'
import { Share2, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ArtworkPlaceholder } from '@/components/ui/ArtworkPlaceholder'
import { DEMO_TRACKS, DEMO_ARTISTS } from './DEMO_DATA'

type CardType = 'top5' | 'artista' | 'ano'

export function ShareSection() {
  const { t } = useTranslation()
  const [type, setType] = useState<CardType>('top5')
  const [copied, setCopied] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleDownload = async () => {
    if (!cardRef.current) return
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
      })
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
            background: 'linear-gradient(135deg,#0D0A1E 0%,#180A22 50%,#091A14 100%)',
            border: '1px solid rgba(255,255,255,0.09)',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -40,
              right: -40,
              width: 160,
              height: 160,
              borderRadius: '50%',
              background: 'rgba(233,30,99,0.14)',
              filter: 'blur(50px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -30,
              left: -30,
              width: 130,
              height: 130,
              borderRadius: '50%',
              background: 'rgba(29,185,84,0.1)',
              filter: 'blur(40px)',
            }}
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 18,
              }}
            >
              <div className="syne" style={{ fontSize: 17, fontWeight: 800 }}>
                Unwrapped
              </div>
              <span style={{ fontSize: 10.5, color: 'rgba(235,231,255,0.35)' }}>
                {new Date().getFullYear()}
              </span>
            </div>

            {type === 'top5' && (
              <>
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: '1.4px',
                    color: 'rgba(235,231,255,0.38)',
                    textTransform: 'uppercase',
                    marginBottom: 11,
                  }}
                >
                  {t('dashboard.top_tracks')}
                </div>
                {DEMO_TRACKS.slice(0, 5).map((tr) => (
                  <div key={tr.rank} style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 9 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: tr.gradient[0], width: 14, flexShrink: 0 }}>
                      {tr.rank}
                    </span>
                    <ArtworkPlaceholder gradient={tr.gradient} size={32} radius={7} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tr.name}</div>
                      <div style={{ fontSize: 10, color: 'rgba(235,231,255,0.38)' }}>{tr.artist}</div>
                    </div>
                    <span style={{ fontSize: 10.5, color: 'rgba(235,231,255,0.32)', flexShrink: 0 }}>{tr.plays}×</span>
                  </div>
                ))}
              </>
            )}

            {type === 'artista' && (
              <div style={{ textAlign: 'center', padding: '8px 0' }}>
                <ArtworkPlaceholder gradient={DEMO_ARTISTS[0].gradient} size={76} radius={19} />
                <div
                  style={{
                    marginTop: 11,
                    fontSize: 10,
                    color: 'rgba(235,231,255,0.38)',
                    letterSpacing: '1.2px',
                    textTransform: 'uppercase',
                  }}
                >
                  {t('dashboard.my_top_artist')}
                </div>
                <div className="syne" style={{ fontSize: 26, fontWeight: 800, marginTop: 3 }}>
                  {DEMO_ARTISTS[0].name}
                </div>
                <div
                  className="syne"
                  style={{ fontSize: 34, fontWeight: 800, color: '#E91E63', marginTop: 6 }}
                >
                  {DEMO_ARTISTS[0].plays}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(235,231,255,0.38)' }}>{t('dashboard.plays_year')}</div>
              </div>
            )}

            {type === 'ano' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                {[
                  { label: t('dashboard.year_hours'), value: '847h', color: '#1DB954' },
                  { label: t('dashboard.year_artists'), value: '284', color: '#A78BFA' },
                  { label: t('dashboard.year_scrobbles'), value: '12.4k', color: '#06B6D4' },
                  { label: t('dashboard.year_genres'), value: '47', color: '#F59E0B' },
                ].map((s) => (
                  <div
                    key={s.label}
                    style={{
                      textAlign: 'center',
                      padding: '9px',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: 9,
                    }}
                  >
                    <div className="syne" style={{ fontSize: 19, fontWeight: 800, color: s.color }}>
                      {s.value}
                    </div>
                    <div style={{ fontSize: 10, color: 'rgba(235,231,255,0.38)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            <div
              style={{
                marginTop: 14,
                paddingTop: 12,
                borderTop: '1px solid rgba(255,255,255,0.07)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: 10.5, color: 'rgba(235,231,255,0.28)' }}>
                unwrapped.app
              </span>
              <div style={{ display: 'flex', gap: 5 }}>
                <span className="chip cg" style={{ fontSize: 9.5 }}>
                  Spotify
                </span>
                <span className="chip cr" style={{ fontSize: 9.5 }}>
                  Last.fm
                </span>
              </div>
            </div>
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
              <button
                className="btn-g"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={handleDownload}
              >
                <Share2 size={15} /> {t('dashboard.share_image')}
              </button>
              <button
                className="btn-o"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check size={14} />
                    {t('dashboard.copied')}
                  </>
                ) : (
                  t('dashboard.copy_link')
                )}
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
