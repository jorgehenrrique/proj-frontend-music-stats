import { create } from 'zustand'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
  title?: string
  duration?: number
}

interface ToastState {
  toasts: Toast[]
  add: (toast: Omit<Toast, 'id'>) => void
  remove: (id: string) => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  add: (toast) =>
    set((s) => ({
      toasts: [...s.toasts, { ...toast, id: crypto.randomUUID() }],
    })),
  remove: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

export const toast = {
  success: (message: string, title?: string) =>
    useToastStore.getState().add({ type: 'success', message, title }),
  error: (message: string, title?: string) =>
    useToastStore.getState().add({ type: 'error', message, title }),
  info: (message: string, title?: string) =>
    useToastStore.getState().add({ type: 'info', message, title }),
}
