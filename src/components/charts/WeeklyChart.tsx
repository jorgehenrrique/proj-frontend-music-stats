import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useTranslation } from 'react-i18next'
import { ChartTooltip } from '@/components/ui/ChartTooltip'

interface Props {
  data: { day: string; plays: number }[]
  peakDay?: string
}

export function WeeklyChart({ data, peakDay }: Props) {
  const { t } = useTranslation()

  return (
    <div className="glass fu d1" style={{ padding: 20 }}>
      <div className="syne" style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>
        {t('dashboard.weekly_title')}
      </div>
      <div style={{ fontSize: 12, color: 'rgba(235,231,255,0.38)', marginBottom: 15 }}>
        {peakDay ? t('dashboard.weekly_peak', { day: peakDay }) : t('dashboard.weekly_dist')}
      </div>
      <ResponsiveContainer width="100%" height={130}>
        <BarChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: -36 }}>
          <XAxis
            dataKey="day"
            tick={{ fill: 'rgba(235,231,255,0.32)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="plays" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.day === peakDay ? '#A78BFA' : 'rgba(167,139,250,0.25)'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
