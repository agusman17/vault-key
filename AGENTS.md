# AGENTS.md

## Project
Password Manager Web Application — React TS + Supabase (authentication, database, storage).
Updated to support third-party service integration (breach monitoring, subscription billing, optional analytics).

## Technologies Used
- Frontend: React 19 (Vite), Tailwind CSS 4
- Backend/Database: Supabase (PostgreSQL, Authentication, Row Level Security)
- Encryption: Client-side AES-256 via CryptoJS, PBKDF2 (100,000 iterations) for key derivation
- Third-Party Integrations: Supabase Edge Functions (HaveIBeenPwned, Stripe, optional analytics)
- Architecture: Zero-knowledge — server never sees master password, vault key, or plaintext secrets

## Building & Running the Project
- Installation: `npm install`
- Development server: `npm run dev`
- Build the project: `npm run build`
- Deploy Edge Functions: `supabase function deploy`

## Engineering Instructions
- Read docs/PRD.md before implementation — especially Section 13 (Third-Party Service Integration) and Section 3 (Functional Requirements 1-144)
- Work on one module at a time. Priority: core auth → vault CRUD → key management → third-party integrations
- Use functional components and hooks
- All requests to Supabase must go through the `src/lib/supabase.js` file
- Never store passwords in plaintext within the database
- For third-party services: never transmit master password or vault data in plaintext; use SHA-256 hashes only
- New Requirement: Breach checking uses client-side SHA-256 hash sent to HaveIBeenPwned Edge Function (never plaintext password)
- New Requirement: Subscription billing flows through Stripe Checkout → Supabase webhook → `user_subscriptions` table
- New Requirement: Optional analytics disabled by default; opt-in toggle in Settings → Privacy
- Ask when requirements are ambiguous.
- Do not change unrelated files.
- Never claim tests passed unless executed.
- Explain changes and remaining risks.

## Folder Structure (Scalable Project Layout)

```
src/
├── main.tsx                 # Entry point
├── App.tsx                  # Routes + RequireAuth HOC
├── lib/
│   ├── supabase.ts          # Supabase client singleton
│   ├── crypto.ts            # All encryption/key management (stable v1.x)
│   └── api.ts               # API helpers, Edge Function wrappers
├── components/
│   ├── core/                # Core UI components (Button, Input, etc.)
│   │   └── Button.tsx
│   │   └── Input.tsx
│   ├── auth/                # Authentication components
│   │   ├── AuthForm.tsx
│   │   └── RecoveryKeyDisplay.tsx
│   ├── vault/               # Vault management components
│   │   ├── VaultList.tsx
│   │   ├── AddVaultItem.tsx
│   │   └── VaultItem.tsx
│   ├── settings/            # Settings page components
│   │   ├── SecuritySettings.tsx   # "Check for compromised passwords"
│   │   ├── BillingSettings.tsx    # Stripe subscription management
│   │   └── PrivacySettings.tsx    # Analytics opt-out toggle
│   └── shared/              # Shared UI components
│       └── LoadingSpinner.tsx
│       └── ErrorBoundary.tsx
├── pages/
│   ├── Vault.tsx            # Protected vault page
│   ├── Settings.tsx         # Main settings page
│   └── Dashboard.tsx        # Dashboard with security stats
├── hooks/
│   ├── useVault.ts          # Vault data fetching, CRUD operations
│   ├── useAuth.ts         # Authentication state & flows
│   ├── useBreachCheck.ts  # Breach check hook (SHA-256 hash → Edge Function)
│   └── useSubscription.ts # Subscription status hook
├── stores/
│   └── vaultStore.ts        # Zustand or Redux state management (stable v5)
│   └── subscriptionStore.ts # Subscription state
├── types/
│   ├── index.d.ts           # TypeScript interfaces for all props, state
│   ├── crypto.d.ts          # Encryption function types
│   └── api.d.ts             # Edge Function response types
├── utils/
│   ├── cn.classnames.ts     # Class name utility (stable v2)
│   ├── format.dates.ts      # Date formatting (date-fns stable v3)
│   └── validate.email.ts    # Email validation (stable v2)
└── constants/
    ├── routes.ts            # Route definitions
    ├── apiEndpoints.ts      # Edge Function URLs from Supabase secrets
    └── featureFlags.ts      # Feature flags (analytics opt-in, breach checking)
```

### Scalability Guidelines:
- **Add new features** by creating new files in appropriate subdirectories (core/auth/vault/settings/hooks/stores/types/utils/constants)
- **Keep components** dumb — they receive data via props and callbacks, no internal state management beyond UI concerns
- **Hooks encapsulate** logic — useVault, useAuth, useBreachCheck, useSubscription
- **Types provide** type safety across the entire app — TypeScript recommended
- **Utils are pure functions** — no side effects, easy to test
- **Constants centralize** configuration — routes, API endpoints, feature flags

