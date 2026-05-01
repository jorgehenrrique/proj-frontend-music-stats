import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useTranslation } from 'react-i18next'
import { ChartTooltip } from '@/components/ui/ChartTooltip'

interface Props {
  data: { hour: string; plays: number }[]
  peakHour?: number
}

export function HourlyChart({ data, peakHour }: Props) {
  const { t } = useTranslation()

  return (
    <div className="glass fu" style={{ padding: 20 }}>
      <div className="syne" style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>
        {t('dashboard.hourly_title')}
      </div>
      <div style={{ fontSize: 12, color: 'rgba(235,231,255,0.38)', marginBottom: 15 }}>
        {peakHour !== undefined
          ? t('dashboard.hourly_peak', { from: peakHour, to: (peakHour + 2) % 24 })
          : t('dashboard.hourly_dist')}
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: -36 }}>
          <XAxis
            dataKey="hour"
            tick={{ fill: 'rgba(235,231,255,0.28)', fontSize: 9 }}
            axisLine={false}
            tickLine={false}
            interval={2}
          />
          <YAxis hide />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="plays" radius={[3, 3, 0, 0]}>
            {data.map((_entry, i) => (
              <Cell
                key={i}
                fill={
                  peakHour !== undefined && (i === peakHour || i === (peakHour + 1) % 24)
                    ? '#1DB954'
                    : 'rgba(29,185,84,0.25)'
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
