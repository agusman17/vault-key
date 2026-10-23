import { Key as KeyIcon, X } from 'lucide-react'
import type { RecoveryModalProps } from '@/types'

export function RecoveryModal({
  isOpen,
  onClose,
  onCopy,
}: RecoveryModalProps) {
  if (!isOpen) return null

  const segments = [
    { index: '01', value: 'W7X9-K2L1' },
    { index: '02', value: '90PQ-ZZ41' },
    { index: '03', value: 'A82M-N190' },
    { index: '04', value: 'FF89-10VK' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-container-lowest/80 backdrop-blur-md p-space-md">
      <div className="bg-surface-container rounded-xl max-w-xl w-full p-space-lg shadow-2xl flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <KeyIcon className="text-error" />
            <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">
              Crockford Base32 Recovery Package
            </h3>
          </div>
          <button className="text-outline hover:text-on-surface" onClick={onClose} type="button">
            <X />
          </button>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          This key is mathematically derived from your argon2id master digest. If lost, no human support operator can recover your vault.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-surface-container-lowest p-space-md rounded-lg">
          {segments.map((seg) => (
            <div key={seg.index} className="p-2 bg-surface-container rounded flex flex-col">
              <span className="font-code-sm text-code-sm text-outline">
                {seg.index}
              </span>
              <span className="font-code-md text-code-md font-semibold text-primary">
                {seg.value}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end gap-space-sm pt-space-xs">
          <button
            className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface bg-surface-container-high hover:bg-surface-bright"
            onClick={onClose}
            type="button"
          >
            Dismiss
          </button>
          <button
            className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-primary bg-primary hover:bg-primary-fixed"
            onClick={() => {
              onCopy()
            }}
            type="button"
          >
            Copy Raw Package
          </button>
        </div>
      </div>
    </div>
  )
}
