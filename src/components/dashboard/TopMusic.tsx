import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArtworkPlaceholder } from '@/components/ui/ArtworkPlaceholder'
import { DEMO_TRACKS, DEMO_ARTISTS } from './DEMO_DATA'

export function TopMusic() {
  const { t } = useTranslation()
  const [range, setRange] = useState('6m')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        {[
          { k: '4s', l: t('dashboard.period_4w') },
          { k: '6m', l: t('dashboard.period_6m') },
          { k: 'todo', l: t('dashboard.period_all') },
        ].map((r) => (
          <button
            key={r.k}
            className={`rtab ${range === r.k ? 'on' : ''}`}
            style={{ fontSize: 13 }}
            onClick={() => setRange(r.k)}
          >
            {r.l}
          </button>
        ))}
      </div>

      <div className="grid-2-alt">
        <div className="glass" style={{ padding: 20 }}>
          <div className="syne" style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>
            {t('dashboard.top_tracks')}
          </div>
          {DEMO_TRACKS.map((tr) => (
            <div key={tr.rank} className="trow">
              <span
                style={{
                  width: 22,
                  textAlign: 'center',
                  fontSize: 12,
                  color: 'rgba(235,231,255,0.22)',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {tr.rank}
              </span>
              <ArtworkPlaceholder gradient={tr.gradient} size={40} radius={9} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {tr.name}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(235,231,255,0.38)' }}>{tr.artist}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: tr.gradient[0] }}>{tr.plays}×</div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass" style={{ padding: 20 }}>
          <div className="syne" style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>
            {t('dashboard.top_artists')}
          </div>
          {DEMO_ARTISTS.map((a) => (
            <div key={a.rank} className="trow">
              <span
                style={{
                  width: 16,
                  fontSize: 11.5,
                  color: 'rgba(235,231,255,0.22)',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {a.rank}
              </span>
              <ArtworkPlaceholder gradient={a.gradient} size={42} radius={21} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {a.name}
                </div>
                <div style={{ fontSize: 10.5, color: 'rgba(235,231,255,0.36)' }}>{a.tags}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: a.color, flexShrink: 0 }}>{a.plays}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
