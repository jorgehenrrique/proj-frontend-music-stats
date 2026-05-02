import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArtworkPlaceholder } from '@/components/ui/ArtworkPlaceholder'
import { useSpotifyData } from '@/hooks/useSpotifyData'

const RANGE_MAP = {
  '4s': 'short_term',
  '6m': 'medium_term',
  'todo': 'long_term',
} as const

export function TopMusic() {
  const { t } = useTranslation()
  const [range, setRange] = useState<'4s' | '6m' | 'todo'>('6m')
  const { topTracks, topArtists, loading } = useSpotifyData(RANGE_MAP[range])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        {[
          { k: '4s' as const, l: t('dashboard.period_4w') },
          { k: '6m' as const, l: t('dashboard.period_6m') },
          { k: 'todo' as const, l: t('dashboard.period_all') },
        ].map((r) => (
          <button key={r.k} className={`rtab ${range === r.k ? 'on' : ''}`} style={{ fontSize: 13 }} onClick={() => setRange(r.k)}>
            {r.l}
          </button>
        ))}
      </div>

      <div className="grid-2-alt">
        <div className="glass" style={{ padding: 20 }}>
          <div className="syne" style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>{t('dashboard.top_tracks')}</div>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="trow" style={{ opacity: 0.3 }}>
                  <div style={{ width: 22, height: 12, background: 'rgba(255,255,255,0.1)', borderRadius: 4 }} />
                  <div style={{ width: 40, height: 40, borderRadius: 9, background: 'rgba(255,255,255,0.08)' }} />
                  <div style={{ flex: 1 }}><div style={{ height: 12, background: 'rgba(255,255,255,0.08)', borderRadius: 4 }} /></div>
                </div>
              ))
            : topTracks.map((tr) => (
                <div key={tr.rank} className="trow">
                  <span style={{ width: 22, textAlign: 'center', fontSize: 12, color: 'rgba(235,231,255,0.22)', fontWeight: 700, flexShrink: 0 }}>{tr.rank}</span>
                  <ArtworkPlaceholder gradient={tr.gradient} size={40} radius={9} imageUrl={'imageUrl' in tr ? tr.imageUrl as string | null : null} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tr.name}</div>
                    <div style={{ fontSize: 11, color: 'rgba(235,231,255,0.38)' }}>{tr.artist}</div>
                  </div>
                  {tr.plays > 0 && (
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: tr.gradient[0] }}>{tr.plays}×</div>
                    </div>
                  )}
                </div>
              ))}
        </div>

        <div className="glass" style={{ padding: 20 }}>
          <div className="syne" style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>{t('dashboard.top_artists')}</div>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="trow" style={{ opacity: 0.3 }}>
                  <div style={{ width: 16, height: 12, background: 'rgba(255,255,255,0.1)', borderRadius: 4 }} />
                  <div style={{ width: 42, height: 42, borderRadius: 21, background: 'rgba(255,255,255,0.08)' }} />
                  <div style={{ flex: 1 }}><div style={{ height: 12, background: 'rgba(255,255,255,0.08)', borderRadius: 4 }} /></div>
                </div>
              ))
            : topArtists.map((a) => (
                <div key={a.rank} className="trow">
                  <span style={{ width: 16, fontSize: 11.5, color: 'rgba(235,231,255,0.22)', fontWeight: 700, flexShrink: 0 }}>{a.rank}</span>
                  <ArtworkPlaceholder gradient={a.gradient} size={42} radius={21} imageUrl={'imageUrl' in a ? a.imageUrl as string | null : null} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.name}</div>
                    <div style={{ fontSize: 10.5, color: 'rgba(235,231,255,0.36)' }}>{a.tags}</div>
                  </div>
                  {a.plays > 0 && (
                    <div style={{ fontSize: 13, fontWeight: 600, color: a.color, flexShrink: 0 }}>{a.plays}</div>
                  )}
                </div>
              ))}
        </div>
      </div>
    </div>
  )
}
