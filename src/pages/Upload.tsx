import { useState, useRef, useCallback } from 'react'
import { Upload as UploadIcon, CheckCircle, Loader, ArrowRight, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { parseSpotifyHistory } from '@/api/history'
import { useUserStore } from '@/store/userStore'
import { useHistoryStore } from '@/store/historyStore'
import { AuroraBlobs } from '@/components/layout/AuroraBlobs'

const PLATFORM_COLORS: Record<string, string> = {
  Android: '#1DB954',
  iOS: '#A78BFA',
  'Web Player': '#06B6D4',
  macOS: '#F59E0B',
  Windows: '#3B82F6',
  Linux: '#EC4899',
  Chromecast: '#F97316',
  TV: '#8B5CF6',
  Console: '#EF4444',
  Speaker: '#10B981',
  Outro: 'rgba(235,231,255,0.2)',
  Desconhecido: 'rgba(235,231,255,0.15)',
}

function PlatformChart({ byPlatform }: { byPlatform: Record<string, number> | undefined }) {
  if (!byPlatform || Object.keys(byPlatform).length === 0) return null
  const total = Object.values(byPlatform).reduce((s, n) => s + n, 0)
  const sorted = Object.entries(byPlatform).sort(([, a], [, b]) => b - a)

  return (
    <div className="glass2" style={{ padding: '16px 18px', marginBottom: 24 }}>
      <div className="syne" style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
        Dispositivos de reprodução
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sorted.map(([name, count]) => {
          const pct = Math.round((count / total) * 100)
          const color = PLATFORM_COLORS[name] ?? 'rgba(235,231,255,0.3)'
          return (
            <div key={name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: 'rgba(235,231,255,0.7)' }}>{name}</span>
                <span style={{ fontSize: 12, color: 'rgba(235,231,255,0.38)', fontVariantNumeric: 'tabular-nums' }}>
                  {count.toLocaleString()} · {pct}%
                </span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${pct}%`,
                    borderRadius: 2,
                    background: color,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface Props {
  onDone?: () => void
}

export function Upload({ onDone }: Props) {
  const { t } = useTranslation()
  const setHistoryLoaded = useUserStore((s) => s.setHistoryLoaded)
  const setHistory = useHistoryStore((s) => s.setHistory)
  const clearHistory = useHistoryStore((s) => s.clearHistory)
  const existingHistory = useHistoryStore((s) => s.history)
  const [dragging, setDragging] = useState(false)
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>(
    existingHistory ? 'done' : 'idle'
  )
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const processFiles = useCallback(
    async (files: File[]) => {
      const jsonFiles = files.filter((f) => f.name.endsWith('.json'))
      if (!jsonFiles.length) {
        setError(t('upload.error_json'))
        setStatus('error')
        return
      }
      setStatus('processing')
      try {
        const result = await parseSpotifyHistory(jsonFiles)
        setHistory(result)
        setHistoryLoaded(true)
        setStatus('done')
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erro ao processar.')
        setStatus('error')
      }
    },
    [setHistory, setHistoryLoaded, t]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      processFiles(Array.from(e.dataTransfer.files))
    },
    [processFiles]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) processFiles(Array.from(e.target.files))
    },
    [processFiles]
  )

  return (
    <div style={{ position: 'relative' }}>
      <AuroraBlobs />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 680,
          margin: '0 auto',
          padding: 'clamp(24px,4vw,48px) clamp(16px,4vw,24px)',
        }}
      >
        <div className="syne" style={{ fontSize: 'clamp(20px,4vw,26px)', fontWeight: 800, marginBottom: 6 }}>
          {t('upload.title')}
        </div>
        <p style={{ fontSize: 13.5, color: 'rgba(235,231,255,0.45)', marginBottom: 8, lineHeight: 1.6 }}>
          {t('upload.subtitle')}
        </p>
        <p style={{ fontSize: 12.5, color: 'rgba(235,231,255,0.3)', marginBottom: 28, lineHeight: 1.6 }}>
          {t('upload.why')}
        </p>


        {/* Drop zone */}
        <div
          className="glass"
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => status !== 'processing' && status !== 'done' && inputRef.current?.click()}
          style={{
            padding: 'clamp(24px,5vw,40px) clamp(16px,3vw,24px)',
            textAlign: 'center',
            cursor: status === 'processing' || status === 'done' ? 'default' : 'pointer',
            border: dragging ? '2px dashed #1DB954' : '2px dashed rgba(255,255,255,0.12)',
            transition: 'border-color .2s',
            marginBottom: 24,
          }}
        >
          <input ref={inputRef} type="file" accept=".json" multiple style={{ display: 'none' }} onChange={handleChange} />
          {status === 'processing' ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <Loader size={32} color="#1DB954" style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: 14, color: 'rgba(235,231,255,0.55)' }}>{t('upload.processing')}</span>
            </div>
          ) : status === 'done' ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <CheckCircle size={32} color="#1DB954" />
              <span style={{ fontSize: 14, color: '#1DB954', fontWeight: 600 }}>{t('upload.success')}</span>
              {existingHistory && (
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <span style={{ fontSize: 12, color: 'rgba(235,231,255,0.5)' }}>
                    <span style={{ color: '#1DB954', fontWeight: 700 }}>{existingHistory.totalPlays.toLocaleString()}</span> reproduções
                  </span>
                  <span style={{ fontSize: 12, color: 'rgba(235,231,255,0.5)' }}>
                    <span style={{ color: '#A78BFA', fontWeight: 700 }}>{existingHistory.uniqueArtists.size.toLocaleString()}</span> artistas
                  </span>
                  <span style={{ fontSize: 12, color: 'rgba(235,231,255,0.5)' }}>
                    <span style={{ color: '#06B6D4', fontWeight: 700 }}>{Math.round(existingHistory.totalMs / 3600000).toLocaleString()}h</span> ouvidas
                  </span>
                </div>
              )}
              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                {onDone && (
                  <button className="btn-g" onClick={onDone}>
                    {t('upload.go_to_stats')} <ArrowRight size={14} />
                  </button>
                )}
                <button
                  className="btn-g"
                  style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(235,231,255,0.6)' }}
                  onClick={(e) => { e.stopPropagation(); setStatus('idle'); inputRef.current?.click() }}
                >
                  {t('upload.replace')}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <UploadIcon size={32} color="rgba(235,231,255,0.3)" />
              <div>
                <div style={{ fontSize: 15, fontWeight: 500 }}>{t('upload.drag_drop')}</div>
                <div style={{ fontSize: 12, color: 'rgba(235,231,255,0.38)', marginTop: 4 }}>
                  {t('upload.or')} <span style={{ textDecoration: 'underline' }}>{t('upload.click_select')}</span>
                </div>
                <div style={{ fontSize: 11.5, color: 'rgba(235,231,255,0.25)', marginTop: 8 }}>
                  Streaming_History_Audio_*.json
                </div>
              </div>
            </div>
          )}
        </div>

        {status === 'error' && (
          <div className="glass2" style={{ padding: '12px 16px', marginBottom: 24, color: '#F87171', fontSize: 13 }}>
            {error}
          </div>
        )}

        {/* Platform breakdown */}
        {existingHistory && (
          <PlatformChart byPlatform={existingHistory.byPlatform} />
        )}

        {/* Instructions */}
        <div className="glass" style={{ padding: 'clamp(16px,3vw,22px)' }}>
          <div className="syne" style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>
            {t('upload.how_title')}
          </div>
          {[t('upload.step1'), t('upload.step2'), t('upload.step3'), t('upload.step4')].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 12, alignItems: 'flex-start' }}>
              <div className="syne" style={{ fontSize: 16, fontWeight: 800, color: 'rgba(29,185,84,0.4)', lineHeight: 1.2, flexShrink: 0, width: 24 }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <p style={{ fontSize: 13, color: 'rgba(235,231,255,0.6)', lineHeight: 1.6, margin: 0 }}>{step}</p>
            </div>
          ))}
          <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(245,158,11,0.08)', borderRadius: 10, border: '1px solid rgba(245,158,11,0.15)' }}>
            <p style={{ fontSize: 12, color: 'rgba(245,158,11,0.7)', lineHeight: 1.6, margin: 0 }}>
              {t('upload.note')}
            </p>
          </div>
        </div>

        {existingHistory && (
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <button
              onClick={() => {
              clearHistory()
              setHistoryLoaded(false)
              setStatus('idle')
              localStorage.removeItem('unwrapped-history')
            }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                color: 'rgba(235,231,255,0.25)',
                padding: '6px 10px',
                borderRadius: 6,
                transition: 'color .2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#F87171')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(235,231,255,0.25)')}
            >
              <Trash2 size={12} />
              {t('upload.clear')}
            </button>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
