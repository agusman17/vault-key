# Password Manager Web Application — Product Requirements Document (PRD)

---

## 1. Project Overview

**Project Name:** Password Manager Web Application  
**Type:** Client-side encrypted password vault  
**Stack:** React 19 (Vite) + Tailwind CSS 4 + Supabase (PostgreSQL, Auth, RLS)  
**Encryption:** Client-side AES-256 via CryptoJS, PBKDF2 (100,000 iterations) for key derivation  
**Architecture:** Zero-knowledge — server never sees master password, vault key, or plaintext secrets

---

## 2. Core Concepts

### 2.1 Zero-Knowledge Model
- **Master Password (Akun Password):** User-chosen password, never sent to server. Used locally to derive encryption key via PBKDF2.
- **Vault Key:** Random 256-bit AES key generated once per user. Encrypts/decrypts all vault items.
- **Recovery Key:** Human-readable Base32 key (32 chars, 8 groups of 4: `XXXX-XXXX-...`). Wraps the vault key as a backup. Shown **once** at signup/reset.
- **Server stores only:**
  - `encrypted_vault_key_by_master` (wrapped with PBKDF2-derived key)
  - `encrypted_vault_key_by_recovery` (wrapped with recovery key)
  - `recovery_key_hash` (SHA-256 of canonical recovery key)
  - `salt` (for PBKDF2)
  - `vault_items.encrypted_password` (AES-256 with vault key)

### 2.2 Key Hierarchy
```
Master Password + Salt (PBKDF2, 100k iter) → Derived Key → decrypts → Vault Key
Recovery Key (canonical, no dashes)        → decrypts → Vault Key
Vault Key (AES-256)                        → encrypts  → vault_items.encrypted_password
```

---

## 3. Functional Requirements

### 3.1 Authentication & Onboarding

| ID | Feature | Description |
|----|---------|-------------|
| F-01 | **Email/Password Sign Up** | User registers with email + master password (≥6 chars). If email confirmation disabled, vault keys created immediately and recovery key shown. If enabled, user verifies email first, then logs in to create vault. |
| F-02 | **Email/Password Login** | User enters email + master password. Supabase Auth validates. Client derives key, unlocks vault key, migrates any legacy items, navigates to vault. |
| F-03 | **First Login Vault Setup** | If `user_keys` row missing (first login after email verification), `setupVaultKeys()` generates vault key, recovery key, encrypts vault key both ways, stores to DB, shows recovery key page. |
| F-04 | **Recovery Key Display** | Shown **once** at signup or vault reset. User must copy/download and check "I have saved this" before continuing. Includes copy & download (.txt) buttons. |

### 3.2 Vault Management

| ID | Feature | Description |
|----|---------|-------------|
| F-05 | **List Vault Items** | Fetch `vault_items` for current user (RLS enforced). Display site name, username, masked password (`••••••••`). |
| F-06 | **Add Vault Item** | Form: site name, username, password. Client encrypts password with vault key (`encryptPassword()`), sends ciphertext to Supabase. |
| F-07 | **Edit Vault Item** | Update site name/username. Optional password change → re-encrypt with vault key. |
| F-08 | **Delete Vault Item** | Confirmation dialog, then `DELETE` via Supabase (RLS ensures ownership). |
| F-09 | **Reveal Password** | Toggle per-item. Client decrypts with vault key (`decryptPassword()`). Shows "(gagal dekripsi)" if decryption fails. |
| F-10 | **Legacy Migration** | On login, `migrateLegacyItems()` re-encrypts any items still encrypted with old master-password-direct scheme using current vault key. Runs silently. |

### 3.3 Account Password Reset (with Recovery Key)

| ID | Feature | Description |
|----|---------|-------------|
| F-11 | **Forgot Master Password Flow** | Multi-step: Email → OTP → Recovery Key → New Master Password → Done. |
| F-12 | **Email OTP** | `supabase.auth.signInWithOtp()` sends magic link/code. No password required. |
| F-13 | **OTP Verification** | `verifyOtp()` establishes authenticated session. |
| F-14 | **Recovery Key Verification** | User enters recovery key (dashes/spaces/case ignored). Client: `normalizeRecoveryKey()` → `hashRecoveryKey()` → compare to `recovery_key_hash`. If match, `decryptVaultKeyWithRecovery()` yields vault key. |
| F-15 | **New Master Password** | User sets new password (≥6 chars, confirmed). Client: `reencryptVaultKeyWithMaster(vaultKey, newPassword)` → new `encrypted_vault_key_by_master` + new `salt`. Updates `user_keys`. Also calls `supabase.auth.updateUser({password: newPassword})` to sync Supabase Auth password. |
| F-16 | **Vault Preservation** | Vault key **unchanged** — all existing vault items remain decryptable. |

### 3.4 Vault Reset (No Recovery Key)

| ID | Feature | Description |
|----|---------|-------------|
| F-17 | **No Recovery Key Page** | Warns: zero-knowledge → old vault permanently unreadable. Requires typing `RESET VAULT` + checkbox confirmation. |
| F-18 | **Destructive Vault Reset** | `resetVaultKeys(newPassword)` generates **new** vault key + new recovery key. Overwrites `user_keys` (upsert). Old vault items remain in DB but **can never be decrypted**. User gets new recovery key (shown once). |

### 3.5 Supabase Auth Password Reset (Standard)

| ID | Feature | Description |
|----|---------|-------------|
| F-19 | **Standard Password Reset** | `/update-password` route handles Supabase `PASSWORD_RECOVERY` session from email link. Updates Supabase Auth password only. **Does not touch vault keys** — user must still know master password to unlock vault. |

---

## 4. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Security** | Master password never leaves client. Vault key never stored in plaintext. Recovery key hash only (SHA-256). PBKDF2 ≥100k iterations. AES-256-GCM equivalent via CryptoJS. |
| **Privacy** | Zero-knowledge: server cannot decrypt vault items. No telemetry, no analytics. |
| **Availability** | Client-side decryption works offline after initial load (vault key in memory). |
| **Usability** | Recovery key human-readable (Crockford Base32, no ambiguous chars I/L/O/U). Copy/download helpers. Clear warnings for destructive actions. |
| **Performance** | Lazy load vault items. Single vault key unlock per session. Migration runs once per legacy item. |
| **Accessibility** | Semantic HTML, focus management, color contrast (Tailwind defaults), keyboard navigation. |
| **Browser Support** | Modern browsers with Web Crypto API (`window.crypto.getRandomValues`) and Clipboard API. |

---

## 5. Data Model (Supabase Tables)

### 5.1 `user_keys` (One row per user)
| Column | Type | Description |
|--------|------|-------------|
| `user_id` | `uuid` | PK, FK → `auth.users.id` |
| `encrypted_vault_key_by_master` | `text` | Vault key wrapped with PBKDF2-derived key |
| `encrypted_vault_key_by_recovery` | `text` | Vault key wrapped with recovery key |
| `recovery_key_hash` | `text` | SHA-256 hex of canonical recovery key |
| `salt` | `text` | Hex-encoded 16-byte PBKDF2 salt |
| `created_at` | `timestamptz` | Auto |

**RLS:** `user_id = auth.uid()` — users only see own row.

