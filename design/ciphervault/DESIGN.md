---
name: CipherVault
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#bfc7d2'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#89929b'
  outline-variant: '#3f4850'
  surface-tint: '#93ccff'
  primary: '#93ccff'
  on-primary: '#003351'
  primary-container: '#3198dc'
  on-primary-container: '#002c47'
  inverse-primary: '#006398'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#c3c0ff'
  on-tertiary: '#1d00a5'
  tertiary-container: '#8582ff'
  on-tertiary-container: '#180092'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#cce5ff'
  primary-fixed-dim: '#93ccff'
  on-primary-fixed: '#001d31'
  on-primary-fixed-variant: '#004b73'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#e2dfff'
  tertiary-fixed-dim: '#c3c0ff'
  on-tertiary-fixed: '#0f0069'
  on-tertiary-fixed-variant: '#3323cc'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 2.25rem
    fontWeight: '600'
    lineHeight: 2.75rem
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Geist
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: 2.25rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 1.25rem
    fontWeight: '500'
    lineHeight: 1.75rem
    letterSpacing: -0.015em
  body-lg:
    fontFamily: Geist
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
    letterSpacing: -0.005em
  body-md:
    fontFamily: Geist
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.375rem
    letterSpacing: 0em
  body-sm:
    fontFamily: Geist
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1.125rem
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Geist
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: 1.25rem
    letterSpacing: 0.01em
  label-md:
    fontFamily: Geist
    fontSize: 0.75rem
    fontWeight: '500'
    lineHeight: 1rem
    letterSpacing: 0.02em
  code-lg:
    fontFamily: JetBrains Mono
    fontSize: 1rem
    fontWeight: '500'
    lineHeight: 1.5rem
    letterSpacing: 0.05em
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.375rem
    letterSpacing: 0.04em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1.125rem
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system projects absolute cryptographic trust, institutional precision, and modern operational speed. Built for security-conscious professionals, engineers, and enterprises, the interface avoids decorative excess in favor of razor-sharp clarity, immediate scanability, and effortless confidence.

The visual direction merges **Minimalist Precision** with **Engineered High-Trust Surface Styling**:
- **Calm Authority**: Interfaces remain tranquil under stress; critical breach alerts cut through with surgical intent without evoking panic.
- **Instrument-Grade Tactility**: Micro-interactions, crisp hair-line boundaries, and zero-latency state transitions convey the feel of an uncompromising physical hardware security key.
- **Zero-Knowledge Transparency**: Cryptographic actions (local decryption, hash-generation, vault unlocking) use explicit visual verification affordances, letting users physically see client-side boundaries.

## Colors

The color architecture is built for rigorous status signaling, high contrast, and cryptographic isolation. It uses dark mode as the native default for reduced fatigue in mission-critical environments while supporting an ultra-crisp daylight mode.

### Theme Palette Roles

- **Primary (`#0284C7` / `#38BDF8`)**: Electric Cyan-Sky. Guides primary action flows, active authentication states, and system-level focus rings.
- **Secondary / Secure (`#10B981` / `#34D399`)**: Emerald. Exclusively reserved for zero-compromise states, hardened password strength ratings, 2FA confirmation, and encrypted status indicators.
- **Tertiary / Cryptographic (`#4F46E5` / `#818CF8`)**: Deep Indigo. Dedicated to cryptographic primitives: recovery seeds, zero-knowledge keys, master vault configurations, and administrative token boundaries.
- **Warning (`#F59E0B` / `#FBBF24`)**: Amber. Used for decaying passwords, unverified email addresses, and medium-risk audit findings.
- **Destructive / Compromised (`#EF4444` / `#F87171`)**: Crimson Rose. Reserved strictly for breached credentials, exposed vault sessions, and permanent item deletions.

### Surface Tones

- **Dark Default Canvas**: Base canvas sits on `#090D16`, ascending to `#0F172A` (Sidebar/Shelves), `#1E293B` (Cards/Panels), and `#334155` (Borders/Dividers). Text rests at `#F8FAFC` (100%), `#94A3B8` (70%), and `#64748B` (40%).
- **Light Alternative Canvas**: Base canvas sits on `#FFFFFF`, ascending to `#F8FAFC` (Panels), `#F1F5F9` (Hover/Secondary surfaces), and `#E2E8F0` (Structural dividers). High-contrast text sits at `#0F172A` (100%), `#334155` (80%), and `#64748B` (55%).

## Typography

Typography prioritizes tabular legibility, zero ambiguity between homoglyphs (such as `0` vs `O`, `1` vs `l`), and strict horizontal rhythm.

- **Primary Interface Font**: `Geist`. Engineered for density, neutral rendering, and high-frequency UI interactions.
- **Data & Cipher Font**: `JetBrains Mono`. Applies to recovery seeds, hex hashes, decrypted credentials, generated passwords, OTP verification codes, and client-side entropy telemetry.
- **Tabular Numerics**: Both Geist and JetBrains Mono must have OpenType feature `tnum` (tabular figures) active by default on all counters, health grades, and timestamp displays.
- **Password Masking Glyphs**: Masked secret displays must utilize centered bullets (`U+2022`) rendered with non-proportional letter spacing matching monospace proportions to prevent visual width estimation leaks.

## Layout & Spacing

The layout is built on a high-density, multi-pane structural framework tailored for swift keyboard navigation and data-dense information architectures.

### Layout Model
- **3-Pane Master-Detail Canvas (Desktop >= 1200px)**:
  1. *Navigation Shelf* (240px fixed): Vault selectors, security health dashboards, folders, tags, trash.
  2. *Entity List* (360px - 420px fluid): Search bar, filter toggles, sorting, and micro-cards for vault records.
  3. *Inspection Workspace* (remaining space, min 560px): Detailed decrypted record, field audits, history timeline, and recovery tools.
