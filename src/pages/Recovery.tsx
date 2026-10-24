import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { normalizeRecoveryKey } from '@/lib/crypto'
import { RecoveryKeyDisplay } from '@/components/auth/RecoveryKeyDisplay'
import { Alert } from '@/components/core'

type ResetMode = 'choice' | 'masterPassword' | 'newKey'

export function Recovery() {
  const navigate = useNavigate()
  const [recoveryKey, setRecoveryKey] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [resetMode, setResetMode] = useState<ResetMode | null>(null)
  const [resetNewKey, setResetNewKey] = useState<string | null>(null)
  const [resetMasterPassword, setResetMasterPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRecover = useCallback(async () => {
    setError('')
    setIsLoading(true)

    try {
      const normalized = normalizeRecoveryKey(recoveryKey)

      if (normalized.length === 0) {
        throw new Error('Recovery key is required')
      }

      setIsLoading(false)
      setIsOpen(true)
      navigate('/vault', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Recovery failed')
      setIsLoading(false)
    }
  }, [recoveryKey, navigate])

  const handleResetRecoveryKey = useCallback(async () => {
    setError('')
    setIsLoading(true)

    try {
      if (resetMasterPassword.length === 0) {
        throw new Error('Master password is required')
      }

      const newKey = generateResetRecoveryKey(resetMasterPassword)
      setResetNewKey(newKey)
      setResetMode('newKey')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset failed')
    } finally {
      setIsLoading(false)
    }
  }, [resetMasterPassword])

  const handleGenerateAllDataReset = useCallback(async () => {
    setError('')
    setIsLoading(true)

    try {
      const newKey = generateAllDataResetKey()
      setResetNewKey(newKey)
      setResetMode('newKey')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset failed')
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-space-sm sm:p-space-md">
      <div className="w-full max-w-md">
        <div className="bg-surface-container-low rounded-xl shadow-xl overflow-hidden relative">
          <div className="h-0.5 w-full bg-gradient-to-r from-secondary/10 via-secondary to-tertiary/30" />
          <div className="p-space-lg pb-space-md flex flex-col items-center text-center relative">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              Vault Recovery
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 max-w-xs">
              Enter your emergency recovery key to regain access to your vault.
            </p>
          </div>

          <div className="px-space-lg pb-space-lg pt-0">
            {error && (
              <div className="mb-space-md px-space-md">
                <Alert variant="error" title="Recovery failed" dismissible onDismiss={() => setError('')}>
                  {error}
                </Alert>
              </div>
            )}

            <form onSubmit={(event) => { event.preventDefault(); handleRecover() }} className="space-y-space-md">
              <div className="space-y-1">
                <label
                  htmlFor="recoveryKey"
                  className="block font-label-md text-label-md text-on-surface-variant"
                >
                  Emergency Recovery Key
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-on-surface-variant material-symbols-outlined text-[18px]">
                    key
                  </span>
                  <input
                    id="recoveryKey"
                    type="text"
                    placeholder="JNQG-2DCM-BJX5-4TAF-…"
                    value={recoveryKey}
                    onChange={(event) => setRecoveryKey(event.target.value.toUpperCase().replace(/[^0-9A-Z-]/g, ''))}
                    required
                    maxLength={39}
                    className="w-full bg-surface-container text-on-surface font-code-md text-code-md pl-10 pr-3 py-2 rounded tracking-wider placeholder:text-outline focus:outline-none focus:bg-surface-container-high transition-colors"
                    spellCheck={false}
                    autoCapitalize="characters"
                  />
                </div>
                <p className="font-code-xs text-code-xs text-on-surface-variant mt-0.5">
                  Crockford Base32 &bull; enter the key exactly as shown when it was generated
                </p>
              </div>

              <button
                className={`w-full font-label-lg text-label-lg py-2.5 px-4 rounded-lg flex items-center justify-center transition-all shadow-md group disabled:opacity-70 ${
                  isLoading || recoveryKey.length === 0
                    ? 'bg-surface-container-high text-on-surface-variant'
                    : 'bg-primary text-on-primary hover:bg-primary-fixed'
                }`}
                disabled={isLoading || recoveryKey.length === 0}
                type="submit"
              >
                <span
                  className={`text-[18px] transition-transform group-hover:scale-110 ${
                    isLoading ? 'animate-spin' : ''
                  }`}
                >
                  {isLoading ? 'refresh' : 'vault'}
                </span>
              </button>
              <span className={`font-label-lg text-label-lg ${isLoading || recoveryKey.length === 0 ? 'text-on-surface-variant' : 'text-primary'}`}>
                {isLoading ? 'Recovering vault…' : 'Recover Vault'}
              </span>
            </form>

            <div className="relative my-space-md flex items-center justify-center">
              <div className="w-full h-px bg-surface-container-highest" />
              <span className="absolute bg-surface-container-low px-2 font-code-sm text-code-sm text-outline uppercase tracking-wider">
                or reset lost key
              </span>
            </div>

            <button
              onClick={() => setResetMode('choice')}
              className="w-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">key_visualizer</span>
              <span>Reset Recovery Key</span>
            </button>
          </div>

          <div className="mt-space-md px-space-md text-center text-on-surface-variant font-code-sm text-code-sm space-y-1">
            <button
              onClick={() => navigate('/login', { replace: true })}
              className="font-label-md text-label-md text-primary hover:underline transition-all flex items-center justify-center"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px] mr-1">arrow_back</span>
              Back to Login
            </button>
          </div>
        </div>
      </div>

      {resetMode === 'choice' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-container-lowest/80 backdrop-blur-md p-space-sm">
          <div className="bg-surface-container rounded-xl max-w-md w-full p-space-lg shadow-2xl flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary">key</span>
                <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">
                  Reset Recovery Key
                </h3>
              </div>
              <button
                onClick={() => setResetMode(null)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded hover:bg-surface-container"
                type="button"
                aria-label="Cancel"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Choose how you want to reset your recovery key.
            </p>

            <button
              onClick={handleGenerateAllDataReset}
              className={`w-full font-label-lg text-label-lg py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all shadow-md group disabled:opacity-70 ${
                isLoading ? 'bg-surface-container-high text-on-surface-variant' : 'bg-primary text-on-primary hover:bg-primary-fixed'
              }`}
              disabled={isLoading}
              type="button"
            >
              <span className={`material-symbols-outlined text-[18px] ${isLoading ? 'animate-spin' : ''}`}>
                delete_forever
              </span>
              <span>{isLoading ? 'Resetting…' : 'Reset All Data'}</span>
            </button>
            <p className="font-code-xs text-code-xs text-error-container/60 text-error mt-0.5">
              WARNING: This wipes all existing vault data. You will start with an empty vault.
            </p>

            <button
              onClick={() => setResetMode('masterPassword')}
              className={`w-full font-label-lg text-label-lg py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all shadow-md group disabled:opacity-70 ${
                isLoading ? 'bg-surface-container-high text-on-surface-variant' : 'bg-primary text-on-primary hover:bg-primary-fixed'
              }`}
              disabled={isLoading}
              type="button"
            >
              <span className={`material-symbols-outlined text-[18px] ${isLoading ? 'animate-spin' : ''}`}>
                lock
              </span>
              <span>{isLoading ? 'Verifying…' : 'Use Master Password'}</span>
            </button>
          </div>
        </div>
      )}

      {resetMode === 'masterPassword' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-container-lowest/80 backdrop-blur-md p-space-sm">
          <div className="bg-surface-container rounded-xl max-w-md w-full p-space-lg shadow-2xl flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary">lock</span>
                <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">
                  Verify Master Password
                </h3>
              </div>
              <button
                onClick={() => setResetMode('choice')}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded hover:bg-surface-container"
                type="button"
                aria-label="Back"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              </button>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Enter your master password to verify identity before resetting your recovery key.
            </p>

            <div className="space-y-1">
              <label
                htmlFor="resetMasterPassword"
                className="block font-label-md text-label-md text-on-surface-variant"
              >
                Master Password
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-on-surface-variant material-symbols-outlined text-[18px]">
                  lock
                </span>
                <input
                  id="resetMasterPassword"
                  type="password"
                  placeholder="••••••••••••••••••••••••"
                  value={resetMasterPassword}
                  onChange={(event) => setResetMasterPassword(event.target.value)}
                  required
                  className="w-full bg-surface-container text-on-surface font-code-md text-code-md pl-10 pr-8 py-2 rounded tracking-wider placeholder:text-outline focus:outline-none focus:bg-surface-container-high transition-colors"
                />
              </div>
            </div>

            <button
              onClick={handleResetRecoveryKey}
              className={`w-full font-label-lg text-label-lg py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all shadow-md group disabled:opacity-70 ${
                isLoading || resetMasterPassword.length === 0
                  ? 'bg-surface-container-high text-on-surface-variant'
                  : 'bg-primary text-on-primary hover:bg-primary-fixed'
              }`}
              disabled={isLoading || resetMasterPassword.length === 0}
              type="button"
            >
              <span className={`material-symbols-outlined text-[18px] transition-transform group-hover:scale-110 ${isLoading ? 'animate-spin' : ''}`}>
                {isLoading ? 'refresh' : 'key'}
              </span>
              <span>{isLoading ? 'Resetting…' : 'Reset Recovery Key'}</span>
            </button>
          </div>
        </div>
      )}

      {resetMode === 'newKey' && resetNewKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-container-lowest/80 backdrop-blur-md p-space-sm">
          <div className="bg-surface-container rounded-xl max-w-md w-full p-space-lg shadow-2xl flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary">key</span>
                <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">
                  New Recovery Key Generated
                </h3>
              </div>
              <button
                onClick={() => setResetMode(null)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded hover:bg-surface-container"
                type="button"
                aria-label="Dismiss"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Save this securely offline. You cannot reset your recovery key again without your master password.
            </p>
            <RecoveryKeyDisplay
              isOpen
              recoveryKey={resetNewKey}
              onClose={() => setResetMode(null)}
            />
            <div className="flex items-center justify-end gap-space-sm pt-space-xs">
              <button
                onClick={() => setResetMode(null)}
                className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface bg-surface-container-high hover:bg-surface-bright"
                type="button"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <RecoveryKeyDisplay
        isOpen={isOpen}
        recoveryKey={recoveryKey || null}
        onClose={() => setIsOpen(false)}
      />
    </div>
  )
}

function generateResetRecoveryKey(masterPassword: string): string {
  return normalizeRecoveryKey(masterPassword)
    .replace(/[^0-9A-Z-]/g, '')
    .slice(0, 39)
}

function generateAllDataResetKey(): string {
  const chars = '023456789ABCDEFGHJKLMNPQRSTVWXYZ'
  const bytes = new Uint8Array(20)
  crypto.getRandomValues(bytes)
  let result = ''
  let bits = 0
  let bitCount = 0
  for (const byte of bytes) {
    bits = (bits << 8) | byte
    bitCount += 8
    while (bitCount >= 5) {
      bitCount -= 5
      result += chars[(bits >> bitCount) & 31]
    }
  }
  if (bitCount > 0) {
    result += chars[(bits << (5 - bitCount)) & 31]
  }
  return result.match(/.{1,4}/g)?.join('-') ?? result
}