### 5.2 `vault_items` (Many per user)
| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | FK → `auth.users.id` |
| `site_name` | `text` | e.g., "github.com" |
| `username` | `text` | Login identifier |
| `encrypted_password` | `text` | AES-256 ciphertext (CryptoJS format) |
| `created_at` | `timestamptz` | Auto |
| `updated_at` | `timestamptz` | Auto (trigger recommended) |

**RLS:** `user_id = auth.uid()` — users only CRUD own items.

---

## 6. User Flows

### 6.1 Happy Path: Sign Up → Vault
```
[/] Sign Up (email + master password)
       │
       ├─ Email confirm disabled → setupVaultKeys() → [/recovery-key] → [/vault]
       │
       └─ Email confirm enabled  → "Verify email" → Login → setupVaultKeys() → [/recovery-key] → [/vault]
```

### 6.2 Happy Path: Login → Vault
```
[/] Login (email + master password)
       │
       └─ unlockVaultKey() → migrateLegacyItems() → [/vault]
```

### 6.3 Forgot Master Password (with Recovery Key)
```
[/forgot-master-password] Email → OTP → Recovery Key → New Password
       │
       ├─ OTP: signInWithOtp() / verifyOtp()
       ├─ Recovery: hash match + decryptVaultKeyWithRecovery()
       └─ New Password: reencryptVaultKeyWithMaster() + updateUser(password)
            → Vault key UNCHANGED → [/] Login
```

### 6.4 No Recovery Key (Destructive Reset)
```
[/no-recovery-key] Warning → Confirm "RESET VAULT" + checkbox → New Password
       │
       └─ resetVaultKeys() → NEW vault key + NEW recovery key
            → Old items permanently unreadable → [/] Login
```

---

## 7. Technical Implementation Details

### 7.1 Crypto Module (`src/lib/crypto.js`)

| Function | Purpose |
|----------|---------|
| `encryptPassword(plain, masterKey)` | AES encrypt with vault key |
| `decryptPassword(cipher, masterKey)` | AES decrypt with vault key |
| `generateRecoveryKey()` | 32-char Crockford Base32, grouped `XXXX-XXXX-...` |
| `normalizeRecoveryKey(input)` | Strip dashes/spaces, uppercase |
| `hashRecoveryKey(key)` | SHA-256 hex for DB comparison |
| `decryptVaultKeyWithRecovery(enc, key)` | Unwrap vault key using recovery key |
| `reencryptVaultKeyWithMaster(vaultKeyHex, newMaster)` | New PBKDF2 salt + derived key → wrap vault key |
| `setupVaultKeys(masterPassword)` | Full key generation + DB insert → returns recovery key |
| `resetVaultKeys(masterPassword)` | **Destructive** — new vault key, new recovery key, upsert |
| `unlockVaultKey(masterPassword)` | PBKDF2 derive → decrypt `encrypted_vault_key_by_master` → vault key hex |
| `migrateLegacyItems(masterPassword, vaultKeyHex)` | Re-encrypt legacy items (encrypted directly with master password) |

### 7.2 Supabase Client (`src/lib/supabase.js`)
- Single `createClient()` instance using `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
- All DB access via this client (RLS enforces ownership)

### 7.3 Routing (`src/App.jsx`)
| Route | Component | Auth |
|-------|-----------|------|
| `/` | `AuthForm` | Public |
| `/forgot-master-password` | `ForgotMasterPassword` | Public (OTP flow) |
| `/no-recovery-key` | `NoRecoveryKey` | Public |
| `/update-password` | `UpdatePassword` | Public (Supabase recovery session) |
| `/recovery-key` | `RecoveryKeyDisplay` | Public (guarded by state) |
| `/vault` | `VaultList` | **Protected** (`RequireAuth` HOC) |

### 7.4 Components

| Component | Responsibility |
|-----------|----------------|
| `AuthForm` | Login/Signup toggle, calls `setupVaultKeys`/`unlockVaultKey`/`migrateLegacyItems` |
| `VaultList` | CRUD vault items, reveal passwords, holds `masterKey` in React state (from route state) |
| `ForgotMasterPassword` | 5-step wizard: email → OTP → recovery key → new password → done |
| `RecoveryKeyDisplay` | Shows recovery key once, copy/download, checkbox gate |
| `NoRecoveryKey` | Destructive reset warning, confirmation phrase, new vault creation |
| `UpdatePassword` | Supabase Auth password reset (email link), does not touch vault |

---

## 8. Security Considerations

| Threat | Mitigation |
|--------|------------|
| Server compromise | Vault key never on server; only wrapped copies. Recovery key hash only (not reversible). |
| Master password leak | PBKDF2 100k iterations + random salt per user. |
| Recovery key brute force | 32 chars Base32 = ~160 bits entropy. Hash stored, not key. |
| Legacy item exposure | `migrateLegacyItems()` upgrades old scheme on first login after vault setup. |
| XSS / injection | React auto-escapes. No `dangerouslySetInnerHTML`. CSP recommended. |
| RLS bypass | All tables have `user_id = auth.uid()` policies. Service role not used client-side. |
| Clipboard leakage | Recovery key copy is user-initiated. No auto-copy. |

---

## 9. Configuration & Deployment

### 9.1 Environment Variables (`.env`)
```
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

### 9.2 Supabase Setup
1. Enable Email Auth (disable "Confirm email" for instant vault setup, or keep enabled for verification flow)
2. Run migrations to create `user_keys` + `vault_items` with RLS policies
3. Optionally: disable "Secure password change" in Auth settings if using custom reset flow

### 9.3 Build & Run
```bash
npm install
npm run dev      # Development
npm run build    # Production build → dist/
npm run preview  # Preview production build
```

---

## 10. Known Limitations & Future Work

| Area | Current State | Planned / Notes |
|------|---------------|-----------------|
| **Browser Extension** | Not implemented | High priority for autofill |
| **Mobile App** | Not implemented | React Native or Capacitor |
| **Biometric Unlock** | Not implemented | WebAuthn / Passkeys for vault key unlock |
| **Vault Sharing** | Not implemented | Family/team sharing via asymmetric crypto |
| **Password Generator** | Not implemented | Client-side secure random generator |
| **Breach Monitoring** | Not implemented | HaveIBeenPwned API integration |
| **Import/Export** | Not implemented | Encrypted JSON backup/restore |
| **Session Timeout** | Not implemented | Auto-lock vault after inactivity |
| **Audit Logs** | Not implemented | User-facing access history |

---

## 11. Testing Checklist

- [ ] Sign up → recovery key shown → vault accessible
- [ ] Login → vault accessible
- [ ] Add/edit/delete/reveal vault items
- [ ] Forgot password with recovery key → vault preserved
- [ ] No recovery key reset → old items unreadable, new vault works
- [ ] Standard Supabase password reset → Auth password changed, vault still needs master password
- [ ] Legacy migration (manually insert old-format item) → re-encrypted on login
- [ ] RLS: user A cannot see user B's items/keys
- [ ] Recovery key format normalization (dashes, spaces, case)
- [ ] Wrong master password → unlock fails gracefully
- [ ] Wrong recovery key → hash mismatch error

---

## 12. File Structure Reference

