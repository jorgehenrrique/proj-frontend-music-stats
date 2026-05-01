import { ToastContainer } from '@/components/ui/Toast'

interface Props {
  children: React.ReactNode
}

export function ToastProvider({ children }: Props) {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  )
}