## Library Versions (Stable, Production-Ready)

| Category | Library | Version | Rationale |
|----------|---------|---------|-----------|
| **Routing** | react-router-dom | ^6.8.0 | Stable, widely adopted, no breaking changes |
| **UI Styling** | tailwindcss | ^4.0.0 | Latest stable, JIT compiler |
| **Icons** | lucide-react | ^0.280.0 | Lightweight, accessible SVGs |
| **Date Formatting** | date-fns | ^2.30.0 | Modular, stable, tree-shakable |
| **State Management** | Zustand | ^4.4.0 | Simpler than Redux, zero boilerplate |
| **Form Handling** | react-hook-form | ^7.43.0 | Performant, minimal re-renders |
| **Validation** | zod | ^3.22.0 | Type-safe schema validation |
| **Clipboard** | @/clipboard.js | ^1.5.0 | Simple, reliable clipboard operations |
| **UUID** | uuid | ^9.0.0 | Standard UUID generation |
| **Supabase JS** | @supabase/supabase-js | ^2.39.0 | Latest stable, all features |
| **Crypto (client)** | crypto-js | ^4.2.0 | AES-256, PBKDF2, SHA-256 (no newer breaking changes) |

### Version Pinning Recommendation:
- Lock versions in `package.json` using `^` caret ranges for minor updates only
- Run `npm audit` regularly
- Update dependencies quarterly, not on every release
- AVOID: experimental prereleases, peer dependency conflicts, unmaintained packages

## Code Style Guidelines

### React Components
- **Functional components only** — no class components
- **Hooks at top level** — follow the Rules of Hooks
- **Single responsibility** — each component does one thing well
- **PropTypes for runtime** — optional, but good for development warnings
- **Default props** — provide sensible defaults where applicable

### Naming Conventions
- **Components**: PascalCase (Button, AuthForm, VaultList)
- **Hooks**: useCamelCase (useVault, useAuth, useBreachCheck)
- **Functions**: camelCase (encryptPassword, decryptPassword, checkBreach)
- **Constants**: UPPER_SNAKE_CASE (API_BASE_URL, PBKDF2_ITERATIONS)
- **Variables**: camelCase (masterKey, vaultKey, passwordHash)
- **File names**: camelCase (useVault.js, AuthForm.jsx, crypto.js)

### Code Patterns
- **Early returns** — guard clauses at the top of functions
- **Error handling** — try/catch with user-friendly messages
- **Loading states** — always show UI feedback during async operations
- **Error boundaries** — wrap critical component trees
- **Cleanup functions** — useEffect cleanup for subscriptions, timeouts

### TypeScript (Recommended)
- Define interfaces for all props and state
- Use TypeScript for Edge Function responses
- Strict mode enabled in tsconfig.json
- Types in `src/types/` directory, exported for reuse

### Commit Messages
- Format: `feat: add breach checking UI`, `fix: fix Stripe webhook handler`, `refactor: reorganize settings components`
- Reference relevant FR/NFR numbers when applicable
- Co-Authored-By: Claude Code <noreply@anthropic.com>

## Testing Guidelines

- **Unit tests** for utility functions (cn, format dates, validation)
- **Integration tests** for auth flows (login → vault → logout)
- **Edge Function tests** for breach check, stripe webhook
- **No tests** claimed as passed unless run and verified
- **Test environment** — use jest with react-testing-library
- **Coverage target** — minimum 80% for core functions (auth, encryption, RLS)

## Known Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| **Third-party API changes** | Edge Function layer abstracts external API; update Edge Function only |
| **Supabase RLS policy changes** | All DB access through supabase.js; policies documented in PRD Section 5 |
| **Crypto algorithm deprecation** | Use stable crypto-js v4.x; monitor NIST guidelines for PBKDF2 iterations |
| **Edge Function cold starts** | Keep functions lightweight; use Supabase edge schedule if needed |
| **Rate limiting on external APIs** | Per-user throttling in Edge Functions (max 5 breach checks/hour) |
| **Analytics opt-in rate** | Default opt-out; feature flag in constants/featureFlags.js |

## Recent Changes (from PRD Update)

- **Section 13 added**: Third-Party Service Integration (breach monitoring, subscription billing, optional analytics)
- **New components**: SecuritySettings, BillingSettings, PrivacySettings
- **New hooks**: useBreachCheck, useSubscription
- **New types**: API response types, feature flag types
- **New utilities**: hashPasswordForCheck, formatSubscriptionStatus
- **Updated Edge Functions**: check-breach, stripe-webhook

## Dependencies Update Checklist

- [ ] Run `npm audit` after any dependency update
- [ ] Test all auth flows after dependency changes
- [ ] Verify Edge Functions still compile with new supabase-js version
- [ ] Run full test suite: `npm test`
- [ ] Build production: `npm run build`
- [ ] Check TypeScript: `npx tsc --noEmit`
