import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { AuthForm } from '@/components/auth/AuthForm'
import { Alert } from '@/components/core'

export function Login() {
  const navigate = useNavigate()
  const { signInWithPassword, signUp, authStatus, error } = useAuth()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [alertOpen, setAlertOpen] = useState(false)

  const visibleError = serverError || error

  const handleAuth = async (data: { email: string; password: string }) => {
    setIsLoading(true)
    setServerError('')
    setAlertOpen(false)

    try {
      const result =
        mode === 'login'
          ? await signInWithPassword(data.email, data.password)
          : await signUp(data.email, data.password)

      if (!result.success) {
        setServerError(result.error ?? 'Authentication failed')
        setAlertOpen(true)
        setIsLoading(false)
        return
      }

      // Zero-knowledge vault unlock: derive the client-side vault key from the
      // master password via PBKDF2. The salt + encrypted vault key are read from
      // the user_keys table and decrypted by the vault store (next module).
      // deriveKeyFromPassword(data.password, salt) is available in src/lib/crypto.

      navigate('/vault', { replace: true })
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Authentication failed')
      setAlertOpen(true)
      setIsLoading(false)
    }
  }

  if (authStatus === 'loading') {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center text-on-surface font-code-sm text-code-sm">
        Signing in…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AuthForm
        mode={mode}
        onModeChange={setMode}
        onSubmit={handleAuth}
        isLoading={isLoading}
      />
      {visibleError && alertOpen && (
        <div className="fixed top-space-sm left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-space-sm">
          <Alert
            variant="error"
            title="Invalid credentials"
            dismissible
            onDismiss={() => setAlertOpen(false)}
          >
            {visibleError}
          </Alert>
        </div>
      )}
    </div>
  )
}
