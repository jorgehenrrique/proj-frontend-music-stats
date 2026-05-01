import { BarChart3, Radio, Share2, Play, Flame, Headphones } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AuroraBlobs } from '@/components/layout/AuroraBlobs'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { initiateSpotifyAuth } from '@/api/spotify'
import { toast } from '@/store/toastStore'

interface Props {
  onEnter: () => void
}

function handleSpotifyConnect() {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string

  if (!clientId || clientId === 'your_spotify_client_id_here') {
    toast.error(
      `Adicione VITE_SPOTIFY_CLIENT_ID no arquivo .env para conectar. ${clientId}`,
      'Spotify não configurado'
    )
    return
  }
  initiateSpotifyAuth()
}

export function Landing({ onEnter }: Props) {
  const { t } = useTranslation()

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <AuroraBlobs />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Navbar */}
        <nav
          className="landing-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 9,
                background: 'linear-gradient(135deg,#1DB954,#0a7a35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Headphones size={14} color="#000" />
            </div>
            <span
              className="syne"
              style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-.3px' }}
            >
              Unwrapped
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
            }}
          >
            <LanguageSwitcher />
            <a
              href="https://github.com/jorgehenrrique/proj-frontend-music-stats"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-o"
              style={{ padding: '9px 20px', fontSize: 13 }}
            >
              {t('landing.github')}
            </a>
            <button
              className="btn-g"
              style={{ padding: '9px 20px', fontSize: 13 }}
              onClick={onEnter}
            >
              {t('landing.preview')}
            </button>
          </div>
        </nav>

        {/* Hero */}
        <div
          className="landing-hero"
          style={{
            textAlign: 'center',
            maxWidth: 820,
            margin: '0 auto',
          }}
        >
          <div
            className="chip cg fu"
            style={{
              display: 'inline-flex',
              gap: 6,
              marginBottom: 18,
              padding: '5px 14px',
              fontSize: 11.5,
            }}
          >
            <Flame size={12} /> {t('landing.badge')}
          </div>
          <h1
            className="syne fu d1"
            style={{
              fontSize: 'clamp(36px,6.5vw,82px)',
              fontWeight: 800,
              lineHeight: 1.04,
              letterSpacing: '-2px',
              marginBottom: 14,
            }}
          >
            {t('landing.headline1')}
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg,#1DB954 30%,#6EF59A)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {t('landing.headline2')}
            </span>
          </h1>
          <p
            className="fu d2"
            style={{
              fontSize: 'clamp(14px,2vw,17px)',
              color: 'rgba(235,231,255,0.48)',
              lineHeight: 1.62,
              maxWidth: 560,
              margin: '0 auto 34px',
            }}
          >
            {t('landing.subtitle')}
          </p>
          <div
            className="fu d3"
            style={{ display: 'flex', gap: 11, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <button
              className="btn-g"
              onClick={onEnter}
              style={{ fontSize: 15, padding: '13px 26px' }}
            >
              <Play size={15} fill="#000" /> {t('landing.cta_demo')}
            </button>
            <button
              className="btn-o"
              style={{ fontSize: 15, padding: '13px 26px' }}
              onClick={handleSpotifyConnect}
            >
              <Radio size={15} /> {t('landing.cta_spotify')}
            </button>
          </div>

          {/* Stats bar */}
          <div
            className="fu d4"
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 'clamp(14px,3vw,28px)',
              marginTop: 42,
              flexWrap: 'wrap',
            }}
          >
            {[
              { value: '847h', label: t('landing.stat_hours') },
              { value: '12.483', label: t('landing.stat_scrobbles') },
              { value: '284', label: t('landing.stat_artists') },
              { value: '#1 The Weeknd', label: t('landing.stat_top') },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div
                  className="syne"
                  style={{ fontSize: 'clamp(15px,2.5vw,19px)', fontWeight: 800 }}
                >
                  {s.value}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(235,231,255,0.33)', marginTop: 2 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="landing-section" style={{ maxWidth: 980, margin: '0 auto' }}>
          <div className="grid-3">
            {[
              {
                Icon: BarChart3,
                color: '#1DB954',
                title: t('landing.feature1_title'),
                desc: t('landing.feature1_desc'),
              },
              {
                Icon: Radio,
                color: '#A78BFA',
                title: t('landing.feature2_title'),
                desc: t('landing.feature2_desc'),
              },
              {
                Icon: Share2,
                color: '#E91E63',
                title: t('landing.feature3_title'),
                desc: t('landing.feature3_desc'),
              },
            ].map((f) => (
              <div key={f.title} className="glass" style={{ padding: 22 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: `${f.color}1E`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 13,
                  }}
                >
                  <f.Icon size={19} color={f.color} />
                </div>
                <div className="syne" style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 7 }}>
                  {f.title}
                </div>
                <div style={{ fontSize: 12.5, color: 'rgba(235,231,255,0.42)', lineHeight: 1.58 }}>
                  {f.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div
          className="landing-how"
          style={{
            maxWidth: 820,
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <div
            className="syne"
            style={{ fontSize: 'clamp(20px,3.5vw,26px)', fontWeight: 800, marginBottom: 7 }}
          >
            {t('landing.how_title')}
          </div>
          <div style={{ color: 'rgba(235,231,255,0.4)', marginBottom: 30, fontSize: 14 }}>
            {t('landing.how_subtitle')}
          </div>
          <div className="grid-steps">
            {[
              { n: '01', title: t('landing.step1_title'), desc: t('landing.step1_desc') },
              { n: '02', title: t('landing.step2_title'), desc: t('landing.step2_desc') },
              { n: '03', title: t('landing.step3_title'), desc: t('landing.step3_desc') },
            ].map((s) => (
              <div key={s.n} className="glass2" style={{ padding: '18px 20px', textAlign: 'left' }}>
                <div
                  className="syne"
                  style={{
                    fontSize: 30,
                    fontWeight: 800,
                    color: 'rgba(29,185,84,0.28)',
                    marginBottom: 7,
                  }}
                >
                  {s.n}
                </div>
                <div className="syne" style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 5 }}>
                  {s.title}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(235,231,255,0.42)', lineHeight: 1.58 }}>
                  {s.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer
          className="landing-footer"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          <span className="syne" style={{ fontSize: 14, fontWeight: 700 }}>
            Unwrapped
          </span>
          <span style={{ fontSize: 12, color: 'rgba(235,231,255,0.3)' }}>
            {t('landing.footer_license')}
          </span>
        </footer>
      </div>
    </div>
  )
}
