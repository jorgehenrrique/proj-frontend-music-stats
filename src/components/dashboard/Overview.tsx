import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArtworkPlaceholder } from '@/components/ui/ArtworkPlaceholder'
import { MonthlyChart } from '@/components/charts/MonthlyChart'
import { GenreBar } from '@/components/charts/GenreBar'
import { DEMO_TRACKS, DEMO_ARTISTS, DEMO_MONTHLY, DEMO_GENRES } from './DEMO_DATA'

export function Overview() {
  const { t } = useTranslation()
  const [range, setRange] = useState('6m')

  const topArtist = DEMO_ARTISTS[0]
  const totalHours = DEMO_MONTHLY.reduce((a, b) => a + b.hours, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Top artist hero */}
      <div
        className="glass fu"
        style={{
          padding: 'clamp(14px,3vw,26px)',
          position: 'relative',
          overflow: 'hidden',
          background: `linear-gradient(135deg,rgba(233,30,99,0.11),rgba(7,7,26,0.55))`,
          border: '1px solid rgba(233,30,99,0.18)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 220,
            height: 220,
            borderRadius: '50%',
            background: 'rgba(233,30,99,0.13)',
            filter: 'blur(55px)',
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(10px,2vw,16px)',
            position: 'relative',
            zIndex: 1,
            flexWrap: 'wrap',
          }}
        >
          <ArtworkPlaceholder gradient={topArtist.gradient} size={68} radius={16} />
          <div style={{ flex: 1, minWidth: 140 }}>
            <div
              style={{
                fontSize: 10.5,
                color: 'rgba(235,231,255,0.4)',
                fontWeight: 600,
                letterSpacing: '1.2px',
                textTransform: 'uppercase',
                marginBottom: 3,
              }}
            >
              {t('dashboard.top_artist_label', { year: new Date().getFullYear() })}
            </div>
            <div className="syne" style={{ fontSize: 'clamp(20px,3.5vw,28px)', fontWeight: 800, lineHeight: 1 }}>
              {topArtist.name}
            </div>
            <div style={{ fontSize: 12.5, color: 'rgba(235,231,255,0.45)', marginTop: 4 }}>
              {topArtist.plays} scrobbles · {topArtist.tags}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div
              className="syne"
              style={{ fontSize: 'clamp(26px,4vw,36px)', fontWeight: 800, color: topArtist.color, lineHeight: 1 }}
            >
              {topArtist.plays}
            </div>
            <div style={{ fontSize: 10.5, color: 'rgba(235,231,255,0.38)', marginTop: 2 }}>
              {t('dashboard.total_plays')}
            </div>
          </div>
        </div>
      </div>

      {/* Stat pills */}
      <div className="grid-4 fu d1">
        {[
          { label: t('dashboard.hours_listened'), value: `${totalHours}h`, color: '#1DB954' },
          { label: t('dashboard.scrobbles'), value: '12.483', color: '#A78BFA' },
          { label: t('dashboard.unique_artists'), value: '284', color: '#06B6D4' },
          { label: t('dashboard.active_days'), value: '287', color: '#F59E0B' },
        ].map((s) => (
          <div key={s.label} className="glass2" style={{ padding: '14px 16px' }}>
            <div className="syne" style={{ fontSize: 'clamp(18px,2.5vw,23px)', fontWeight: 800, color: s.color, lineHeight: 1 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 11.5, color: 'rgba(235,231,255,0.4)', marginTop: 4 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid-2 fu d2">
        {/* Top tracks */}
        <div className="glass" style={{ padding: 18 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 13,
              gap: 8,
            }}
          >
            <span className="syne" style={{ fontSize: 14, fontWeight: 700 }}>
              {t('dashboard.top_tracks')}
            </span>
            <div style={{ display: 'flex', gap: 3 }}>
              {['4s', '6m', '∞'].map((r) => (
                <button
                  key={r}
                  className={`rtab ${range === r ? 'on' : ''}`}
                  onClick={() => setRange(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          {DEMO_TRACKS.slice(0, 6).map((tr) => (
            <div key={tr.rank} className="trow">
              <span
                style={{
                  width: 18,
                  fontSize: 11.5,
                  color: 'rgba(235,231,255,0.25)',
                  fontWeight: 700,
                  textAlign: 'right',
                  flexShrink: 0,
                }}
              >
                {tr.rank}
              </span>
              <ArtworkPlaceholder gradient={tr.gradient} size={36} radius={8} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 12.5,
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
              <span style={{ fontSize: 11, color: 'rgba(235,231,255,0.32)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                {tr.plays}×
              </span>
            </div>
          ))}
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          {/* Now playing */}
          <div
            className="glass2"
            style={{ padding: '12px 15px', display: 'flex', alignItems: 'center', gap: 11 }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2.5, height: 18, flexShrink: 0 }}>
              {['w1', 'w2', 'w3'].map((w) => (
                <div
                  key={w}
                  className={w}
                  style={{
                    width: 3,
                    height: 14,
                    background: '#1DB954',
                    borderRadius: 2,
                    transformOrigin: 'bottom',
                  }}
                />
              ))}
            </div>
            <ArtworkPlaceholder gradient={DEMO_TRACKS[0].gradient} size={38} radius={8} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{DEMO_TRACKS[0].name}</div>
              <div style={{ fontSize: 11, color: 'rgba(235,231,255,0.38)' }}>
                {DEMO_TRACKS[0].artist}
              </div>
            </div>
            <span className="chip cg" style={{ flexShrink: 0 }}>{t('dashboard.now_playing')}</span>
          </div>

          <GenreBar genres={DEMO_GENRES} />
        </div>
      </div>

      <MonthlyChart data={DEMO_MONTHLY} totalHours={totalHours} />
    </div>
  )
}