```
src/
├── main.jsx                 # Entry point
├── App.jsx                  # Routes + RequireAuth HOC
├── lib/
│   ├── supabase.js          # Supabase client singleton
│   └── crypto.js            # All encryption/key management
└── components/
    ├── AuthForm.jsx         # Login / Signup
    ├── VaultList.jsx        # Vault CRUD + reveal
    ├── ForgotMasterPassword.jsx  # 5-step recovery flow
    ├── RecoveryKeyDisplay.jsx    # One-time recovery key display
    ├── NoRecoveryKey.jsx        # Destructive vault reset
    └── UpdatePassword.jsx       # Supabase Auth password reset
```

---

*Document generated from codebase analysis. Update when features change.*

## 3. Functional Requirements (137 Total)

| Module | FR Count |
|---|---|
| Authentication & Account Management | 12 |
| Authentication Security | 6 |
| Cryptography & Key Management | 7 |
| Vault Management | 14 |
| Password & Passkey Management | 9 |
| Digital Assets | 10 |
| Password Generator | 5 |
| Browser Extension & Autofill | 9 |
| Synchronization | 7 |
| Backup & Recovery | 7 |
| Security Monitoring | 8 |
| Security Education | 4 |
| Dashboard | 6 |
| Sharing & Emergency Access | 7 |
| Device Management | 3 |
| Import & Export | 5 |
| Audit Logs | 4 |
| Notifications | 4 |
| Settings & Preferences | 6 |
| Privacy & Accessibility | 4 |
| **Total** | **137 Functional Requirements** |

### 3.1 Authentication & Account Management

| ID | Feature | Description |
|----|---------|-------------|
| F-01 | **Email/Password Sign Up** | User registers with email + master password (≥6 chars). If email confirmation disabled, vault keys created immediately and recovery key shown. If enabled, user verifies email first, then logs in to create vault. |
| F-02 | **Email/Password Login** | User enters email + master password. Supabase Auth validates. Client derives key, unlocks vault key, migrates any legacy items, navigates to vault. |
| F-03 | **First Login Vault Setup** | If `user_keys` row missing (first login after email verification), `setupVaultKeys()` generates vault key, recovery key, encrypts vault key both ways, stores to DB, shows recovery key page. |
| F-04 | **Recovery Key Display** | Shown **once** at signup or vault reset. User must copy/download and check "I have saved this" before continuing. Includes copy & download (.txt) buttons. |
| F-05 | **List Vault Items** | Fetch `vault_items` for current user (RLS enforced). Display site name, username, masked password (`••••••••`). |
| F-06 | **Add Vault Item** | Form: site name, username, password. Client encrypts password with vault key (`encryptPassword()`), sends ciphertext to Supabase. |
| F-07 | **Edit Vault Item** | Update site name/username. Optional password change → re-encrypt with vault key. |
| F-08 | **Delete Vault Item** | Confirmation dialog, then `DELETE` via Supabase (RLS ensures ownership). |
| F-09 | **Reveal Password** | Toggle per-item. Client decrypts with vault key (`decryptPassword()`). Shows "(gagal dekripsi)" if decryption fails. |
| F-10 | **Legacy Migration** | On login, `migrateLegacyItems()` re-encrypts any items still encrypted with old master-password-direct scheme using current vault key. Runs silently. |
| F-11 | **Forgot Master Password Flow** | Multi-step: Email → OTP → Recovery Key → New Master Password → Done. |
| F-12 | **Email OTP** | `supabase.auth.signInWithOtp()` sends magic link/code. No password required. |
| F-13 | **OTP Verification** | `verifyOtp()` establishes authenticated session. |
| F-14 | **Recovery Key Verification** | User enters recovery key (dashes/spaces/case ignored). Client: `normalizeRecoveryKey()` → `hashRecoveryKey()` → compare to `recovery_key_hash`. If match, `decryptVaultKeyWithRecovery()` yields vault key. |
| F-15 | **New Master Password** | User sets new password (≥6 chars, confirmed). Client: `reencryptVaultKeyWithMaster(vaultKey, newPassword)` → new `encrypted_vault_key_by_master` + new `salt`. Updates `user_keys`. Also calls `supabase.auth.updateUser({password: newPassword})` to sync Supabase Auth password. |
| F-16 | **Vault Preservation** | Vault key **unchanged** — all existing vault items remain decryptable. |
| F-17 | **No Recovery Key Page** | Warns: zero-knowledge → old vault permanently unreadable. Requires typing `RESET VAULT` + checkbox confirmation. |
| F-18 | **Destructive Vault Reset** | `resetVaultKeys(newPassword)` generates **new** vault key + new recovery key. Overwrites `user_keys` (upsert). Old vault items remain in DB but **can never be decrypted**. User gets new recovery key (shown once). |
| F-19 | **Standard Password Reset** | `/update-password` route handles Supabase `PASSWORD_RECOVERY` session from email link. Updates Supabase Auth password only. **Does not touch vault keys** — user must still know master password to unlock vault. |

### 3.2 Authentication Security

| ID | Feature | Description |
|----|---------|-------------|
| F-20 | **TOTP Authentication** | System supports Time-based One-Time Password (TOTP) authentication. |
| F-21 | **WebAuthn/FIDO2** | System supports WebAuthn/FIDO2 security keys. |
| F-22 | **Passkey Authentication** | System supports Passkey authentication. |
| F-23 | **Biometric Authentication** | System supports biometric authentication on supported devices. |
| F-24 | **Login Delay** | System temporarily delays repeated failed login attempts. |
| F-25 | **Login Notification** | System notifies users of successful logins from new devices. |

### 3.3 Cryptography & Key Management

| ID | Feature | Description |
|----|---------|-------------|
| F-26 | **Zero-Knowledge Encryption** | System encrypts all vault data using Zero-Knowledge Architecture. |
| F-27 | **Argon2id Key Derivation** | System derives encryption keys using Argon2id with recommended security parameters. |
| F-28 | **Master Password Transmission** | Master password shall never be transmitted to or stored on the server. |
| F-29 | **Master Password Storage** | Master password shall never be stored in plaintext. |
| F-30 | **Secure Key Erasure** | System shall securely erase encryption keys from memory after use. |
| F-31 | **Vault Integrity Verification** | System verifies vault integrity before decryption. |
| F-32 | **Encryption Metadata Regeneration** | System regenerates encryption metadata whenever the master password changes. |

### 3.4 Vault Management

| ID | Feature | Description |
|----|---------|-------------|
| F-33 | **Create Vault Entries** | System allows users to create vault entries. |
| F-34 | **Edit Vault Entries** | System allows users to edit vault entries. |
| F-35 | **Archive Vault Entries** | System allows users to archive vault entries. |
| F-36 | **Restore Archived Entries** | System allows users to restore archived vault entries. |
| F-37 | **Recycle Bin** | System moves deleted vault entries to a recycle bin. |
| F-38 | **Permanent Deletion** | System permanently deletes recycled entries after a configurable retention period. |
| F-39 | **Restore Before Permanent Deletion** | System allows users to restore deleted entries before permanent deletion. |
| F-40 | **Folders** | System supports folders for organizing vault items. |
| F-41 | **Tags** | System supports tags for categorizing vault items. |
| F-42 | **Favorites** | System supports favorites for quick access. |
| F-43 | **Search Vault Items** | System supports searching vault items. |
| F-44 | **Custom Fields** | System supports custom fields for vault items. |
| F-45 | **Version Retention** | System retains the latest twenty versions of each vault item. |
| F-46 | **Version Restoration** | System allows restoration of previous versions of vault items. |

