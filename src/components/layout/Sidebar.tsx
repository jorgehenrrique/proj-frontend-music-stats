import { BarChart3, Clock, Share2, TrendingUp, Headphones, Upload } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useUserStore } from '@/store/userStore'
import { useAuthStore } from '@/store/authStore'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'

export type NavKey = 'overview' | 'top' | 'habits' | 'share' | 'upload'

interface Props {
  active: NavKey
  onChange: (k: NavKey) => void
}

export function Sidebar({ active, onChange }: Props) {
  const { t } = useTranslation()
  const spotifyUser = useUserStore((s) => s.spotifyUser)
  const lastfmUsername = useAuthStore((s) => s.lastfmUsername)

  const NAV: { k: NavKey; Icon: React.ElementType; label: string }[] = [
    { k: 'overview', Icon: BarChart3, label: t('nav.overview') },
    { k: 'top', Icon: TrendingUp, label: t('nav.topMusic') },
    { k: 'habits', Icon: Clock, label: t('nav.habits') },
    { k: 'share', Icon: Share2, label: t('nav.share') },
    { k: 'upload', Icon: Upload, label: t('nav.upload') },
  ]

  const initial = spotifyUser?.display_name?.[0]?.toUpperCase() ?? 'U'
  const name = spotifyUser?.display_name ?? 'User'

  return (
    <div
      style={{
        width: 204,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        padding: '22px 10px',
        gap: 3,
        zIndex: 10,
        position: 'relative',
      }}
    >
      <div
        style={{
          padding: '0 6px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          marginBottom: 6,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: 'linear-gradient(135deg,#1DB954,#0a7a35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Headphones size={14} color="#000" />
        </div>
        <span className="syne" style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-.3px' }}>
          Unwrapped
        </span>
      </div>

      {NAV.map((n) => (
        <div
          key={n.k}
          className={`nav-item ${active === n.k ? 'active' : ''}`}
          onClick={() => onChange(n.k)}
        >
          <n.Icon size={14} /> {n.label}
        </div>
      ))}

      <div style={{ flex: 1 }} />

      <div style={{ padding: '0 6px 10px' }}>
        <LanguageSwitcher />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          padding: '10px 7px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'linear-gradient(135deg,#E91E63,#9C27B0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700 }}>{initial}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600 }}>{name}</div>
          <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>
            <span className="chip cg" style={{ fontSize: 9 }}>
              Spotify
            </span>
            {lastfmUsername && (
              <span className="chip cr" style={{ fontSize: 9 }}>
                Last.fm
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
