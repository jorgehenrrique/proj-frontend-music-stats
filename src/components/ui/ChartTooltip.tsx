interface TooltipPayload {
  value: number | string
  name?: string
}

interface Props {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
}

export function ChartTooltip({ active, payload, label }: Props) {
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        background: 'rgba(8,8,26,0.92)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 9,
        padding: '7px 11px',
        fontSize: 11.5,
      }}
    >
      <div style={{ color: 'rgba(235,231,255,0.45)', marginBottom: 2 }}>{label}</div>
      <div style={{ color: '#1DB954', fontWeight: 600 }}>
        {payload[0].value}
        {payload[0].name === 'h' ? 'h' : ''}
      </div>
    </div>
  )
}