### 3.5 Password & Passkey Management

| ID | Feature | Description |
|----|---------|-------------|
| F-47 | **Secure Password Storage** | System securely stores passwords. |
| F-48 | **Secure Username Storage** | System securely stores usernames. |
| F-49 | **Secure Website URL Storage** | System securely stores website URLs. |
| F-50 | **Secure Passkey Storage** | System securely stores passkeys. |
| F-51 | **Secure Recovery Code Storage** | System securely stores recovery codes. |
| F-52 | **Secure Security Question Storage** | System securely stores security questions. |
| F-53 | **Secure OAuth Login Storage** | System securely stores OAuth login information. |
| F-54 | **Secure TOTP Secret Storage** | System securely stores TOTP secrets. |
| F-55 | **Multiple Credentials** | System supports multiple credentials for the same website. |

### 3.6 Digital Assets

| ID | Feature | Description |
|----|---------|-------------|
| F-56 | **Secure Notes Storage** | System securely stores secure notes. |
| F-57 | **Secure Payment Card Storage** | System securely stores payment cards. |
| F-58 | **Secure Bank Account Storage** | System securely stores bank accounts. |
| F-59 | **Secure Identity Document Storage** | System securely stores identity documents. |
| F-60 | **Secure Passport Storage** | System securely stores passports. |
| F-61 | **Secure Driver License Storage** | System securely stores driver licenses. |
| F-62 | **Secure API Key Storage** | System securely stores API keys. |
| F-63 | **Secure SSH Key Storage** | System securely stores SSH keys. |
| F-64 | **Secure Software License Storage** | System securely stores software licenses. |
| F-65 | **Secure Encrypted File Attachment Storage** | System securely stores encrypted file attachments. |

### 3.7 Password Generator

| ID | Feature | Description |
|----|---------|-------------|
| F-66 | **Cryptographically Secure Passwords** | System generates cryptographically secure passwords. |
| F-67 | **Password Length Configuration** | System allows users to configure password length. |
| F-68 | **Character Sets Configuration** | System configures uppercase, lowercase, numbers, and symbols. |
| F-69 | **Passphrase Generation** | System generates memorable passphrases. |
| F-70 | **Ambiguous Character Avoidance** | System avoids ambiguous characters when requested. |

### 3.8 Browser Extension & Autofill

| ID | Feature | Description |
|----|---------|-------------|
| F-71 | **Browser Extensions** | System provides browser extensions. |
| F-72 | **Login Form Detection** | Browser extension detects login forms. |
| F-73 | **Credential Autofill** | Browser extension autofills credentials. |
| F-74 | **Password Change Detection** | Browser extension detects password changes. |
| F-75 | **Save New Credentials** | Browser extension offers to save new credentials. |
| F-76 | **Strong Password Suggestions** | Browser extension suggests strong passwords during registration. |
| F-77 | **Android Autofill** | System supports autofill on Android. |
| F-78 | **iOS Autofill** | System supports autofill on iOS. |
| F-79 | **Clipboard Clear** | System automatically clears copied passwords from clipboard after configurable period. |

### 3.9 Synchronization

| ID | Feature | Description |
|----|---------|-------------|
| F-80 | **Offline Operation** | System operates without an Internet connection. |
| F-81 | **Local Vault Storage** | System stores encrypted vaults locally. |
| F-82 | **Optional Cloud Synchronization** | System optionally synchronizes encrypted vaults through cloud storage. |
| F-83 | **Cross-Device Synchronization** | System synchronizes vault updates across authorized devices. |
| F-84 | **Offline Change Queuing** | System queues offline changes. |
| F-85 | **Sync on Connectivity Restoration** | System synchronizes queued changes when connectivity returns. |
| F-86 | **Conflict Preservation** | System preserves conflicting versions during synchronization conflicts. |

### 3.10 Backup & Recovery

| ID | Feature | Description |
|----|---------|-------------|
| F-87 | **Encrypted Vault Backup Export** | System exports encrypted vault backups. |
| F-88 | **Encrypted Vault Backup Import** | System imports encrypted vault backups. |
| F-89 | **Encrypted Recovery Package Generation** | System generates encrypted recovery packages. |
| F-90 | **Password-Protected PDF Generation** | System generates password-protected recovery PDFs. |
| F-91 | **QR-Code Recovery** | System supports QR-code recovery. |
| F-92 | **Backup Integrity Verification** | System verifies backup integrity before restoration. |
| F-93 | **Backup Reminders** | System periodically reminds users to verify their backups. |

### 3.11 Security Monitoring

| ID | Feature | Description |
|----|---------|-------------|
| F-94 | **Weak Password Identification** | System identifies weak passwords. |
| F-95 | **Reused Password Identification** | System identifies reused passwords. |
| F-96 | **Duplicate Credential Identification** | System identifies duplicate credentials. |
| F-97 | **Compromised Password Identification** | System identifies compromised passwords. |
| F-98 | **MFA-Less Account Identification** | System identifies accounts without Multi-Factor Authentication. |
| F-99 | **Password Age Identification** | System identifies passwords older than a configurable age. |
| F-100 | **Security Score Calculation** | System calculates an overall security score. |
| F-101 | **Corrective Action Recommendations** | System recommends corrective actions. |

### 3.12 Security Education

| ID | Feature | Description |
|----|---------|-------------|
| F-102 | **Daily Cybersecurity Tips** | System displays daily cybersecurity tips. |
| F-103 | **Phishing Education** | System educates users about phishing attacks. |
| F-104 | **Social Engineering Education** | System educates users about social engineering. |
| F-105 | **Personalized Recommendations** | System provides personalized security recommendations. |

### 3.13 Dashboard

| ID | Feature | Description |
|----|---------|-------------|
| F-106 | **Vault Item Count Display** | System displays the number of stored vault items. |
| F-107 | **Password Health Statistics** | System displays password health statistics. |
| F-108 | **Compromised Accounts Display** | System displays compromised accounts. |
| F-109 | **Backup Status Display** | System displays backup status. |
| F-110 | **Synchronization Status Display** | System displays synchronization status. |
| F-111 | **Security Score Display** | System displays the overall security score. |

### 3.14 Sharing & Emergency Access

| ID | Feature | Description |
|----|---------|-------------|
| F-112 | **Secure Vault Item Sharing** | System securely shares vault items. |
| F-113 | **Shared Vaults** | System supports shared vaults. |
| F-114 | **Role-Based Permissions** | System supports role-based sharing permissions. |
| F-115 | **Shared Access Revocation** | System revokes shared access. |
| F-116 | **Trusted Emergency Contacts** | System supports trusted emergency contacts. |
| F-117 | **Configurable Waiting Periods** | System supports configurable emergency access waiting periods. |
| F-118 | **Pre-Grant Notification** | System notifies users before emergency access is granted. |

### 3.15 Device Management