- **Dual-Pane Tablet (768px - 1199px)**: Collapsible iconized navigation rail (64px) with combined master-detail view.
- **Single-Stream Mobile (< 768px)**: Stacked views with deep navigation drill-down, sticky action sheets, and fixed bottom thumb-reach bars.

### Spacing Discipline
- Strict 4px/8px coordinate snapping.
- Form inputs, list rows, and telemetry chips maintain a persistent internal cell height (e.g., standard action height: 36px desktop / 44px mobile for touch accuracy).

## Elevation & Depth

Visual depth avoids heavy, murky shadows in favor of layered structural planes, hair-line border delimiters, and tactical glassmorphism.

### Depth Hierarchy

1. **Base Deck (0dp)**: Canvas ground (`#090D16` dark / `#FFFFFF` light). No shadow.
2. **Surface Deck (1dp)**: Primary panels, master list rows, navigation shelves. Separated solely by a 1px border (`#1E293B` dark / `#E2E8F0` light) or 50% translucent equivalent.
3. **Elevated Cards (2dp)**: Vault entry active states, security score meters, floating toolbars. 
   - *Border*: 1px solid `rgba(255, 255, 255, 0.08)` (Dark) / `rgba(15, 23, 42, 0.08)` (Light).
   - *Shadow*: `0 4px 20px -2px rgba(0, 0, 0, 0.35), 0 2px 6px -1px rgba(0, 0, 0, 0.2)`.
4. **Modal & Floating Cryptographic Palettes (3dp)**: Password generator flyouts, fast switcher (`Cmd+K`), master key entry dialogues.
   - *Backdrop*: `backdrop-filter: blur(16px) saturate(180%)`.
   - *Surface*: `rgba(15, 23, 42, 0.85)` (Dark) / `rgba(255, 255, 255, 0.90)` (Light).
   - *Shadow*: `0 24px 48px -12px rgba(0, 0, 0, 0.6)`.

Focus states reject default browser rings in favor of a crisp 2px offset border using `rgba(2, 132, 199, 0.65)` accompanied by a subtle `0 0 12px rgba(2, 132, 199, 0.25)` luminance bloom.

## Shapes

The design system employs a **Soft** shape language (roundedness level `1`), balancing technical exactness with contemporary product design.

### Geometry Architecture
- **Micro Elements (Chips, Checkboxes, Favicon containers)**: `4px` (`0.25rem`). Maintains sharp geometric fidelity in dense spaces.
- **Interactive Controls (Inputs, Primary/Ghost Buttons, Dropdowns)**: `6px` (`0.375rem`). Precise corners that fit alongside code and monospace data.
- **Containers & Surfaces (Cards, Modals, Detail Panels)**: `8px` (`0.5rem`). Clean, unexaggerated framing for sensitive data blocks.
- **Pill Exception**: Master security health score badges and copy confirmation micro-pills use full circular radius (`9999px`) to immediately visually distinguish them from data inputs and interactive surfaces.

## Components

### Buttons & Quick Actions
- **Primary**: Solid `#0284C7` (Dark mode hover: `#38BDF8`), contrasting white text, subtle inner top bevel (`inset 0 1px 0 rgba(255,255,255,0.2)`).
- **Secondary / Ghost**: `#1E293B` background with a 1px border of `rgba(255,255,255,0.08)`. Hover changes fill to `#334155`.
- **Copy-to-Clipboard**: Dual-state icon button. Idle shows clipboard icon with tooltip. On click, shifts to `#10B981` with checkmark icon and flashes the label "Copied!" for 1500ms before silent reset.

### Vault List Items
- **Structure**: 64px fixed row. Left: 32px rounded square containing the service favicon or a two-letter fallback moniker. Center: item title (`label-lg`), decrypted username (`body-sm` muted). Right: tag badges, 2FA indicator pin, and overflow trigger.
- **Selected State**: Subtle left indicator line (2px `#0284C7`), background filled with `rgba(2, 132, 199, 0.08)`.

### Secret Field & Password Masking
- Single-click reveal toggle using an eye/eye-off icon.
- Password value rendered in `JetBrains Mono`. Unrevealed state replaces string with non-collapsing dots matching the exact character count.
- Integrated inline password strength bar below input: 4 segments transitioning across Red (`#EF4444`), Orange (`#F97316`), Amber (`#F59E0B`), and Emerald (`#10B981`).

### Recovery Key Block
- Displayed in a 4x4 or 6x4 modular grid of monospace mini-boxes.
- Each key group (e.g., `W7X9-K2L1-90PQ-ZZ41`) is displayed in an individual read-only field featuring an explicit index number (`01`, `02`, etc.) in micro-typography (`0.65rem`) to eliminate transcription mistakes.

### Security Health Indicators & Breach Alerts
- **Health Grade Gauge**: Pill container featuring a circular progress track showing system entropy rating (0–100%) paired with semantic color coding.
- **Breach Alert Banner**: Bordered card in dark crimson (`rgba(239, 68, 68, 0.1)`) with a 1px border of `rgba(239, 68, 68, 0.3)`. Contains alert diamond icon, domain identifier, timestamp of leak, and a one-click "Rotate Password" workflow trigger.

### Search & Filter Command Bar
- Persistent top-level search input with shortcut hint (`Cmd+K`).
- Integrated filter chips for "Logins", "Secure Notes", "Credit Cards", "Identities", and "Breached". Active chips show a solid background with a close affordance.