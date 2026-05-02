import { useState } from 'react'
import { Music2, Radio, Check, X, Loader } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/authStore'
import { initiateSpotifyAuth } from '@/api/spotify'
import { lastfmApi } from '@/api/lastfm'
import { AuroraBlobs } from '@/components/layout/AuroraBlobs'
import { toast } from '@/store/toastStore'

type LastfmState = 'idle' | 'input' | 'validating' | 'error'

interface Props {
  onContinue?: () => void
  onBack?: () => void
}

export function Connect({ onContinue, onBack }: Props) {
  const { t } = useTranslation()
  const { spotify, lastfmUsername, clearSpotify, clearLastfm, setLastfm } = useAuthStore()
  const isSpotifyConnected = !!spotify

  const [lastfmState, setLastfmState] = useState<LastfmState>('idle')
  const [inputValue, setInputValue] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  function handleSpotifyConnect() {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string
    const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI as string
    if (!clientId || clientId === 'your_spotify_client_id_here') {
      toast.error(t('connect.spotify_missing_client_id'), t('connect.spotify_not_configured'))
      return
    }
    if (!redirectUri || redirectUri === 'your_redirect_uri_here') {
      toast.error(t('connect.spotify_missing_redirect'), t('connect.spotify_not_configured'))
      return
    }
    initiateSpotifyAuth()
  }

  function handleLastfmConnect() {
    const apiKey = import.meta.env.VITE_LASTFM_API_KEY as string
    if (!apiKey || apiKey === 'your_lastfm_api_key_here') {
      toast.error(t('connect.lastfm_missing_key'), t('connect.lastfm_not_configured'))
      return
    }
    setLastfmState('input')
  }

  async function handleLastfmConfirm() {
    const username = inputValue.trim()
    if (!username) return

    setLastfmState('validating')
    setErrorMsg('')

    try {
      const result = await lastfmApi.getUser(username)
      // getUser throws on 4xx; if it returns, user exists
      setLastfm('', result.user.name)
      setLastfmState('idle')
      setInputValue('')
    } catch (e) {
      const msg = e instanceof Error && e.message.toLowerCase().includes('user not found')
        ? t('connect.lastfm_not_found')
        : t('connect.lastfm_error')
      setErrorMsg(msg)
      setLastfmState('error')
    }
  }

  function handleLastfmCancel() {
    setLastfmState('idle')
    setInputValue('')
    setErrorMsg('')
  }

  function handleDisconnectLastfm() {
    clearLastfm()
    setLastfmState('idle')
    setInputValue('')
    setErrorMsg('')
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <AuroraBlobs />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 600,
          margin: '0 auto',
          padding: 'clamp(32px,5vw,60px) clamp(16px,4vw,24px)',
        }}
      >
        <div className="syne" style={{ fontSize: 'clamp(22px,4vw,28px)', fontWeight: 800, marginBottom: 8 }}>
          {t('connect.title')}
        </div>
        <p style={{ fontSize: 14, color: 'rgba(235,231,255,0.45)', marginBottom: 32 }}>
          {t('connect.subtitle')}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* ── Spotify ─────────────────────────────────────────── */}
          <div className="glass" style={{ padding: 'clamp(14px,3vw,22px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 12,
                  background: 'rgba(29,185,84,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Music2 size={22} color="#1DB954" />
              </div>
              <div style={{ flex: 1, minWidth: 120 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>Spotify</div>
                <div style={{ fontSize: 12, color: 'rgba(235,231,255,0.42)', marginTop: 2 }}>
                  {t('connect.spotify_desc')}
                </div>
              </div>
              {isSpotifyConnected ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Check size={14} color="#1DB954" />
                    <span style={{ fontSize: 12, color: '#1DB954' }}>{t('connect.connected')}</span>
                  </div>
                  <button
                    className="btn-o"
                    style={{ padding: '6px 14px', fontSize: 12 }}
                    onClick={clearSpotify}
                  >
                    {t('connect.disconnect')}
                  </button>
                </div>
              ) : (
                <button
                  className="btn-g"
                  style={{ padding: '8px 18px', fontSize: 13 }}
                  onClick={handleSpotifyConnect}
                >
                  {t('connect.connect')}
                </button>
              )}
            </div>
          </div>

          {/* ── Last.fm ──────────────────────────────────────────── */}
          <div className="glass" style={{ padding: 'clamp(14px,3vw,22px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 12,
                  background: 'rgba(239,68,68,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Radio size={22} color="#F87171" />
              </div>
              <div style={{ flex: 1, minWidth: 120 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>Last.fm</div>
                <div style={{ fontSize: 12, color: 'rgba(235,231,255,0.42)', marginTop: 2 }}>
                  {t('connect.lastfm_desc')}
                </div>
              </div>

              {lastfmUsername ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Check size={14} color="#F87171" />
                    <span style={{ fontSize: 12, color: '#F87171' }}>{lastfmUsername}</span>
                  </div>
                  <button
                    className="btn-o"
                    style={{ padding: '6px 14px', fontSize: 12 }}
                    onClick={handleDisconnectLastfm}
                  >
                    <X size={12} /> {t('connect.disconnect')}
                  </button>
                </div>
              ) : lastfmState === 'idle' ? (
                <button
                  className="btn-o"
                  style={{ padding: '8px 18px', fontSize: 13 }}
                  onClick={handleLastfmConnect}
                >
                  {t('connect.connect')}
                </button>
              ) : null}
            </div>

            {/* Username input — shown inline below the header row */}
            {!lastfmUsername && (lastfmState === 'input' || lastfmState === 'validating' || lastfmState === 'error') && (
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value)
                      if (lastfmState === 'error') setLastfmState('input')
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleLastfmConfirm()}
                    placeholder={t('connect.lastfm_placeholder')}
                    disabled={lastfmState === 'validating'}
                    autoFocus
                    style={{
                      flex: 1,
                      minWidth: 160,
                      padding: '9px 14px',
                      borderRadius: 50,
                      border: `1px solid ${lastfmState === 'error' ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.12)'}`,
                      background: 'rgba(255,255,255,0.06)',
                      color: '#EBE7FF',
                      fontSize: 13,
                      outline: 'none',
                      backdropFilter: 'blur(10px)',
                    }}
                  />
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      className="btn-g"
                      style={{ padding: '8px 16px', fontSize: 13 }}
                      onClick={handleLastfmConfirm}
                      disabled={lastfmState === 'validating' || !inputValue.trim()}
                    >
                      {lastfmState === 'validating' ? (
                        <Loader size={13} style={{ animation: 'spin 1s linear infinite' }} />
                      ) : null}
                      {lastfmState === 'validating' ? t('connect.lastfm_validating') : t('connect.lastfm_confirm')}
                    </button>
                    <button
                      className="btn-o"
                      style={{ padding: '8px 14px', fontSize: 13 }}
                      onClick={handleLastfmCancel}
                      disabled={lastfmState === 'validating'}
                    >
                      {t('connect.lastfm_cancel')}
                    </button>
                  </div>
                </div>

                {lastfmState === 'error' && errorMsg && (
                  <div style={{ fontSize: 12, color: '#F87171', paddingLeft: 4 }}>
                    {errorMsg}
                  </div>
                )}

                <div style={{ fontSize: 11, color: 'rgba(235,231,255,0.3)', paddingLeft: 4 }}>
                  {t('connect.lastfm_note')}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Last.fm explanation */}
        {!lastfmUsername && (
          <div
            className="glass"
            style={{
              marginTop: 14,
              padding: 'clamp(14px,3vw,20px)',
              borderLeft: '3px solid rgba(239,68,68,0.35)',
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
              {t('connect.lastfm_why_title')}
            </div>
            <p style={{ fontSize: 12.5, color: 'rgba(235,231,255,0.5)', lineHeight: 1.7, margin: 0 }}>
              {t('connect.lastfm_why_desc')}
            </p>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, marginTop: 28, flexWrap: 'wrap' }}>
          {onContinue && (
            <button className="btn-g" style={{ padding: '10px 24px', fontSize: 14 }} onClick={onContinue}>
              {t('connect.continue')}
            </button>
          )}
          {onBack && (
            <button className="btn-o" style={{ padding: '10px 20px', fontSize: 13 }} onClick={onBack}>
              {t('connect.skip')}
            </button>
          )}
        </div>

      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
