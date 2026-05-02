import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ChartTooltip } from '@/components/ui/ChartTooltip'

interface Props {
  data: { month: string; hours: number }[]
  totalHours: number
}

const MONTH_ABBR = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

export function MonthlyChart({ data, totalHours }: Props) {
  const { t } = useTranslation()

  const years = [...new Set(data.map((d) => d.month.slice(0, 4)))].sort()
  const latestYear = years[years.length - 1] ?? String(new Date().getFullYear())
  const [selectedYear, setSelectedYear] = useState<string>(latestYear)

  const isAll = selectedYear === 'all' || years.length <= 1

  // For a specific year: fill all 12 months
  // For "all": use raw data sorted by month
  const chartData = isAll
    ? data.map((d) => ({ month: d.month.slice(0, 7), hours: d.hours }))
    : Array.from({ length: 12 }, (_, i) => {
        const mm = String(i + 1).padStart(2, '0')
        const key = `${selectedYear}-${mm}`
        const found = data.find((d) => d.month === key)
        return { month: MONTH_ABBR[i], hours: found?.hours ?? 0 }
      })

  const displayHours = isAll
    ? totalHours
    : data.filter((d) => d.month.startsWith(selectedYear)).reduce((s, d) => s + d.hours, 0)

  const displayYear = isAll ? t('dashboard.monthly_all_years') : selectedYear

  const yearIdx = years.indexOf(selectedYear)
  const canPrev = !isAll && yearIdx > 0
  const canNext = !isAll && yearIdx < years.length - 1

  return (
    <div className="glass fu d3" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div className="syne" style={{ fontSize: 14, fontWeight: 700 }}>
            {t('dashboard.monthly_chart')}
          </div>
          <div style={{ fontSize: 11.5, color: 'rgba(235,231,255,0.38)', marginTop: 2 }}>
            {t('dashboard.monthly_total', { year: displayYear, hours: displayHours })}
          </div>
        </div>

        {years.length > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button
              onClick={() => canPrev && setSelectedYear(years[yearIdx - 1])}
              disabled={!canPrev}
              style={{
                background: 'none',
                border: 'none',
                cursor: canPrev ? 'pointer' : 'default',
                color: canPrev ? 'rgba(235,231,255,0.6)' : 'rgba(235,231,255,0.18)',
                padding: '4px 6px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="syne" style={{ fontSize: 13, fontWeight: 700, minWidth: 40, textAlign: 'center' }}>
              {isAll ? 'Todos' : selectedYear}
            </span>
            <button
              onClick={() => canNext && setSelectedYear(years[yearIdx + 1])}
              disabled={!canNext}
              style={{
                background: 'none',
                border: 'none',
                cursor: canNext ? 'pointer' : 'default',
                color: canNext ? 'rgba(235,231,255,0.6)' : 'rgba(235,231,255,0.18)',
                padding: '4px 6px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={130}>
        <AreaChart data={chartData} margin={{ top: 4, right: 0, bottom: 0, left: -32 }}>
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
            interval={isAll ? Math.floor(chartData.length / 8) : 0}
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

      {years.length > 1 && (
        <div style={{ display: 'flex', gap: 4, marginTop: 12, flexWrap: 'wrap' }}>
          {years.map((y) => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              style={{
                background: y === selectedYear ? '#1DB95422' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${y === selectedYear ? '#1DB95455' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 6,
                color: y === selectedYear ? '#1DB954' : 'rgba(235,231,255,0.4)',
                fontSize: 11,
                fontWeight: y === selectedYear ? 700 : 400,
                padding: '3px 9px',
                cursor: 'pointer',
              }}
            >
              {y}
            </button>
          ))}
          <button
            onClick={() => setSelectedYear('all')}
            style={{
              background: isAll ? '#1DB95422' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${isAll ? '#1DB95455' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 6,
              color: isAll ? '#1DB954' : 'rgba(235,231,255,0.4)',
              fontSize: 11,
              fontWeight: isAll ? 700 : 400,
              padding: '3px 9px',
              cursor: 'pointer',
            }}
          >
            Todos
          </button>
        </div>
      )}
    </div>
  )
}
