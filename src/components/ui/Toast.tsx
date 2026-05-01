import { useEffect, useRef } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { useToastStore, type Toast } from '@/store/toastStore'

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
}

const COLORS = {
  success: '#1DB954',
  error: '#F87171',
  info: '#A78BFA',
}

function ToastItem({ toast }: { toast: Toast }) {
  const remove = useToastStore((s) => s.remove)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    timerRef.current = setTimeout(() => remove(toast.id), toast.duration ?? 4000)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [toast.id, toast.duration, remove])

  const Icon = ICONS[toast.type]
  const color = COLORS[toast.type]

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 11,
        padding: '13px 15px',
        background: 'rgba(14,14,35,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${color}33`,
        borderLeft: `3px solid ${color}`,
        borderRadius: 13,
        boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)`,
        minWidth: 280,
        maxWidth: 360,
        animation: 'toast-in .25s cubic-bezier(.34,1.56,.64,1)',
      }}
    >
      <Icon size={16} color={color} style={{ flexShrink: 0, marginTop: 1 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        {toast.title && (
          <div style={{ fontSize: 13, fontWeight: 600, color: '#EBE7FF', marginBottom: 2 }}>
            {toast.title}
          </div>
        )}
        <div style={{ fontSize: 12, color: 'rgba(235,231,255,0.6)', lineHeight: 1.5 }}>
          {toast.message}
        </div>
      </div>
      <button
        onClick={() => remove(toast.id)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 2,
          color: 'rgba(235,231,255,0.3)',
          flexShrink: 0,
          lineHeight: 1,
        }}
      >
        <X size={13} />
      </button>
    </div>
  )
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)

  return (
    <>
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateX(24px) scale(0.95); }
          to   { opacity: 1; transform: translateX(0)    scale(1);    }
        }
      `}</style>
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          pointerEvents: toasts.length ? 'auto' : 'none',
        }}
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </div>
    </>
  )
}
