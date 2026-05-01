import { useTranslation } from 'react-i18next'

const LANGS = [
  { code: 'pt-BR', label: 'PT' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
]

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const current = i18n.language

  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => i18n.changeLanguage(l.code)}
          style={{
            padding: '4px 8px',
            fontSize: 11,
            fontWeight: 700,
            borderRadius: 7,
            border: '1px solid',
            cursor: 'pointer',
            letterSpacing: '.3px',
            transition: 'all .15s',
            background: current === l.code ? 'rgba(29,185,84,0.15)' : 'transparent',
            borderColor: current === l.code ? 'rgba(29,185,84,0.5)' : 'rgba(255,255,255,0.1)',
            color: current === l.code ? '#1DB954' : 'rgba(235,231,255,0.45)',
          }}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
