import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useTranslation } from 'react-i18next'
import { ChartTooltip } from '@/components/ui/ChartTooltip'

interface Props {
  data: { month: string; hours: number }[]
  totalHours: number
}

export function MonthlyChart({ data, totalHours }: Props) {
  const { t } = useTranslation()

  return (
    <div className="glass fu d3" style={{ padding: 20 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 14,
        }}
      >
        <div>
          <div className="syne" style={{ fontSize: 14, fontWeight: 700 }}>
            {t('dashboard.monthly_chart')}
          </div>
          <div style={{ fontSize: 11.5, color: 'rgba(235,231,255,0.38)', marginTop: 2 }}>
            {t('dashboard.monthly_total', { year: new Date().getFullYear(), hours: totalHours })}
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={130}>
        <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: -32 }}>
          <defs>
            <linearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1DB954" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#1DB954" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="month"
            tick={{ fill: 'rgba(235,231,255,0.32)', fontSize: 10.5 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'rgba(235,231,255,0.28)', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<ChartTooltip />} />
          <Area
            type="monotone"
            dataKey="hours"
            name="h"
            stroke="#1DB954"
            strokeWidth={2}
            fill="url(#mg)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