| ID | Feature | Description |
|----|---------|-------------|
| F-119 | **Trusted Devices Display** | System displays trusted devices. |
| F-120 | **Trusted Device Revocation** | System allows users to revoke trusted devices. |
| F-121 | **New Device Registration Approval** | System requires user approval before registering a new device. |

### 3.16 Import & Export

| ID | Feature | Description |
|----|---------|-------------|
| F-122 | **Bitwarden Import** | System imports data from Bitwarden. |
| F-123 | **1Password Import** | System imports data from 1Password. |
| F-124 | **Dashlane Import** | System imports data from Dashlane. |
| F-125 | **CSV Import** | System imports data from CSV files. |
| F-126 | **Encrypted Vault Export** | System exports encrypted vaults. |

### 3.17 Audit Logs

| ID | Feature | Description |
|----|---------|-------------|
| F-127 | **Authentication Event Recording** | System records authentication events. |
| F-128 | **Vault Event Recording** | System records vault creation, modification, deletion, and restoration events. |
| F-129 | **Sharing Event Recording** | System records sharing events. |
| F-130 | **Audit Log Filtering** | System allows users to filter audit logs by date, device, and event type. |

### 3.18 Notifications

| ID | Feature | Description |
|----|---------|-------------|
| F-131 | **New Device Sign-In Notification** | System notifies users when a new device signs in. |
| F-132 | **Vault Export Notification** | System notifies users when a vault export is performed. |
| F-133 | **Backup Failure Notification** | System notifies users when backups fail. |
| F-134 | **Suspicious Activity Notification** | System notifies users when suspicious activity is detected. |

### 3.19 Settings & Preferences

| ID | Feature | Description |
|----|---------|-------------|
| F-135 | **Vault Lock Timeout Configuration** | System allows users to configure vault lock timeout. |
| F-136 | **Biometric Authentication Configuration** | System allows users to configure biometric authentication. |
| F-137 | **Synchronization Preferences** | System allows users to configure synchronization preferences. |
| F-138 | **Notification Preferences** | System allows users to configure notification preferences. |
| F-139 | **Backup Reminder Configuration** | System allows users to configure backup reminders. |
| F-140 | **Password Generation Defaults** | System allows users to configure password generation defaults. |

### 3.20 Privacy & Accessibility

| ID | Feature | Description |
|----|---------|-------------|
| F-141 | **Telemetry Minimization** | System minimizes collection of user telemetry. |
| F-142 | **Analytics Opt-Out** | System allows users to disable analytics collection. |
| F-143 | **WCAG 2.2 AA Compliance** | System complies with WCAG 2.2 AA accessibility guidelines. |
| F-144 | **Authenticated APIs** | System provides authenticated APIs for official browser and mobile clients. |

## 4. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Security** | Master password never leaves client. Vault key never stored in plaintext. Recovery key hash only (SHA-256). PBKDF2 ≥100k iterations. AES-256-GCM equivalent via CryptoJS. |
| **Privacy** | Zero-knowledge: server cannot decrypt vault items. No telemetry, no analytics. |
| **Availability** | Client-side decryption works offline after initial load (vault key in memory). |
| **Usability** | Recovery key human-readable (Crockford Base32, no ambiguous chars I/L/O/U). Copy/download helpers. Clear warnings for destructive actions. |
| **Performance** | Lazy load vault items. Single vault key unlock per session. Migration runs once per legacy item. |
| **Accessibility** | Semantic HTML, focus management, color contrast (Tailwind defaults), keyboard navigation. |
| **Browser Support** | Modern browsers with Web Crypto API (`window.crypto.getRandomValues`) and Clipboard API. |

---

## 5. Data Model (Supabase Tables)

### 5.1 `user_keys` (One row per user)

| Column | Type | Description |
|--------|------|-------------|
| `user_id` | `uuid` | PK, FK → `auth.users.id` |
| `encrypted_vault_key_by_master` | `text` | Vault key wrapped with PBKDF2-derived key |
| `encrypted_vault_key_by_recovery` | `text` | Vault key wrapped with recovery key |
| `recovery_key_hash` | `text` | SHA-256 hex of canonical recovery key |
| `salt` | `text` | Hex-encoded 16-byte PBKDF2 salt |
| `created_at` | `timestamptz` | Auto |

**RLS:** `user_id = auth.uid()` — users only see own row.

### 5.2 `vault_items` (Many per user)

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | FK → `auth.users.id` |
| `site_name` | `text` | e.g., "github.com" |
| `username` | `text` | Login identifier |
| `encrypted_password` | `text` | AES-256 ciphertext (CryptoJS format) |
| `created_at` | `timestamptz` | Auto |
| `updated_at` | `timestamptz` | Auto (trigger recommended) |

**RLS:** `user_id = auth.uid()` — users only CRUD own items.

---

## 6. User Flows

### 6.1 Happy Path: Sign Up → Vault
```
[/] Sign Up (email + master password)
       │
       ├─ Email confirm disabled → setupVaultKeys() → [/recovery-key] → [/vault]
       │
       └─ Email confirm enabled  → "Verify email" → Login → setupVaultKeys() → [/recovery-key] → [/vault]
```

### 6.2 Happy Path: Login → Vault
```
[/] Login (email + master password)
       │
       └─ unlockVaultKey() → migrateLegacyItems() → [/vault]
```

### 6.3 Forgot Master Password (with Recovery Key)
```
[/forgot-master-password] Email → OTP → Recovery Key → New Password
       │
       ├─ OTP: signInWithOtp() / verifyOtp()
       ├─ Recovery: hash match + decryptVaultKeyWithRecovery()
       └─ New Password: reencryptVaultKeyWithMaster() + updateUser(password)
            → Vault key UNCHANGED → [/] Login
```

### 6.4 No Recovery Key (Destructive Reset)
```
[/no-recovery-key] Warning → Confirm "RESET VAULT" + checkbox → New Password
       │
       └─ resetVaultKeys() → NEW vault key + NEW recovery key
            → Old items permanently unreadable → [/] Login
```

---

## 7. Technical Implementation Details

### 7.1 Crypto Module (`src/lib/crypto.js`)

| Function | Purpose |
|----------|---------|
| `encryptPassword(plain, masterKey)` | AES encrypt with vault key |
| `decryptPassword(cipher, masterKey)` | AES decrypt with vault key |
| `generateRecoveryKey()` | 32-char Crockford Base32, grouped `XXXX-XXXX-...` |
| `normalizeRecoveryKey(input)` | Strip dashes/spaces, uppercase |
| `hashRecoveryKey(key)` | SHA-256 hex for DB comparison |
| `decryptVaultKeyWithRecovery(enc, key)` | Unwrap vault key using recovery key |
| `reencryptVaultKeyWithMaster(vaultKeyHex, newMaster)` | New PBKDF2 salt + derived key → wrap vault key |
| `setupVaultKeys(masterPassword)` | Full key generation + DB insert → returns recovery key |
| `resetVaultKeys(masterPassword)` | **Destructive** — new vault key, new recovery key, upsert |
| `unlockVaultKey(masterPassword)` | PBKDF2 derive → decrypt `encrypted_vault_key_by_master` → vault key hex |
| `migrateLegacyItems(masterPassword, vaultKeyHex)` | Re-encrypt legacy items (encrypted directly with master password) |

