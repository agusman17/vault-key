# Vault Key

<p align="center">
  <b>A zero-knowledge, client-side encrypted password manager.</b><br>
  Built with React 19, TypeScript, Tailwind CSS 4, and Supabase.
</p>

<p align="center">
  <a href="https://react.dev/">
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React 19">
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-6.x-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
  </a>
  <a href="https://tailwindcss.com/">
    <img src="https://img.shields.io/badge/Tailwind_CSS-4.x-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4">
  </a>
  <a href="https://vitejs.dev/">
    <img src="https://img.shields.io/badge/Vite-8.x-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite">
  </a>
  <a href="https://supabase.com/">
    <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase">
  </a>
  <a href="https://github.com/oxc-project/oxlint">
    <img src="https://img.shields.io/badge/Lint-Oxlint-3D8BFD?style=flat-square&logo=oxlint&logoColor=white" alt="Oxlint">
  </a>
</p>

---

## 🔐 About Vault Key

Vault Key is a **zero-knowledge password manager** web application. Your master password, vault key, and plaintext secrets never leave your device — all encryption happens client-side using AES-256 (via CryptoJS) with PBKDF2 key derivation (100,000 iterations). Supabase stores only wrapped ciphertexts and hashes, so even the server cannot decrypt your vault.

### Core security model

| Component | Storage | Protected by |
|-----------|---------|--------------|
| Master Password | Client memory only | Never transmitted or stored |
| Vault Key | Supabase (`user_keys`) | Wrapped with PBKDF2-derived key (master password) or Recovery Key |
| Recovery Key | Supabase (`user_keys`) | SHA-256 hash only |
| Vault Items | Supabase (`vault_items`) | AES-256 ciphertext per item |
| Row Access | RLS policies | `user_id = auth.uid()` |

---

## ✨ Features

### Authentication & Onboarding
- 🔑 **Email/Password Sign Up** — Register with email + master password (≥6 chars)
- 🔓 **Email/Password Login** — Client derives key, unlocks vault key, migrates legacy items
- 🗝️ **Recovery Key** — Human-readable Base32 key shown once at signup/reset; copy & download (.txt)
- 🔄 **Forgot Master Password** — Email → OTP → Recovery Key → New Password flow (vault preserved)
- ⚠️ **Destructive Vault Reset** — New vault key + recovery key when recovery key is lost

### Vault Management
- 📋 **List Vault Items** — Site name, username, masked passwords (`••••••••`)
- ➕ **Add Vault Item** — Client-side AES-256 encryption before upload
- ✏️ **Edit Vault Item** — Update site/username; optional password re-encryption
- 🗑️ **Delete Vault Item** — Confirmation dialog, RLS-enforced ownership
- 👁️ **Reveal Password** — Per-item client-side decryption toggle
- 🔁 **Legacy Migration** — Re-encrypts legacy items on first login after vault setup

### Settings & Integrations
- 🛡️ **Breach Monitoring** — Client-side SHA-256 hash checked via HaveIBeenPwned Edge Function (never plaintext)
- 💳 **Subscription Billing** — Stripe Checkout → Supabase webhook → `user_subscriptions`
- 📊 **Optional Analytics** — Disabled by default; opt-in toggle in Settings → Privacy
- 🎨 **Theme Toggle** — Light/dark mode support

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | React 19 | UI |
| Language | TypeScript 6 | Type safety |
| Build Tool | Vite 8 | Dev server & production build |
| Styling | Tailwind CSS 4 | Utility-first CSS |
| Icons | lucide-react | SVG icons |
| State | Zustand 4 | Vault & subscription state |
| Forms | react-hook-form + zod | Form handling & validation |
| Routing | react-router-dom 6 | Client-side routing |
| Backend | Supabase | Auth, PostgreSQL, RLS, Edge Functions |
| Encryption | crypto-js 4 | AES-256, PBKDF2, SHA-256 |
| Dates | date-fns 2 | Date formatting |
| Linting | Oxlint | Code linting |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm (or pnpm/yarn)
- A Supabase project with Email Auth enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/vault-key.git
cd vault-key

