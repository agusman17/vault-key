import { useState } from 'react'
import {
  DownloadCloud,
  PlusCircle,
  Lock,
  RefreshCw,
  CheckCircle,
  Key,
  FileText,
  Trash2,
} from 'lucide-react'
import { ImportModal } from './ImportModal'
import { NewCredentialModal } from './NewCredentialModal'
import { RecoveryModal } from './RecoveryModal'
import { SetupStepCard } from './SetupStepCard'
import { BlankStateCard } from './BlankStateCard'
import { CliQuickstart } from './CliQuickstart'
import { ThemeToggle } from '../core/ThemeToggle'

export function EmptyVault() {
  const [importOpen, setImportOpen] = useState(false)
  const [credentialOpen, setCredentialOpen] = useState(false)
  const [recoveryOpen, setRecoveryOpen] = useState(false)

  return (
    <main className="px-gutter-desktop py-space-lg flex flex-col gap-space-xl max-w-7xl mx-auto w-full min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-space-sm">
            <span className="font-code-sm text-code-sm text-primary uppercase tracking-widest bg-surface-container-high px-space-xs py-0.5 rounded">
              PRD SPEC F-03 • F-126
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span className="font-code-sm text-code-sm text-on-surface-variant">
              Local Salt: 0x4f...9e21
            </span>
          </div>
          <h1 className="font-headline-xl text-headline-xl font-semibold text-on-surface tracking-tight">
            Personal Vault
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-space-xs">
            <CheckCircle className="text-body-sm text-secondary" size={16} />
            <span>0 items stored — Zero-knowledge AES-256 client encryption ready</span>
          </p>
        </div>
        <div className="flex items-center gap-space-sm">
          <button
            className="flex items-center gap-space-xs bg-surface-container-high hover:bg-surface-bright text-on-surface px-space-md py-space-sm rounded-lg font-label-lg text-label-lg shadow-sm transition-all"
            onClick={() => setImportOpen(true)}
            type="button"
          >
            <DownloadCloud size={18} />
            <span>Import Vault Data</span>
          </button>
          <button
            className="flex items-center gap-space-xs bg-primary hover:bg-primary-fixed text-on-primary px-space-md py-space-sm rounded-lg font-label-lg text-label-lg shadow-md hover:shadow-lg transition-all"
            onClick={() => setCredentialOpen(true)}
            type="button"
          >
            <PlusCircle size={18} />
            <span>New Credential</span>
          </button>
          <ThemeToggle />
        </div>
      </div>

      <div className="relative overflow-hidden bg-surface-container-low rounded-xl p-space-xl shadow-xl flex flex-col items-center text-center">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-secondary/10 blur-3xl pointer-events-none"></div>
        <div className="relative mb-space-lg flex items-center justify-center">
          <div className="absolute w-44 h-44 rounded-full bg-surface-container-high animate-pulse opacity-40"></div>
          <div className="absolute w-36 h-36 rounded-full bg-primary/10"></div>
          <svg className="relative w-32 h-32 text-primary" fill="none" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeDasharray="4 4" strokeOpacity={0.2} strokeWidth={2}></circle>
            <circle cx="64" cy="64" fill="currentColor" fillOpacity={0.06} r="46" stroke="currentColor" strokeOpacity={0.6} strokeWidth={2}></circle>
            <circle cx="64" cy="64" fill="#0b1326" r="32"></circle>
            <path d="M46 60C46 50.0589 54.0589 42 64 42C73.9411 42 82 50.0589 82 60V66H46V60Z" stroke="#4edea3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={3}></path>
            <rect fill="#3198dc" height={32} rx={4} width={44} x={42} y={66}></rect>
            <circle cx="64" cy="80" fill="#002c47" r={4}></circle>
            <path d="M64 84V89" stroke="#002c47" strokeLinecap="round" strokeWidth={2.5}></path>
            <circle cx="64" cy="64" r="54" stroke="#4edea3" strokeDasharray="16 120" strokeLinecap="round" strokeWidth={2}></circle>
          </svg>
          <span className="absolute -bottom-1 -right-1 px-space-xs py-0.5 rounded bg-secondary text-on-secondary font-code-sm text-code-sm font-semibold tracking-wider shadow-sm">
            AES-GCM
          </span>
        </div>
        <div className="max-w-xl mx-auto flex flex-col gap-space-xs z-10">
          <div className="flex items-center justify-center gap-2">
            <span className="font-code-sm text-code-sm text-secondary bg-secondary-container/20 text-secondary px-space-sm py-0.5 rounded-full uppercase tracking-wider font-semibold">
              Zero-Knowledge Storage
            </span>
          </div>
          <h2 className="font-headline-lg text-headline-lg font-semibold text-on-surface tracking-tight mt-1">
            Your Zero-Knowledge Vault is Empty
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mx-auto">
            All credentials you add here are client-encrypted on your device using your Master Key with <span className="text-on-surface font-medium">AES-256</span> before sync. No one else, not even CipherVault operators, can decrypt them.
          </p>
        </div>
        <div className="mt-space-lg flex flex-wrap items-center justify-center gap-space-md z-10">
          <button
            className="flex items-center gap-space-xs bg-primary hover:bg-primary-fixed text-on-primary font-label-lg text-label-lg px-space-lg py-space-sm rounded-lg shadow-md hover:scale-[1.01] transition-transform"
            onClick={() => setCredentialOpen(true)}
            type="button"
          >
            <Lock size={20} />
            <span>+ Create Your First Password</span>
          </button>
          <button
            className="flex items-center gap-space-xs bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg px-space-lg py-space-sm rounded-lg shadow-sm transition-all"
            onClick={() => setImportOpen(true)}
            type="button"
          >
            <RefreshCw size={20} className="text-primary" />
            <span>Import from Another Manager</span>
          </button>
        </div>
        <div className="mt-space-lg flex items-center justify-center flex-wrap gap-x-space-md gap-y-2 text-outline font-code-sm text-code-sm">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
            Bitwarden
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
            1Password (.1pux)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
            Dashlane
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
            Chrome / Safari CSV
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
            Keepass (.kdbx)
          </span>
        </div>
      </div>

      <div className="bg-surface-container-low rounded-xl p-space-lg flex flex-col gap-space-lg shadow-lg">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm">
          <div>
            <div className="flex items-center gap-space-xs mb-1">
              <span className="w-2 h-2 rounded-full bg-tertiary"></span>
              <span className="font-code-sm text-code-sm text-tertiary uppercase tracking-wider font-semibold">
                Design System Component Registry
              </span>
            </div>
            <h3 className="font-headline-lg text-headline-lg font-semibold text-on-surface">
              Blank State Component Suite
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Production-ready empty card abstractions for categorized folders, passkey hubs, and audit trails.
            </p>
          </div>
          <div className="flex items-center gap-space-xs font-code-sm text-code-sm text-outline bg-surface-container px-space-md py-1.5 rounded-lg">
            <span>{'export { EmptyPasskeys, EmptyNotes, CleanTrash }'}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
          <BlankStateCard
            icon={<Key size={28} />}
            category="F-14 Passkeys"
            title="No Passkeys Found"
            description="Sync FIDO2 WebAuthn cryptographic pairs for hardware keys like YubiKey or platform passkeys."
            buttonLabel="Register Passkey"
            onButtonClick={() => {
              /* no-op template stub */}
            }
          />
          <BlankStateCard
            icon={<FileText size={28} />}
            category="F-22 Secure Notes"
            title="Folder is Empty"
            description="Store markdown memos, SSH configuration keys, Wi-Fi passwords, or server recovery instructions."
            buttonLabel="Add Secure Note"
            onButtonClick={() => {
              /* no-op template stub */}
            }
          />
          <BlankStateCard
            icon={<Trash2 size={28} />}
            category="F-89 Recycle Bin"
            title="Trash is Clean"
            description="Deleted credentials remain recoverable here for 30 days before zero-fill memory sanitization."
            buttonLabel="Zero Trashed Records"
            onButtonClick={() => {
              /* no-op template stub */}
            }
          />
        </div>
      </div>

      <div className="bg-surface-container-low rounded-xl p-space-lg flex flex-col gap-space-lg shadow-lg">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm">
          <div>
            <div className="flex items-center gap-space-xs mb-1">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span className="font-code-sm text-code-sm text-primary uppercase tracking-wider font-semibold">
                First-Time Setup Protocols
              </span>
            </div>
            <h3 className="font-headline-lg text-headline-lg font-semibold text-on-surface">
              First-Time Setup Protocols
            </h3>
            <span className="font-code-sm text-code-sm text-on-surface-variant bg-surface-container px-space-sm py-1 rounded">
              PRD F-04 / F-06
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
          <SetupStepCard
            icon={<DownloadCloud size={28} />}
            title="Import Credentials"
            description="Quickly migrate from 1Password, Bitwarden, Apple Keychain, or encrypted CSV in seconds without plaintext exposure."
            label="Quick Step"
            actionLabel="Start Migration"
            onAction={() => setImportOpen(true)}
            variant="quick"
          />
          <SetupStepCard
            icon={<FileText size={28} />}
            title="Install Browser Extension"
            description="Enable instant biometric unlock, inline credentials capture, and 1-click token insertion across Chrome, Firefox, and Safari."
            label="Autofill Active"
            actionLabel="Get Extension (v3.4.1)"
            onAction={() => {
              /* no-op template stub */}
            }
            variant="autofill"
          />
          <SetupStepCard
            icon={<Key size={28} />}
            title="Verify Recovery Key Backup"
            description="Ensure you have saved your 32-character Crockford Base32 recovery emergency kit. Without it, forgotten keys cannot be reset."
            label="Critical"
            actionLabel="Inspect Recovery Kit"
            onAction={() => setRecoveryOpen(true)}
            variant="critical"
          />
        </div>
      </div>

      <CliQuickstart />

      <ImportModal isOpen={importOpen} onClose={() => setImportOpen(false)} />
      <NewCredentialModal
        isOpen={credentialOpen}
        onClose={() => setCredentialOpen(false)}
        onSave={() => {}}
      />
      <RecoveryModal
        isOpen={recoveryOpen}
        onClose={() => setRecoveryOpen(false)}
        onCopy={() => {}}
      />
    </main>
  )
}
