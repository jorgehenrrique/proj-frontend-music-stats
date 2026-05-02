import { LogOut } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/authStore'
import { useUserStore } from '@/store/userStore'
import type { NavKey } from './Sidebar'

interface Props {
  active: NavKey
  onBack?: () => void
  onLogout?: () => void
}

export function Topbar({ active, onBack, onLogout }: Props) {
  const { t } = useTranslation()
  const { spotify, clearSpotify } = useAuthStore()
  const resetUser = useUserStore((s) => s.reset)

  const NAV_KEYS: Record<NavKey, string> = {
    overview: t('nav.overview'),
    top: t('nav.topMusic'),
    habits: t('nav.habits'),
    share: t('nav.share'),
    upload: t('nav.upload'),
  }

  function handleLogout() {
    clearSpotify()
    resetUser()
    onLogout?.()
  }

  return (
    <div
      style={{
        padding: '15px 22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
        background: 'rgba(7,7,26,0.6)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div>
        <div className="syne" style={{ fontSize: 16, fontWeight: 700 }}>
          {NAV_KEYS[active]}
        </div>
        <div className="topbar-subtitle" style={{ fontSize: 11.5, color: 'rgba(235,231,255,0.36)', marginTop: 1 }}>
          {t('dashboard.updated')} · {new Date().getFullYear()}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span className="chip cg" style={{ padding: '5px 12px' }}>
          {t('dashboard.live')}
        </span>
        {spotify && (
          <button
            className="btn-o"
            style={{ padding: '7px 15px', fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 6 }}
            onClick={handleLogout}
            title={t('dashboard.logout_spotify')}
          >
            <LogOut size={13} />
            <span className="topbar-logout-label">{t('dashboard.logout_spotify')}</span>
          </button>
        )}
        {onBack && (
          <button className="btn-o" style={{ padding: '7px 15px', fontSize: 12.5 }} onClick={onBack}>
            {t('dashboard.back')}
          </button>
        )}
      </div>
    </div>
  )
}
