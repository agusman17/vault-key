import { RefreshCw, Key, Database, FolderArchive, UploadCloud, X, Shield } from 'lucide-react'
import type { ImportModalProps } from '@/types'

export function ImportModal({ isOpen, onClose }: ImportModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-container-lowest/80 backdrop-blur-md p-space-md">
      <div className="bg-surface-container rounded-xl max-w-xl w-full p-space-lg shadow-2xl flex flex-col gap-space-md relative">
        <div className="flex items-center justify-between pb-space-xs">
          <div className="flex items-center gap-space-xs">
            <RefreshCw className="text-primary" />
            <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">
              Import Password Archive
            </h3>
          </div>
          <button
            className="text-outline hover:text-on-surface"
            onClick={onClose}
            type="button"
          >
            <X />
          </button>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Files are decrypted in client-memory and transformed into zero-knowledge CipherVault records. Unencrypted raw secrets are never transmitted.
        </p>
        <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
          <button className="flex items-center gap-space-sm p-space-sm bg-surface-container-high hover:bg-surface-bright rounded-lg text-left" type="button">
            <Shield className="text-primary" />
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-on-surface font-semibold">
                Bitwarden
              </span>
              <span className="font-code-sm text-code-sm text-outline">
                .json (encrypted/plain)
              </span>
            </div>
          </button>
          <button className="flex items-center gap-space-sm p-space-sm bg-surface-container-high hover:bg-surface-bright rounded-lg text-left" type="button">
            <Key className="text-secondary" />
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-on-surface font-semibold">
                1Password
              </span>
              <span className="font-code-sm text-code-sm text-outline">
                .1pux archive
              </span>
            </div>
          </button>
          <button className="flex items-center gap-space-sm p-space-sm bg-surface-container-high hover:bg-surface-bright rounded-lg text-left" type="button">
            <Database className="text-tertiary" />
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-on-surface font-semibold">
                Chrome / Safari
              </span>
              <span className="font-code-sm text-code-sm text-outline">
                standard .csv
              </span>
            </div>
          </button>
          <button className="flex items-center gap-space-sm p-space-sm bg-surface-container-high hover:bg-surface-bright rounded-lg text-left" type="button">
            <FolderArchive className="text-outline" />
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-on-surface font-semibold">
                KeePass
              </span>
              <span className="font-code-sm text-code-sm text-outline">
                .kdbx v3/v4
              </span>
            </div>
          </button>
        </div>
        <div className="p-space-lg bg-surface-container-lowest rounded-lg border-dashed border-2 border-outline/30 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-surface-container-high/40 transition-colors">
          <UploadCloud className="text-headline-lg text-primary mb-1" />
          <span className="font-label-lg text-label-lg text-on-surface">
            Drop archive file here or click to browse
          </span>
          <span className="font-code-sm text-code-sm text-outline mt-1">
            AES-GCM client validation before injection
          </span>
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
              onClose()
            }}
            type="button"
          >
            Process Import
          </button>
        </div>
      </div>
    </div>
  )
}
