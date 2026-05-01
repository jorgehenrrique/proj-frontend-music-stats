import { useTranslation } from 'react-i18next'
import { HourlyChart } from '@/components/charts/HourlyChart'
import { WeeklyChart } from '@/components/charts/WeeklyChart'
import { DEMO_HOURLY, DEMO_WEEKLY } from './DEMO_DATA'

export function Habits() {
  const { t } = useTranslation()

  const curiosities = [
    { emoji: '🎵', label: t('dashboard.cur_top_track'), value: 'Blinding Lights, 147×' },
    { emoji: '🌙', label: t('dashboard.cur_peak_hour'), value: '23h – 01h' },
    { emoji: '🔥', label: t('dashboard.cur_streak'), value: '23 dias seguidos' },
    { emoji: '⏱', label: t('dashboard.cur_daily_avg'), value: '2h 19min' },
    { emoji: '🆕', label: t('dashboard.cur_discovered'), value: '47 novos em 2024' },
    { emoji: '📅', label: t('dashboard.cur_best_month'), value: 'Dezembro · 120h' },
  ]

  const peakHourIndex = DEMO_HOURLY.reduce(
    (maxIdx, entry, idx, arr) => (entry.plays > arr[maxIdx].plays ? idx : maxIdx),
    0
  )

  const peakDay = DEMO_WEEKLY.reduce(
    (max, entry) => (entry.plays > max.plays ? entry : max),
    DEMO_WEEKLY[0]
  ).day

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <HourlyChart data={DEMO_HOURLY} peakHour={peakHourIndex} />

      <div className="grid-2">
        <WeeklyChart data={DEMO_WEEKLY} peakDay={peakDay} />

        <div className="glass fu d1" style={{ padding: 20 }}>
          <div className="syne" style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>
            {t('dashboard.curiosities')}
          </div>
          {curiosities.map((x) => (
            <div
              key={x.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '7px 0',
                borderBottom: '1px solid rgba(255,255,255,0.045)',
              }}
            >
              <span style={{ fontSize: 15, flexShrink: 0 }}>{x.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10.5, color: 'rgba(235,231,255,0.38)' }}>{x.label}</div>
                <div style={{ fontSize: 12.5, fontWeight: 500, marginTop: 1 }}>{x.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