### 7.2 Supabase Client (`src/lib/supabase.js`)
- Single `createClient()` instance using `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
- All DB access via this client (RLS enforces ownership)

### 7.3 Routing (`src/App.jsx`)

| Route | Component | Auth |
|-------|-----------|------|
| `/` | `AuthForm` | Public |
| `/forgot-master-password` | `ForgotMasterPassword` | Public (OTP flow) |
| `/no-recovery-key` | `NoRecoveryKey` | Public |
| `/update-password` | `UpdatePassword` | Public (Supabase recovery session) |
| `/recovery-key` | `RecoveryKeyDisplay` | Public (guarded by state) |
| `/vault` | `VaultList` | **Protected** (`RequireAuth` HOC) |

### 7.4 Components

| Component | Responsibility |
|-----------|----------------|
| `AuthForm` | Login / Signup |
| `VaultList` | Vault CRUD + reveal |
| `ForgotMasterPassword` | 5-step recovery flow |
| `RecoveryKeyDisplay` | One-time recovery key display |
| `NoRecoveryKey` | Destructive vault reset |
| `UpdatePassword` | Supabase Auth password reset |

---

## 8. Security Considerations

| Threat | Mitigation |
|--------|------------|
| Server compromise | Vault key never on server; only wrapped copies. Recovery key hash only (not reversible). |
| Master password leak | PBKDF2 100k iterations + random salt per user. |
| Recovery key brute force | 32 chars Base32 = ~160 bits entropy. Hash stored, not key. |
| Legacy item exposure | `migrateLegacyItems()` upgrades old scheme on first login after vault setup. |
| XSS / injection | React auto-escapes. No `dangerouslySetInnerHTML`. CSP recommended. |
| RLS bypass | All tables have `user_id = auth.uid()` policies. Service role not used client-side. |
| Clipboard leakage | Recovery key copy is user-initiated. No auto-copy. |

---

## 9. Configuration & Deployment

### 9.1 Environment Variables (`.env`)
```
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

### 9.2 Supabase Setup
1. Enable Email Auth (disable "Confirm email" for instant vault setup, or keep enabled for verification flow)
2. Run migrations to create `user_keys` + `vault_items` with RLS policies
3. Optionally: disable "Secure password change" in Auth settings if using custom reset flow

### 9.3 Build & Run
```bash
npm install
npm run dev      # Development
npm run build    # Production build → dist/
npm run preview  # Preview production build
```

---

## 10. Known Limitations & Future Work

| Area | Current State | Planned / Notes |
|------|---------------|-----------------|
| **Browser Extension** | Not implemented | High priority for autofill |
| **Mobile App** | Not implemented | React Native or Capacitor |
| **Biometric Unlock** | Not implemented | WebAuthn / Passkeys for vault key unlock |
| **Vault Sharing** | Not implemented | Family/team sharing via asymmetric crypto |
| **Password Generator** | Not implemented | Client-side secure random generator |
| **Breach Monitoring** | Not implemented | HaveIBeenPwned API integration |
| **Import/Export** | Not implemented | Encrypted JSON backup/restore |
| **Session Timeout** | Not implemented | Auto-lock vault after inactivity |
| **Audit Logs** | Not implemented | User-facing access history |

---

## 11. Testing Checklist

- [ ] Sign up → recovery key shown → vault accessible
- [ ] Login → vault accessible
- [ ] Add/edit/delete/reveal vault items
- [ ] Forgot password with recovery key → vault preserved
- [ ] No recovery key reset → old items unreadable, new vault works
- [ ] Standard Supabase password reset → Auth password changed, vault still needs master password
- [ ] Legacy migration (manually insert old-format item) → re-encrypted on login
- [ ] RLS: user A cannot see user B's items/keys
- [ ] Recovery key format normalization (dashes, spaces, case)
- [ ] Wrong master password → unlock fails gracefully
- [ ] Wrong recovery key → hash mismatch error

---

## 12. File Structure Reference

```
src/
├── main.jsx                 # Entry point
├── App.jsx                  # Routes + RequireAuth HOC
├── lib/
│   ├── supabase.js          # Supabase client singleton
│   └── crypto.js            # All encryption/key management
└── components/
    ├── AuthForm.jsx         # Login / Signup
    ├── VaultList.jsx        # Vault CRUD + reveal
    ├── ForgotMasterPassword.jsx  # 5-step recovery flow
    ├── RecoveryKeyDisplay.jsx    # One-time recovery key display
    ├── NoRecoveryKey.jsx        # Destructive vault reset
    └── UpdatePassword.jsx       # Supabase Auth password reset
```

---

## 13. Third-Party Service Integration (NEW)

| ID | Service | Purpose | Integration Method | Data Flow |
|----|---------|---------|-------------------|-----------|
| **NFR-097** | **HaveIBeenPwned** | Check compromised passwords | **Edge Function** + SHA-256 hash | Client → SHA-256 hash → Edge Function → API → result → Client |
| **NFR-098** | **Subscription Billing** | Pro feature access | **Stripe/Webhook** → Supabase | Client → Stripe → Webhook → DB → UI |
| **NFR-099** | **Optional Analytics** | Usage tracking (opt-in) | **Edge Function** + anonymized events | Client → anonymized event → Edge → DB |

### 13.1 Breach Monitoring (NFR-097)

- **Goal**: Identify if any stored passwords have appeared in known data breaches
- **Method**: Client-side SHA-256 hash of password sent to HaveIBeenPwned API (k-anonymity model)
- **Data never transmitted**: Plaintext passwords, master passwords, vault keys, recovery keys
- **UI**: "Check for compromised passwords" button in Vault Settings
- **Result**: Show warning if any item's password hash matches a breach, with option to rotate

### 13.2 Subscription Billing (NFR-098)

- **Goal**: Support premium features via subscription
- **Provider**: Stripe or PayPal
- **Data flow**:
  1. User clicks "Upgrade to Pro" → Stripe Checkout Session
  2. Successful payment → Stripe webhook → Supabase `user_subscriptions` table
  3. UI reflects premium features unlocked
- **Data stored**: `stripe_subscription_id`, `plan_type`, `status`, `current_period_end`
- **RLS**: Users can only view/update their own subscription row
- **Reflow**: Supabase Auth password reset does NOT cancel subscription

### 13.3 Optional Analytics (NFR-099)

- **Goal**: Optional usage telemetry (per privacy principle)
- **Opt-in required**: Must be disabled by default
- **Data sent**: Anonymized events (feature usage, vault item count, etc.)
- **No sensitive data**: Never send master passwords, vault contents, passwords
- **Opt-out**: Settings toggle to disable analytics collection (per NFR-088)
- **Storage**: `user_analytics` table with `event_type`, `timestamp`, anonymous `user_id`

### 13.4 Data Model Extensions

**breach_checks table:**
```sql
CREATE TABLE breach_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  password_hash TEXT NOT NULL,           -- SHA-256 hash (never plaintext!)
  is_compromised BOOLEAN DEFAULT FALSE,
  breach_name TEXT,
  breach_domain TEXT,
  checked_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, password_hash)
);
```