# Install dependencies
npm install

# Copy the example environment file
cp .env.example .env
```

### Environment Configuration

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

> **Security:** Never commit your `.env` file. It is already listed in `.gitignore`.

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Enable **Email Auth** (disable "Confirm email" for instant vault setup, or keep it enabled for the verification flow)
3. Run migrations to create the `user_keys` and `vault_items` tables with Row Level Security (RLS) policies:
   ```sql
   -- RLS policies enforce: user_id = auth.uid()
   ```
4. Optionally deploy Edge Functions for third-party integrations:
   ```bash
   supabase function deploy check-breach
   supabase function deploy stripe-webhook
   ```
5. Add required secrets in the Supabase Dashboard (e.g., `HIBP_API_KEY`, `STRIPE_WEBHOOK_SECRET`)

### Running the App

```bash
# Development server (with HMR)
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview

# Lint the codebase
npm run lint
```

Open the URL shown by Vite (typically `http://localhost:5173`) in your browser.

---

## 📁 Project Structure

```
src/
├── main.tsx                 # Entry point
├── App.tsx                  # Routes + RequireAuth HOC
├── lib/
│   ├── supabase.ts          # Supabase client singleton
│   ├── crypto.ts            # Encryption/key management
│   └── api.ts               # Edge Function wrappers
├── components/
│   ├── core/                # Core UI (Button, Input, Sidebar, ThemeToggle)
│   ├── auth/                # AuthForm, RecoveryKeyDisplay
│   ├── vault/               # VaultList, AddVaultItem, VaultItem, etc.
│   ├── settings/            # SecuritySettings, BillingSettings, PrivacySettings
│   └── shared/              # LoadingSpinner, ErrorBoundary
├── pages/                   # Vault, Settings, Dashboard
├── hooks/                   # useVault, useAuth, useBreachCheck, useSubscription
├── stores/                  # vaultStore, subscriptionStore
├── types/                   # TypeScript interfaces
├── utils/                   # cn, format.dates, validate.email
└── constants/               # routes, apiEndpoints, featureFlags
```

---

## 🤝 Contributing

Contributions are welcome! Please read the guidelines below before submitting a pull request.

### How to Contribute

1. **Fork** the repository and create your branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the code style guidelines:
   - Functional components only (no class components)
   - Hooks at the top level (Rules of Hooks)
   - TypeScript interfaces for all props and state
   - Early returns / guard clauses
   - Try/catch with user-friendly error messages
   - Loading states during async operations

3. **Lint and typecheck** your code:
   ```bash
   npm run lint
   npx tsc --noEmit
   ```

4. **Test** your changes manually across key flows (signup, login, vault CRUD, recovery).

5. **Commit** using conventional commits:
   ```bash
   git commit -m "feat: add breach checking UI"
   git commit -m "fix: handle Stripe webhook idempotency"
   git commit -m "refactor: reorganize settings components"
   ```

6. **Push** and open a Pull Request:
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Format

```
type: short description

Examples:
feat: add recovery key download button
fix: correct PBKDF2 iteration count in crypto module
refactor: extract Edge Function wrappers into api.ts
```

Refer to relevant FR/NFR numbers from `docs/PRD.md` when applicable.

### Code Review

All pull requests require review before merging. Ensure:
- No secrets or keys are committed
- Master passwords and vault data are never transmitted in plaintext
- RLS policies remain intact for all database changes
- TypeScript strict mode passes

---

## 📄 License

This project is private and proprietary.

---

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) — Backend, Auth, and database
- [CryptoJS](https://github.com/brix/crypto-js) — Client-side cryptography
- [Tailwind CSS](https://tailwindcss.com/) — Styling
- [lucide-react](https://lucide.dev/) — Icons
- [HaveIBeenPwned](https://haveibeenpwned.com/) — Breach data source
- [Stripe](https://stripe.com/) — Subscription billing

---

<p align="center">
  <b>Built with ❤️ for secure password management.</b>
</p>
