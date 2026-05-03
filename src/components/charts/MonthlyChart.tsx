import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ChartTooltip } from '@/components/ui/ChartTooltip'

interface Props {
  data: { month: string; hours: number }[]
  totalHours: number
  isDemo?: boolean
}

const MONTH_ABBR = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

export function MonthlyChart({ data, totalHours, isDemo }: Props) {
  const { t } = useTranslation()
  const [pickedYear, setPickedYear] = useState<string | null>(null)

  if (isDemo) {
    // Demo data already has abbreviated month names — render as-is, no year nav
    return (
      <div className="glass fu d3" style={{ padding: 20 }}>
        <div style={{ marginBottom: 14 }}>
          <div className="syne" style={{ fontSize: 14, fontWeight: 700 }}>{t('dashboard.monthly_chart')}</div>
          <div style={{ fontSize: 11.5, color: 'rgba(235,231,255,0.38)', marginTop: 2 }}>
            {t('dashboard.monthly_total', { year: new Date().getFullYear(), hours: totalHours })}
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
            <XAxis dataKey="month" tick={{ fill: 'rgba(235,231,255,0.32)', fontSize: 10.5 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(235,231,255,0.28)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="hours" name="h" stroke="#1DB954" strokeWidth={2} fill="url(#mg)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )
  }

  // Real data: month is "YYYY-MM" — group by year and allow navigation
  const years = [...new Set(data.map((d) => d.month.slice(0, 4)))].sort()
  const latestYear = years[years.length - 1] ?? String(new Date().getFullYear())
  const activeYear = pickedYear && years.includes(pickedYear) ? pickedYear : latestYear
  const activeIdx = years.indexOf(activeYear)

  const yearData = Array.from({ length: 12 }, (_, i) => {
    const mm = String(i + 1).padStart(2, '0')
    const found = data.find((d) => d.month === `${activeYear}-${mm}`)
    return { month: MONTH_ABBR[i], hours: found?.hours ?? 0 }
  })

  const yearHours = data
    .filter((d) => d.month.startsWith(activeYear))
    .reduce((s, d) => s + d.hours, 0)

  return (
    <div className="glass fu d3" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div className="syne" style={{ fontSize: 14, fontWeight: 700 }}>{t('dashboard.monthly_chart')}</div>
          <div style={{ fontSize: 11.5, color: 'rgba(235,231,255,0.38)', marginTop: 2 }}>
            {t('dashboard.monthly_total', { year: activeYear, hours: yearHours })}
          </div>
        </div>

        {years.length > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <button
              disabled={activeIdx <= 0}
              onClick={() => setPickedYear(years[activeIdx - 1]!)}
              style={{
                background: 'none', border: 'none',
                cursor: activeIdx <= 0 ? 'default' : 'pointer',
                color: activeIdx <= 0 ? 'rgba(235,231,255,0.18)' : 'rgba(235,231,255,0.55)',
                padding: '4px 5px', display: 'flex', alignItems: 'center',
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="syne" style={{ fontSize: 13, fontWeight: 700, minWidth: 38, textAlign: 'center' }}>
              {activeYear}
            </span>
            <button
              disabled={activeIdx >= years.length - 1}
              onClick={() => setPickedYear(years[activeIdx + 1]!)}
              style={{
                background: 'none', border: 'none',
                cursor: activeIdx >= years.length - 1 ? 'default' : 'pointer',
                color: activeIdx >= years.length - 1 ? 'rgba(235,231,255,0.18)' : 'rgba(235,231,255,0.55)',
                padding: '4px 5px', display: 'flex', alignItems: 'center',
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={130}>
        <AreaChart data={yearData} margin={{ top: 4, right: 0, bottom: 0, left: -32 }}>
          <defs>
            <linearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1DB954" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#1DB954" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" tick={{ fill: 'rgba(235,231,255,0.32)', fontSize: 10.5 }} axisLine={false} tickLine={false} interval={0} />
          <YAxis tick={{ fill: 'rgba(235,231,255,0.28)', fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip content={<ChartTooltip />} />
          <Area type="monotone" dataKey="hours" name="h" stroke="#1DB954" strokeWidth={2} fill="url(#mg)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