**user_subscriptions table:**
```sql
CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'enterprise')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due')),
  stripe_subscription_id TEXT UNIQUE,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**user_analytics table (optional):**
```sql
CREATE TABLE user_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL CHECK (event_type IN ('vault_item_add', 'vault_item_edit', 'vault_item_delete', 'login', 'password_check', 'subscription_view')),
  event_data JSONB DEFAULT '{}',
  ip_hash TEXT,                         -- SHA-256 of truncated IP, for trend analysis only
  user_agent_hash TEXT,                 -- SHA-256 of normalized user agent
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 13.5 Security Considerations for Third-Party Integration

| Threat | Mitigation |
|--------|------------|
| **Password hash leakage** | SHA-256 hash sent to HaveIBeenPwned only; no password sent |
| **Rate limiting abuse** | Per-user throttling in Edge Functions (max 5 checks/hour per user) |
| **API key exposure** | Store HaveIBeenPwned/API keys in Supabase secrets, NOT in client code |
| **Data correlation** | Use salted hashes; never send username+password combos to external services |
| **MITM attacks** | All external API calls over HTTPS only; validate response signatures |
| **Subscription fraud** | Stripe webhook signature verification; idempotent webhook handling |
| **Analytics data leakage** | Anonymized only; no vault contents, master passwords, or recovery keys |

### 13.6 Edge Function Example: Breach Check

**`supabase/functions/check-breach/index.js`:**
```javascript
export default async function handler(req) {
  const { passwordHash } = req.body;
  
  // Input validation
  if (!passwordHash || passwordHash.length !== 64) {
    return new Response(JSON.stringify({ error: 'Invalid hash' }), { status: 400 });
  }
  
  // Rate limiting: check user's recent breach check count
  // (implementation depends on Supabase Edge Function capabilities)
  
  // Call HaveIBeenPwned pwnedpasswords API
  const response = await fetch(`https://api.haveibeenpwned.com/pwnedpasswords/${passwordHash}`, {
    method: 'GET',
    headers: {
      'hibp-api-key': Deno.env.get('HIBP_API_KEY'), // From Supabase secrets
      'User-Agent': 'Password-Manager-App/1.0'
    }
  });
  
  if (!response.ok) {
    return new Response(JSON.stringify({ error: 'API error' }), { status: 502 });
  }
  
  const breachedData = await response.json();
  
  // Format response for frontend
  const result = {
    isCompromised: breachedData.length > 0,
    breachNames: breachedData.map(d => d Breach),
    count: breachedData.length
  };
  
  return new Response(JSON.stringify(result), { status: 200 });
}
```

### 13.7 Edge Function Example: Stripe Webhook

**`supabase/functions/stripe-webhook/index.js`:**
```javascript
export async function handler(req) {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, Deno.env.get('STRIPE_WEBHOOK_SECRET'));
  } catch (err) {
    console.log(`⚠️ Webhook signature verification failed.`, err.message);
    return new Response(`Webhook error: ${err.message}`, { status: 400 });
  }
  
  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Update user subscription in Supabase
      const { error } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: session.client_reference_id,
          stripe_subscription_id: session.id,
          plan_type: 'pro',
          status: 'active',
          current_period_end: new Date(session.current_period_end * 1000)
        }, { onConflict: 'user_id' });
      
      if (error) throw error;
      break;
    
    case 'invoice.payment_failed':
      // Handle failed payment
      break;
    
    case 'customer.subscription.deleted':
      // Handle cancellation
      break;
  }
  
  return new Response(JSON.stringify({ status: 'success' }), { status: 200 });
}
```

### 13.8 UI/UX Adjustments

- **Vault Settings**: Add "Security" section with "Check for compromised passwords" button
- **Subscription UI**: "Upgrade to Pro" button in Settings → Billing
- **Analytics toggle**: Settings → Privacy → "Allow optional usage analytics" (unchecked by default)
- **Warning indicators**: If any password appears in a breach, show red warning in vault list
- **Subscription status**: Display in header/profile area when user is logged in

### 13.9 Verification Checklist (for Third-Party Integration)

- [ ] **Zero-knowledge preserved**: No master password, vault key, or plaintext secret transmitted externally
- [ ] **Breach check uses only**: SHA-256 hash of password (64-char hex), never plaintext
- [ ] **Edge Functions secured**: API keys in Supabase secrets, not in client code
- [ ] **Rate limiting**: Per-user throttling configured (max 5 checks/hour)
- [ ] **Database RLS**: New tables (`breach_checks`, `user_subscriptions`, `user_analytics`) have `user_id = auth.uid()` policies
- [ ] **Hash format**: Client-side SHA-256 uses CryptoJS `CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex)`
- [ ] **UI states**: Loading, success, and error states handled for all third-party interactions
- [ ] **Error handling**: Graceful degradation if external API is unavailable
- [ ] **Opt-out functionality**: Analytics collection can be disabled in Settings
- [ ] **Subscription flow**: Stripe/Custom provider integration tested end-to-end
- [ ] **All 137 existing FRs**: Still functional after third-party integration
- [ ] **Performance**: External API calls complete within 2 seconds under normal conditions
- [ ] **Privacy**: No PII sent to third-party services (except what's necessary and consented)
- [ ] **Audit logging**: All third-party service interactions logged in application logs (without sensitive data)

### 13.10 Migration Checklist

- [ ] Create SQL migration for `breach_checks` table
- [ ] Create SQL migration for `user_subscriptions` table  
- [ ] Create SQL migration for `user_analytics` table (optional, opt-in)
- [ ] Deploy Edge Functions to Supabase
- [ ] Add Supabase secrets: `HIBP_API_KEY`, `STRIPE_WEBHOOK_SECRET`, etc.
- [ ] Configure CORS for Edge Functions (restrict to your domain)
- [ ] Test breach check with known compromised/non-compromised hashes
- [ ] Test Stripe checkout flow (use test mode)
- [ ] Test analytics opt-out toggle
- [ ] Verify RLS policies work correctly for all new tables
- [ ] Update documentation with new features and security considerations
- [ ] Run full test suite to ensure no regressions
```

| ID | Service | Purpose | Integration Method | Data Flow |
|----|---------|---------|-------------------|-----------|
| **NFR-097** | **HaveIBeenPwned** | Check compromised passwords | **Edge Function** + SHA-256 hash | Client → SHA-256 hash → Edge Function → API → result → Client |
| **NFR-098** | **Subscription Billing** | Pro feature access | **Stripe/Webhook** → Supabase | Client → Stripe → Webhook → DB → UI |
| **NFR-099** | **Optional Analytics** | Usage tracking (opt-in) | **Edge Function** + anonymized events | Client → anonymized event → Edge → DB |

### 13.1 Breach Monitoring (NFR-097)

- **Goal**: Identify if any stored passwords have appeared in known data breaches
- **Method**: Client-side SHA-256 hash of password sent to HaveIBeenPwned API (k-anonymity model)
- **Data never transmitted**: Plaintext passwords, master passwords, vault keys, recovery keys
- **UI**: "Check for compromised passwords" button in Vault Settings
- **Result**: Show warning if any item's password hash matches a breach, with option to rotate

### 13.2 Subscription Billing (NFR-098)

- **Goal**: Support premium features via subscription
- **Provider**: Stripe or PayPal
- **Data flow**:
  1. User clicks "Upgrade to Pro" → Stripe Checkout Session
  2. Successful payment → Stripe webhook → Supabase `user_subscriptions` table
  3. UI reflects premium features unlocked
