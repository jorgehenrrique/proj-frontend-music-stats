import { useState } from 'react'
import { Providers } from './providers'
import { Landing } from '@/pages/Landing'
import { Dashboard } from '@/pages/Dashboard'
import { Callback } from '@/pages/Callback'
import '@/i18n'

type Page = 'landing' | 'dashboard' | 'callback'

function detectInitialPage(): Page {
  const params = new URLSearchParams(window.location.search)
  if (params.has('code') || params.has('error')) return 'callback'
  return 'landing'
}

export default function App() {
  const [page, setPage] = useState<Page>(detectInitialPage)
  return (
    <Providers>
      {page === 'callback' && (
        <Callback
          onSuccess={() => setPage('dashboard')}
          onError={() => setPage('landing')}
        />
      )}
      {page === 'landing' && (
        <Landing onEnter={() => setPage('dashboard')} />
      )}
      {page === 'dashboard' && (
        <Dashboard onBack={() => setPage('landing')} />
      )}
    </Providers>
  )
}
