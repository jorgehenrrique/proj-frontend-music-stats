import { useState } from 'react'
import { BarChart3, Clock, Share2, TrendingUp, Upload as UploadIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AuroraBlobs } from '@/components/layout/AuroraBlobs'
import { Sidebar, type NavKey } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { Overview } from '@/components/dashboard/Overview'
import { TopMusic } from '@/components/dashboard/TopMusic'
import { Habits } from '@/components/dashboard/Habits'
import { ShareSection } from '@/components/dashboard/ShareSection'
import { Upload } from '@/pages/Upload'

interface Props {
  onBack: () => void
  onLogout: () => void
}

const NAV_ICONS: Record<NavKey, React.ElementType> = {
  overview: BarChart3,
  top: TrendingUp,
  habits: Clock,
  share: Share2,
  upload: UploadIcon,
}

export function Dashboard({ onBack, onLogout }: Props) {
  const { t } = useTranslation()
  const [active, setActive] = useState<NavKey>('overview')

  const NAV_KEYS: { k: NavKey; label: string }[] = [
    { k: 'overview', label: t('nav.overview') },
    { k: 'top', label: t('nav.topMusic') },
    { k: 'habits', label: t('nav.habits') },
    { k: 'share', label: t('nav.share') },
    { k: 'upload', label: t('nav.upload') },
  ]

  return (
    <div className="dash-shell">
      <AuroraBlobs />
      <div className="dash-sidebar">
        <Sidebar active={active} onChange={setActive} />
      </div>
      <div className="dash-content">
        <Topbar active={active} onBack={onBack} onLogout={onLogout} />
        <div className="dash-scroll">
          {active === 'overview' && <Overview />}
          {active === 'top' && <TopMusic />}
          {active === 'habits' && <Habits />}
          {active === 'share' && <ShareSection />}
          {active === 'upload' && <Upload onDone={() => setActive('overview')} />}
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="dash-bottom-nav">
        {NAV_KEYS.map(({ k, label }) => {
          const Icon = NAV_ICONS[k]
          return (
            <div
              key={k}
              className={`nav-item-mobile ${active === k ? 'active' : ''}`}
              onClick={() => setActive(k)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </div>
          )
        })}
      </nav>
    </div>
  )
}