- **Data stored**: `stripe_subscription_id`, `plan_type`, `status`, `current_period_end`
- **RLS**: Users can only view/update their own subscription row
- **Reflow**: Supabase Auth password reset does NOT cancel subscription

### 13.3 Optional Analytics (NFR-099)

- **Goal**: Optional usage telemetry (per privacy principle)
- **Opt-in required**: Must be disabled by default
- **Data sent**: Anonymized events (feature usage, vault item count, etc.)
- **No sensitive data**: Never send master passwords, vault contents, passwords
- **Opt-out**: Settings toggle to disable analytics collection (per NFR-088)
- **Storage**: `user_analytics` table with `event_type`, `timestamp`, anonymous `user_id`

### 13.4 Data Model Extensions

**breach_checks table:**
```sql
CREATE TABLE breach_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  password_hash TEXT NOT NULL,           -- SHA-256 hash (never plaintext!)
  is_compromised BOOLEAN DEFAULT FALSE,
  breach_name TEXT,
  breach_domain TEXT,
  checked_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, password_hash)
);
```

**user_subscriptions table:**
```sql
CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'enterprise')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due')),
  stripe_subscription_id TEXT UNIQUE,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**user_analytics table (optional):**
```sql
CREATE TABLE user_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL CHECK (event_type IN ('vault_item_add', 'vault_item_edit', 'vault_item_delete', 'login', 'password_check', 'subscription_view')),
  event_data JSONB DEFAULT '{}',
  ip_hash TEXT,                         -- SHA-256 of truncated IP, for trend analysis only
  user_agent_hash TEXT,                 -- SHA-256 of normalized user agent
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 13.5 Security Considerations for Third-Party Integration

| Threat | Mitigation |
|--------|------------|
| **Password hash leakage** | SHA-256 hash sent to HaveIBeenPwned only; no password sent |
| **Rate limiting abuse** | Per-user throttling in Edge Functions (max 5 checks/hour per user) |
| **API key exposure** | Store HaveIBeenPwned/API keys in Supabase secrets, NOT in client code |
| **Data correlation** | Use salted hashes; never send username+password combos to external services |
| **MITM attacks** | All external API calls over HTTPS only; validate response signatures |
| **Subscription fraud** | Stripe webhook signature verification; idempotent webhook handling |
| **Analytics data leakage** | Anonymized only; no vault contents, master passwords, or recovery keys |

### 13.6 Edge Function Example: Breach Check

**`supabase/functions/check-breach/index.js`:**
```javascript
export default async function handler(req) {
  const { passwordHash } = req.body;
  
  // Input validation
  if (!passwordHash || passwordHash.length !== 64) {
    return new Response(JSON.stringify({ error: 'Invalid hash' }), { status: 400 });
  }
  
  // Rate limiting: check user's recent breach check count
  // (implementation depends on Supabase Edge Function capabilities)
  
  // Call HaveIBeenPwned pwnedpasswords API
  const response = await fetch(`https://api.haveibeenpwned.com/pwnedpasswords/${passwordHash}`, {
    method: 'GET',
    headers: {
      'hibp-api-key': Deno.env.get('HIBP_API_KEY'), // From Supabase secrets
      'User-Agent': 'Password-Manager-App/1.0'
    }
  });
  
  if (!response.ok) {
    return new Response(JSON.stringify({ error: 'API error' }), { status: 502 });
  }
  
  const breachedData = await response.json();
  
  // Format response for frontend
  const result = {
    isCompromised: breachedData.length > 0,
    breachNames: breachedData.map(d => d Breach),
    count: breachedData.length
  };
  
  return new Response(JSON.stringify(result), { status: 200 });
}
```

### 13.7 Edge Function Example: Stripe Webhook

**`supabase/functions/stripe-webhook/index.js`:**
```javascript
export async function handler(req) {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, Deno.env.get('STRIPE_WEBHOOK_SECRET'));
  } catch (err) {
    console.log(`⚠️ Webhook signature verification failed.`, err.message);
    return new Response(`Webhook error: ${err.message}`, { status: 400 });
  }
  
  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Update user subscription in Supabase
      const { error } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: session.client_reference_id,
          stripe_subscription_id: session.id,
          plan_type: 'pro',
          status: 'active',
          current_period_end: new Date(session.current_period_end * 1000)
        }, { onConflict: 'user_id' });
      
      if (error) throw error;
      break;
    
    case 'invoice.payment_failed':
      // Handle failed payment
      break;
    
    case 'customer.subscription.deleted':
      // Handle cancellation
      break;
  }
  
  return new Response(JSON.stringify({ status: 'success' }), { status: 200 });
}
```

### 13.8 UI/UX Adjustments

- **Vault Settings**: Add "Security" section with "Check for compromised passwords" button
- **Subscription UI**: "Upgrade to Pro" button in Settings → Billing
- **Analytics toggle**: Settings → Privacy → "Allow optional usage analytics" (unchecked by default)
- **Warning indicators**: If any password appears in a breach, show red warning in vault list
- **Subscription status**: Display in header/profile area when user is logged in

### 13.9 Verification Checklist (for Third-Party Integration)

- [ ] **Zero-knowledge preserved**: No master password, vault key, or plaintext secret transmitted externally
- [ ] **Breach check uses only**: SHA-256 hash of password (64-char hex), never plaintext
- [ ] **Edge Functions secured**: API keys in Supabase secrets, not in client code
- [ ] **Rate limiting**: Per-user throttling configured (max 5 checks/hour)
- [ ] **Database RLS**: New tables (`breach_checks`, `user_subscriptions`, `user_analytics`) have `user_id = auth.uid()` policies
- [ ] **Hash format**: Client-side SHA-256 uses CryptoJS `CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex)`
- [ ] **UI states**: Loading, success, and error states handled for all third-party interactions
- [ ] **Error handling**: Graceful degradation if external API is unavailable
- [ ] **Opt-out functionality**: Analytics collection can be disabled in Settings
- [ ] **Subscription flow**: Stripe/Custom provider integration tested end-to-end
- [ ] **All 137 existing FRs**: Still functional after third-party integration
- [ ] **Performance**: External API calls complete within 2 seconds under normal conditions
- [ ] **Privacy**: No personally identifiable information sent to third-party services (except what's necessary and consented)
- [ ] **Audit logging**: All third-party service interactions logged in application logs (without sensitive data)

### 13.10 Migration Checklist

- [ ] Create SQL migration for `breach_checks` table
- [ ] Create SQL migration for `user_subscriptions` table  
- [ ] Create SQL migration for `user_analytics` table (optional, opt-in)
- [ ] Deploy Edge Functions to Supabase
- [ ] Add Supabase secrets: `HIBP_API_KEY`, `STRIPE_WEBHOOK_SECRET`, etc.
- [ ] Configure CORS for Edge Functions (restrict to your domain)
- [ ] Test breach check with known compromised/non-compromised hashes
- [ ] Test Stripe checkout flow (use test mode)
- [ ] Test analytics opt-out toggle
- [ ] Verify RLS policies work correctly for all new tables
- [ ] Update documentation with new features and security considerations
- [ ] Run full test suite to ensure no regressions
```