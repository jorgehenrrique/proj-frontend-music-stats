import { useEffect, useRef } from 'react'
import { Loader } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { exchangeSpotifyCode } from '@/api/spotify'
import { spotifyApi } from '@/api/spotify'
import { useUserStore } from '@/store/userStore'
import { useAuthStore } from '@/store/authStore'
import { AuroraBlobs } from '@/components/layout/AuroraBlobs'

type CallbackStatus = 'processing' | 'success' | 'error'

interface Props {
  onSuccess: () => void
  onError: () => void
}

export function Callback({ onSuccess, onError }: Props) {
  const { t } = useTranslation()
  const statusRef = useRef<CallbackStatus>('processing')
  const ranRef = useRef(false)

  useEffect(() => {
    if (ranRef.current) return
    ranRef.current = true

    async function handleCallback() {
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')
      const state = params.get('state')
      const error = params.get('error')

      // Clean URL so the code can't be re-used on refresh
      window.history.replaceState({}, '', window.location.pathname)

      if (error) {
        statusRef.current = 'error'
        onError()
        return
      }

      if (!code || !state) {
        statusRef.current = 'error'
        onError()
        return
      }

      const savedState = sessionStorage.getItem('spotify_state')
      if (state !== savedState) {
        // State mismatch — possible CSRF
        statusRef.current = 'error'
        onError()
        return
      }

      try {
        await exchangeSpotifyCode(code)

        // Fetch and store the user profile right after auth
        const user = await spotifyApi.getMe()
        useUserStore.getState().setSpotifyUser(user)

        statusRef.current = 'success'
        onSuccess()
      } catch {
        useAuthStore.getState().clearSpotify()
        statusRef.current = 'error'
        onError()
      }
    }

    handleCallback()
  }, [onSuccess, onError])

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <AuroraBlobs />
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <Loader
          size={36}
          color="#1DB954"
          style={{ animation: 'spin 1s linear infinite', marginBottom: 16 }}
        />
        <div className="syne" style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
          {t('callback.connecting')}
        </div>
        <div style={{ fontSize: 13, color: 'rgba(235,231,255,0.45)' }}>
          {t('callback.wait')}
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
