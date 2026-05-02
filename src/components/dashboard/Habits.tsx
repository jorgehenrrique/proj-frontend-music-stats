import { useTranslation } from 'react-i18next'
import { HourlyChart } from '@/components/charts/HourlyChart'
import { WeeklyChart } from '@/components/charts/WeeklyChart'
import { useSpotifyData } from '@/hooks/useSpotifyData'
import { useHistoryStore } from '@/store/historyStore'

export function Habits() {
  const { t } = useTranslation()
  const { hourly, weekly, topTracks, totalHours, activeDaysCount } = useSpotifyData()
  const history = useHistoryStore((s) => s.history)

  const peakHourIndex = hourly.reduce(
    (maxIdx, entry, idx, arr) => (entry.plays > arr[maxIdx].plays ? idx : maxIdx),
    0
  )
  const peakDay = weekly.reduce((max, entry) => (entry.plays > max.plays ? entry : max), weekly[0])?.day ?? '—'

  const topTrack = topTracks[0]
  const dailyAvgMin = activeDaysCount > 0 ? Math.round((totalHours * 60) / activeDaysCount) : 0
  const dailyAvgH = Math.floor(dailyAvgMin / 60)
  const dailyAvgM = dailyAvgMin % 60

  const curiosities = [
    {
      emoji: '🎵',
      label: t('dashboard.cur_top_track'),
      value: topTrack ? `${topTrack.name}${topTrack.plays > 0 ? `, ${topTrack.plays}×` : ''}` : '—',
    },
    {
      emoji: '🌙',
      label: t('dashboard.cur_peak_hour'),
      value: hourly[peakHourIndex]?.plays > 0
        ? `${peakHourIndex}h – ${(peakHourIndex + 2) % 24}h`
        : '—',
    },
    {
      emoji: '⏱',
      label: t('dashboard.cur_daily_avg'),
      value: dailyAvgMin > 0
        ? dailyAvgH > 0 ? `${dailyAvgH}h ${dailyAvgM}min` : `${dailyAvgM}min`
        : '—',
    },
    {
      emoji: '📅',
      label: t('dashboard.cur_best_month'),
      value: history
        ? (() => {
            const best = Object.entries(history.byMonth).sort(([, a], [, b]) => b - a)[0]
            if (!best) return '—'
            const [ym, ms] = best
            return `${ym} · ${Math.round(ms / 3600000)}h`
          })()
        : '—',
    },
    {
      emoji: '🎤',
      label: t('dashboard.cur_discovered'),
      value: history ? `${history.uniqueArtists.size} ${t('dashboard.unique_artists').toLowerCase()}` : '—',
    },
    {
      emoji: '🗓',
      label: t('dashboard.active_days'),
      value: activeDaysCount > 0 ? `${activeDaysCount} dias` : '—',
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <HourlyChart data={hourly} peakHour={peakHourIndex} />

      <div className="grid-2">
        <WeeklyChart data={weekly} peakDay={peakDay} />

        <div className="glass fu d1" style={{ padding: 20 }}>
          <div className="syne" style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>
            {t('dashboard.curiosities')}
          </div>
          {curiosities.map((x) => (
            <div key={x.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.045)' }}>
              <span style={{ fontSize: 15, flexShrink: 0 }}>{x.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10.5, color: 'rgba(235,231,255,0.38)' }}>{x.label}</div>
                <div style={{ fontSize: 12.5, fontWeight: 500, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{x.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
