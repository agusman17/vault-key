import { useState } from 'react'
import { UserPlus, X, Eye, EyeOff } from 'lucide-react'
import type { NewCredentialModalProps } from '@/types'

export function NewCredentialModal({
  isOpen,
  onClose,
  onSave,
}: NewCredentialModalProps) {
  const [showPassword, setShowPassword] = useState(false)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-container-lowest/80 backdrop-blur-md p-space-md">
      <div className="bg-surface-container rounded-xl max-w-lg w-full p-space-lg shadow-2xl flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <UserPlus className="text-secondary" />
            <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">
              Add Secure Item
            </h3>
          </div>
          <button className="text-outline hover:text-on-surface" onClick={onClose} type="button">
            <X />
          </button>
        </div>
        <div className="space-y-space-sm">
          <div>
            <label className="font-label-md text-label-md text-outline block mb-1">
              Item Title / Service
            </label>
            <input
              className="w-full bg-surface-container-high rounded-lg px-space-md py-space-xs text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-bright"
              placeholder="e.g. GitHub Enterprise, AWS Production"
              type="text"
            />
          </div>
          <div>
            <label className="font-label-md text-label-md text-outline block mb-1">
              Username / Identifier
            </label>
            <input
              className="w-full bg-surface-container-high rounded-lg px-space-md py-space-xs text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-bright"
              placeholder="alex.morgan@acme.dev"
              type="text"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-label-md text-label-md text-outline">
                Master Secret / Password
              </label>
              <span className="font-code-sm text-code-sm text-secondary font-semibold">
                128-bit Entropy
              </span>
            </div>
            <div className="relative">
              <input
                className="w-full bg-surface-container-high rounded-lg px-space-md py-space-xs text-on-surface font-code-md text-code-md pr-10 focus:outline-none focus:bg-surface-bright"
                type={showPassword ? 'text' : 'password'}
                value="kX8$mP#9920vL-alpha"
                readOnly
              />
              <button
                className="absolute right-space-sm top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-space-sm pt-space-xs">
          <button
            className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-surface bg-surface-container-high hover:bg-surface-bright"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="px-space-md py-space-xs rounded-lg font-label-md text-label-md text-on-primary bg-primary hover:bg-primary-fixed"
            onClick={() => {
              onSave({
                title: '',
                username: '',
                password: 'kX8$mP#9920vL-alpha',
              })
            }}
            type="button"
          >
            Encrypt & Save
          </button>
        </div>
      </div>
    </div>
  )
}
