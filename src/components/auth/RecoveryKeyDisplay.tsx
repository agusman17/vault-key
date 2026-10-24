import { useCallback } from 'react'
import type { RecoveryKey } from '@/types'

interface RecoveryKeyDisplayProps {
  isOpen: boolean
  recoveryKey: RecoveryKey | null
  onClose: () => void
}

export function RecoveryKeyDisplay({ isOpen, recoveryKey, onClose }: RecoveryKeyDisplayProps) {
  const groups = recoveryKey ? recoveryKey.match(/.{1,4}/g) ?? [recoveryKey] : []
  const rawKey = groups.join('-')

  const handleCopy = useCallback(() => {
    void navigator.clipboard.writeText(rawKey)
  }, [rawKey])

  const handleDownload = useCallback(() => {
    const blob = new Blob(
      [
        'CIPHERVAULT EMERGENCY ONE-TIME RECOVERY KEY\n' +
          '===========================================\n' +
          `Base32 Key: ${rawKey}\n` +
          '\n' +
          'WARNING: Store this offline in a physical safe. CipherVault operators\n' +
          'cannot recover data if you lose your Master Password without this token.',
      ],
      { type: 'text/plain' },
    )
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'ciphervault-recovery-key.txt'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [rawKey])

  if (!isOpen || !recoveryKey) return null

  return (
    <div className="mt-space-md bg-surface-container-low rounded-xl p-space-lg shadow-xl relative">
      <div className="flex items-start justify-between pb-space-sm mb-space-sm">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-surface-container text-tertiary flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">encrypted</span>
          </div>
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface leading-snug">
              Emergency Recovery Key
            </h2>
            <p className="font-code-sm text-code-sm text-on-surface-variant">
              Crockford Base32 &bull; 256-bit Entropy
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-on-surface-variant hover:text-on-surface p-1 rounded hover:bg-surface-container"
          type="button"
          aria-label="Dismiss Recovery Panel"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      <div className="p-space-sm bg-surface-container-high rounded-lg mb-space-md flex items-start space-x-2.5">
        <span className="material-symbols-outlined text-error text-[18px] mt-0.5">warning</span>
        <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
          Store this securely offline. Without your Master Password or Recovery Key, your encrypted data cannot be decrypted by anyone, including CipherVault support.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-space-md">
        {groups.map((group, index) => (
          <div
            key={index}
            className="bg-surface-container p-2 rounded text-center flex flex-col justify-center"
          >
            <span className="text-[9px] font-code-sm text-outline">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="font-code-md text-code-md text-on-surface font-semibold tracking-wider">
              {group}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleCopy}
          className="py-2 px-3 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center justify-center space-x-1.5 transition-colors"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">content_copy</span>
          <span>Copy Key</span>
        </button>
        <button
          onClick={handleDownload}
          className="py-2 px-3 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center justify-center space-x-1.5 transition-colors"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">download</span>
          <span>Download (.txt)</span>
        </button>
      </div>
    </div>
  )
}
