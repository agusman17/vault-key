import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { VaultLayout } from '@/components/vault'
import { Login } from '@/pages/Login'
import { Recovery } from '@/pages/Recovery'
import { useAuth } from '@/hooks/useAuth'

function RequireAuth({ children }: { children: ReactNode }) {
  const { authStatus } = useAuth()

  if (authStatus === 'loading') {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center text-on-surface font-code-sm text-code-sm">
        Loading session…
      </div>
    )
  }

  if (authStatus === 'unauthenticated') {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recovery" element={<Recovery />} />
        <Route
          path="/vault"
          element={
            <RequireAuth>
              <VaultLayout />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
