import { useState, useRef, useCallback } from 'react'
import { Upload as UploadIcon, CheckCircle, Loader } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { parseSpotifyHistory } from '@/api/history'
import { useUserStore } from '@/store/userStore'
import { AuroraBlobs } from '@/components/layout/AuroraBlobs'

export function Upload() {
  const { t } = useTranslation()
  const [dragging, setDragging] = useState(false)
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const setHistoryLoaded = useUserStore((s) => s.setHistoryLoaded)

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
        await parseSpotifyHistory(jsonFiles)
        setHistoryLoaded(true)
        setStatus('done')
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erro ao processar.')
        setStatus('error')
      }
    },
    [setHistoryLoaded, t]
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
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <AuroraBlobs />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 680,
          margin: '0 auto',
          padding: 'clamp(32px,5vw,60px) clamp(16px,4vw,24px)',
        }}
      >
        <div className="syne" style={{ fontSize: 'clamp(22px,4vw,28px)', fontWeight: 800, marginBottom: 8 }}>
          {t('upload.title')}
        </div>
        <p style={{ fontSize: 14, color: 'rgba(235,231,255,0.45)', marginBottom: 32 }}>
          {t('upload.subtitle')}
        </p>

        {/* Drop zone */}
        <div
          className="glass"
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            padding: 'clamp(28px,5vw,48px) clamp(16px,3vw,24px)',
            textAlign: 'center',
            cursor: 'pointer',
            border: dragging
              ? '2px dashed #1DB954'
              : '2px dashed rgba(255,255,255,0.12)',
            transition: 'border-color .2s',
            marginBottom: 32,
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".json"
            multiple
            style={{ display: 'none' }}
            onChange={handleChange}
          />
          {status === 'processing' ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <Loader size={36} color="#1DB954" style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: 14, color: 'rgba(235,231,255,0.55)' }}>{t('upload.processing')}</span>
            </div>
          ) : status === 'done' ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <CheckCircle size={36} color="#1DB954" />
              <span style={{ fontSize: 14, color: '#1DB954', fontWeight: 600 }}>
                {t('upload.success')}
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <UploadIcon size={36} color="rgba(235,231,255,0.3)" />
              <div>
                <div style={{ fontSize: 15, fontWeight: 500 }}>{t('upload.drag_drop')}</div>
                <div style={{ fontSize: 12, color: 'rgba(235,231,255,0.38)', marginTop: 4 }}>
                  {t('upload.or')}{' '}
                  <span style={{ textDecoration: 'underline' }}>{t('upload.click_select')}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {status === 'error' && (
          <div
            className="glass2"
            style={{ padding: '12px 16px', marginBottom: 24, color: '#F87171', fontSize: 13 }}
          >
            {error}
          </div>
        )}

        {/* Instructions */}
        <div className="glass" style={{ padding: 'clamp(16px,3vw,24px)' }}>
          <div className="syne" style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>
            {t('upload.how_title')}
          </div>
          {[
            t('upload.step1'),
            t('upload.step2'),
            t('upload.step3'),
            t('upload.step4'),
          ].map((step, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 14,
                marginBottom: 14,
                alignItems: 'flex-start',
              }}
            >
              <div
                className="syne"
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: 'rgba(29,185,84,0.4)',
                  lineHeight: 1.2,
                  flexShrink: 0,
                  width: 24,
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <p style={{ fontSize: 13, color: 'rgba(235,231,255,0.6)', lineHeight: 1.6 }}>{step}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
