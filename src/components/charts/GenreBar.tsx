import { useTranslation } from 'react-i18next'

interface GenreItem {
  genre: string
  percentage: number
  color: string
}

interface Props {
  genres: GenreItem[]
}

export function GenreBar({ genres }: Props) {
  const { t } = useTranslation()

  return (
    <div className="glass" style={{ padding: 18, flex: 1 }}>
      <div className="syne" style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>
        {t('dashboard.genres')}
      </div>
      {genres.map((g) => (
        <div key={g.genre} style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 12, fontWeight: 500 }}>{g.genre}</span>
            <span style={{ fontSize: 11.5, color: 'rgba(235,231,255,0.42)' }}>{g.percentage}%</span>
          </div>
          <div className="pbar">
            <div
              className="pfill"
              style={{
                width: `${g.percentage}%`,
                background: `linear-gradient(90deg,${g.color}88,${g.color})`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
