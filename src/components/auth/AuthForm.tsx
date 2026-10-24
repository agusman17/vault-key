import { useCallback, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { FormEvent } from 'react'
import { ThemeToggle } from '@/components/core'
import { generateRecoveryKey } from '@/lib/crypto'
import { RecoveryKeyDisplay } from './RecoveryKeyDisplay'

type Mode = 'login' | 'signup'

interface AuthFormProps {
  mode: Mode
  onSubmit: (data: { email: string; password: string }) => void
  onModeChange: (mode: Mode) => void
  isLoading: boolean
}

interface Strength {
  bits: number
  label: string
  color: string
  activeBars: number
}

function computeStrength(value: string): Strength {
  if (value.length === 0) {
    return { bits: 0, label: '0 bits (Empty)', color: 'text-error', activeBars: 0 }
  }
  if (value.length < 8) {
    return { bits: 24, label: '24 bits (Weak)', color: 'text-error', activeBars: 1 }
  }
  if (value.length < 14) {
    return { bits: 58, label: '58.2 bits (Fair)', color: 'text-primary', activeBars: 2 }
  }
  return { bits: 108, label: '108.4 bits (Ultra)', color: 'text-secondary', activeBars: 4 }
}

export function AuthForm({ mode, onSubmit, onModeChange, isLoading }: AuthFormProps) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberEmail, setRememberEmail] = useState(false)
  const [recoveryOpen, setRecoveryOpen] = useState(false)
  const [recoveryKey, setRecoveryKey] = useState<string | null>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)

  const strength = useMemo(() => computeStrength(password), [password])

  const togglePassword = useCallback(() => setShowPassword((prev) => !prev), [])

  const handleOpenRecovery = useCallback(() => {
    if (mode === 'signup' && !recoveryKey) {
      setRecoveryKey(generateRecoveryKey())
    }
    setRecoveryOpen(true)
  }, [mode, recoveryKey])

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault()
      onSubmit({ email, password })
    },
    [email, password, onSubmit],
  )

  const isSignup = mode === 'signup'
  const actionText = isSignup ? 'Derive & Create Master Vault' : 'Unlock Vault'
  const actionIcon = isSignup ? 'add_moderator' : 'lock_clock'

  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center p-space-sm sm:p-space-md">
      <div className="absolute top-space-sm left-0 right-0 px-space-sm sm:px-space-md flex items-center justify-between pb-space-sm mb-space-xs text-on-surface-variant font-code-sm text-code-sm">
        <div className="flex items-center space-x-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(78,222,163,0.6)] animate-pulse" />
          <span className="tracking-wider uppercase">ENGINE: PBKDF2-SHA256 (100k)</span>
        </div>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <span className="text-outline select-none">|</span>
          <span className="flex items-center space-x-1 bg-surface-container-high px-2 py-0.5 rounded text-on-surface">
            <span className="material-symbols-outlined text-secondary">verified_user</span>
            <span>CLIENT-SIDE LOCK</span>
          </span>
        </div>
      </div>

      <div className="w-full max-w-md">
        <div className="bg-surface-container-low rounded-xl shadow-xl overflow-hidden relative">
          <div className="h-0.5 w-full bg-gradient-to-r from-primary/10 via-primary to-secondary/30" />
          <div className="p-space-lg pb-space-md flex flex-col items-center text-center relative">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              VaultKey
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 max-w-xs">
              Zero-Knowledge Client-Side AES-256 Vault Architecture
            </p>
            <div className="grid grid-cols-2 p-1 bg-surface-container-highest rounded-lg w-full mt-space-md">
              <button
                onClick={() => onModeChange('login')}
                className={`py-1.5 px-3 rounded text-center font-label-md text-label-md font-medium transition-all flex items-center justify-center space-x-1.5 ${
                  mode === 'login'
                    ? 'bg-surface-container-low text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">lock_open</span>
                <span>Log In to Vault</span>
              </button>
              <button
                onClick={() => onModeChange('signup')}
                className={`py-1.5 px-3 rounded text-center font-label-md text-label-md font-medium transition-all flex items-center justify-center space-x-1.5 ${
                  mode === 'signup'
                    ? 'bg-surface-container-low text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">shield_person</span>
                <span>Create New Vault</span>
              </button>
            </div>
          </div>

          <div className="px-space-lg pb-space-lg pt-0">
            <form onSubmit={handleSubmit} className="space-y-space-md">
              <div className="space-y-1">
                <label
                  htmlFor="vaultEmail"
                  className="block font-label-md text-label-md text-on-surface-variant"
                >
                  Account Email
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-on-surface-variant material-symbols-outlined text-[18px]">
                    alternate_email
                  </span>
                  <input
                    id="vaultEmail"
                    type="email"
                    placeholder="architect@domain.secure"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    className="w-full bg-surface-container text-on-surface pl-10 pr-3 py-2 rounded font-body-md text-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container-high transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="masterPassword"
                    className="block font-label-md text-label-md text-on-surface-variant"
                  >
                    Master Password
                  </label>
                  <div
                    className="relative group cursor-pointer inline-flex items-center space-x-0.5 text-on-surface-variant hover:text-primary"
                    onClick={togglePassword}
                    role="button"
                    tabIndex={0}
                  >
                    <span className="material-symbols-outlined text-[14px]">info</span>
                    <span className="font-code-sm text-code-sm">Zero-Knowledge</span>
                    <div className="absolute bottom-full right-0 mb-1 hidden group-hover:block w-64 p-2 bg-surface-container-highest text-on-surface rounded shadow-xl text-left font-body-sm text-body-sm leading-tight">
                      Your Master Password never leaves this browser. Used locally via PBKDF2 (100,000 iterations) to derive client-side decryption key.
                    </div>
                  </div>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-on-surface-variant material-symbols-outlined text-[18px]">
                    key
                  </span>
                  <input
                    id="masterPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={showPassword ? '' : '••••••••••••••••••••••••'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    ref={passwordInputRef}
                    className="w-full bg-surface-container text-on-surface font-code-md text-code-md pl-10 pr-10 py-2 rounded tracking-wider placeholder:text-outline focus:outline-none focus:bg-surface-container-high transition-colors"
                  />
                  <button
                    onClick={togglePassword}
                    className="absolute right-3 text-on-surface-variant hover:text-on-surface focus:outline-none p-1"
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>

                <div className="pt-1 space-y-1">
                  <div className="flex items-center justify-between text-code-sm font-code-sm">
                    <span className="text-on-surface-variant">
                      Entropy Strength: <span className={`${strength.color} font-medium`}>{strength.label}</span>
                    </span>
                    <span className="text-outline">
                      Derived in {Math.max(1, Math.round(strength.bits / 8))}ms
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 h-1">
                    {[0, 1, 2, 3].map((index) => (
                      <div
                        key={index}
                        className={`h-full rounded-full transition-all ${
                          index < strength.activeBars
                            ? strength.color.replace('text-', 'bg-')
                            : 'bg-surface-container-highest'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberEmail}
                    onChange={(event) => setRememberEmail(event.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-surface-container checked:bg-primary accent-primary cursor-pointer"
                  />
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Remember email
                  </span>
                </label>
                <a
                  onClick={(event) => {
                    event.preventDefault()
                    navigate('/recovery')
                  }}
                  className="font-label-md text-label-md text-primary hover:underline transition-all"
                >
                  Forgot Master Password?
                </a>
              </div>

              <button
                className={`w-full font-label-lg text-label-lg py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all shadow-md group disabled:opacity-70 ${
                  isLoading
                    ? 'bg-surface-container-high text-on-surface-variant'
                    : 'bg-primary-container text-on-primary-container hover:bg-primary'
                }`}
                disabled={isLoading}
                type="submit"
              >
                <span
                  className={`material-symbols-outlined text-[18px] transition-transform group-hover:scale-110 ${
                    isLoading ? 'animate-spin' : ''
                  }`}
                >
                  {isLoading ? 'refresh' : actionIcon}
                </span>
                <span>{isLoading ? 'Executing Client-Side PBKDF2...' : actionText}</span>
              </button>
            </form>
          </div>

          <div className="relative my-space-md flex items-center justify-center">
            <div className="w-full h-px bg-surface-container-highest" />
            <span className="absolute bg-surface-container-low px-2 font-code-sm text-code-sm text-outline uppercase tracking-wider">
              or verify hardware
            </span>
          </div>

          <button
            className="w-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-60"
            type="button"
            disabled
            aria-label="Unlock with Passkey / WebAuthn"
          >
            <span className="material-symbols-outlined text-[20px] text-primary">fingerprint</span>
            <span>Unlock with Passkey / WebAuthn</span>
          </button>

          <button
            onClick={handleOpenRecovery}
            className="mt-space-md p-space-sm bg-surface-container rounded-lg flex items-center justify-between"
            type="button"
          >
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-[18px] text-tertiary">key_visualizer</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Recovery Kit (PRD F-04)
              </span>
            </div>
            <span className="font-code-sm text-code-sm px-2 py-1 rounded bg-surface-container-highest text-primary hover:bg-surface-bright transition-colors">
              Inspect Key
            </span>
          </button>
        </div>

        <RecoveryKeyDisplay
          isOpen={recoveryOpen}
          recoveryKey={recoveryKey}
          onClose={() => setRecoveryOpen(false)}
        />

        <div className="mt-space-md py-space-xs text-center text-on-surface-variant font-code-sm text-code-sm space-y-1">
          <div className="flex items-center justify-center space-x-3 text-outline">
            <span>PBKDF2-SHA256</span>
            <span>&bull;</span>
            <span>AES-256 Client-Side</span>
            <span>&bull;</span>
            <span>No plaintext transmission</span>
          </div>
        </div>
      </div>
    </div>
  )
}
