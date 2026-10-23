import type { ReactNode } from 'react'

// Auth / session
export interface User {
  id: string
  email: string
  created_at: string
}
export interface Session {
  user: User
  access_token: string
  refresh_token: string
  expires_at: number
}
export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading'

// Crypto / key hierarchy (PRD §2.2, §7.1)
export type VaultKeyHex = string
export type DerivedKey = string
export type RecoveryKey = string
export type RecoveryKeyFormatted = string
export type MasterPassword = string

export interface UserKeys {
  user_id: string
  encrypted_vault_key_by_master: string
  encrypted_vault_key_by_recovery: string
  recovery_key_hash: string
  salt: string
  created_at: string
}

// Vault items (PRD §5.2)
export interface VaultItem {
  id: string
  user_id: string
  site_name: string
  username: string
  encrypted_password: string
  created_at: string
  updated_at: string
}
export interface VaultItemInput {
  site_name: string
  username: string
  password: string
}
export interface DecryptedVaultItem
  extends Omit<VaultItem, 'encrypted_password'> {
  password: string
}
export interface VaultListItemView
  extends Pick<VaultItem, 'id' | 'site_name' | 'username' | 'created_at'> {
  maskedPassword: string
  isRevealed: boolean
  decryptedPassword?: string
  breachWarning?: boolean
}

// Crypto function signatures (PRD §7.1)
export interface CryptoFunctions {
  encryptPassword: (plain: string, vaultKey: string) => string
  decryptPassword: (cipher: string, vaultKey: string) => string
  generateRecoveryKey: () => RecoveryKey
  normalizeRecoveryKey: (input: string) => string
  hashRecoveryKey: (key: string) => string
  decryptVaultKeyWithRecovery: (enc: string, key: string) => string
  reencryptVaultKeyWithMaster: (
    vaultKeyHex: string,
    newMaster: string,
  ) => {
    encrypted_vault_key_by_master: string
    salt: string
  }
  setupVaultKeys: (mp: string) => Promise<{
    recoveryKey: RecoveryKey
    userKeys: UserKeys
  }>
  resetVaultKeys: (mp: string) => Promise<{
    recoveryKey: RecoveryKey
    userKeys: UserKeys
  }>
  unlockVaultKey: (mp: string) => Promise<string>
  migrateLegacyItems: (mp: string, vaultKeyHex: string) => Promise<void>
  sha256Hex: (input: string) => string
}

// Vault store state (Zustand)
export interface VaultStoreState {
  vaultKey: VaultKeyHex | null
  masterPassword: MasterPassword | null
  items: VaultItem[]
  isUnlocked: boolean
  isLoading: boolean
  error: string | null
  unlock: (mp: string) => Promise<void>
  lock: () => void
  fetchItems: () => Promise<void>
  addItem: (i: VaultItemInput) => Promise<void>
  updateItem: (id: string, i: Partial<VaultItemInput>) => Promise<void>
  deleteItem: (id: string) => Promise<void>
  revealPassword: (id: string) => Promise<string>
}

// Third-party integrations (PRD §13.4)
export interface BreachCheck {
  id: string
  user_id: string
  password_hash: string
  is_compromised: boolean
  breach_name?: string
  breach_domain?: string
  checked_at: string
}
export interface BreachCheckResult {
  isCompromised: boolean
  breachNames: string[]
  count: number
}
export interface UserSubscription {
  id: string
  user_id: string
  plan_type: 'free' | 'pro' | 'enterprise'
  status: 'active' | 'canceled' | 'past_due'
  stripe_subscription_id?: string
  current_period_end?: string
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}
export type AnalyticsEventType =
  | 'vault_item_add'
  | 'vault_item_edit'
  | 'vault_item_delete'
  | 'login'
  | 'password_check'
  | 'subscription_view'
export interface UserAnalyticsEvent {
  id: string
  user_id: string
  event_type: AnalyticsEventType
  event_data: Record<string, unknown>
  ip_hash?: string
  user_agent_hash?: string
  created_at: string
}

// Feature flags
export interface FeatureFlags {
  breachCheckingEnabled: boolean
  analyticsOptIn: boolean
  subscriptionEnabled: boolean
}

// Supabase/Edge function response types
export interface ApiError {
  message: string
  code?: string
  status?: number
}
export interface EdgeFunctionResponse<T> {
  data: T | null
  error: ApiError | null
}

// UI props (empty-vault templating)
export interface EmptyVaultProps {}
export interface SetupStepCardProps {
  icon: ReactNode
  title: string
  description: string
  label: string
  actionLabel: string
  onAction: () => void
  variant: 'quick' | 'autofill' | 'critical'
}
export interface BlankStateCardProps {
  icon: ReactNode
  category: string
  title: string
  description: string
  buttonLabel: string
  onButtonClick: () => void
}
export interface ImportModalProps {
  isOpen: boolean
  onClose: () => void
}
export interface NewCredentialModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: {
    title: string
    username: string
    password: string
  }) => void
}
export interface RecoveryModalProps {
  isOpen: boolean
  onClose: () => void
  onCopy: () => void
}
