import { QueryProvider } from './QueryProvider'
import { ToastProvider } from './ToastProvider'

interface Props {
  children: React.ReactNode
}

export function Providers({ children }: Props) {
  return (
    <QueryProvider>
      <ToastProvider>{children}</ToastProvider>
    </QueryProvider>
  )
}
