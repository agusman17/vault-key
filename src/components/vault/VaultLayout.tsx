import { useState } from 'react'
import { Sidebar } from '../core'
import { TopNav } from '../core'
import { VaultTable } from './VaultTable'

const filterChips = [
  { label: 'All Credentials (36)', active: true, icon: 'shield' },
  { label: 'Favorites (8)', active: false, icon: 'star', color: 'text-tertiary' },
  { label: 'Work (18)', active: false, icon: 'business_center', color: 'text-primary' },
  { label: 'Personal (12)', active: false, icon: 'person', color: 'text-secondary' },
  { label: 'Recently Added (4)', active: false, icon: 'schedule' },
]

export function VaultLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="flex h-screen bg-surface text-on-surface">
      <Sidebar collapsed={!sidebarOpen} />

      <div className="flex-1 flex-col min-w-0 relative z-0">
        <TopNav
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          searchQuery={searchQuery}
          onSearchChange={(e) => setSearchQuery(e)}
        />

        <main className="flex-1 overflow-y-auto pb-space-lg min-h-0">
          <div className="px-space-md lg:px-space-lg space-y-space-md">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
              <div className="flex items-center gap-space-sm flex-wrap">
                <h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">
                  Logins & Passwords
                </h1>
                <span className="px-space-xs py-0.5 rounded-full bg-surface-container-high font-code-sm text-code-sm text-primary font-medium">
                  36 items
                </span>
                <div className="flex items-center gap-1 px-space-xs py-0.5 rounded-full bg-secondary-container/20 text-secondary font-code-sm text-code-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                  <span>Zero-Knowledge Decrypted</span>
                </div>
              </div>

              <div className="flex items-center gap-space-xs sm:gap-space-sm flex-wrap">
                <div className="relative inline-block text-left">
                  <button
                    className="flex items-center gap-space-xs px-space-sm py-space-xs rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors shadow-sm"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-body-md">
                      checklist
                    </span>
                    <span>Batch Actions</span>
                    <span className="material-symbols-outlined text-body-sm">
                      expand_more
                    </span>
                  </button>
                </div>
                <div className="relative inline-block text-left">
                  <button
                    className="flex items-center gap-space-xs px-space-sm py-space-xs rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors shadow-sm"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-body-md">
                      swap_horiz
                    </span>
                    <span>Import / Export</span>
                    <span className="material-symbols-outlined text-body-sm">
                      expand_more
                    </span>
                  </button>
                </div>
                <button
                  className="flex items-center gap-space-xs bg-primary text-on-primary px-space-md py-space-xs rounded-lg font-label-lg text-label-lg hover:bg-primary-fixed transition-all shadow-md"
                  type="button"
                >
                  <span className="material-symbols-outlined text-body-md font-semibold">
                    add
                  </span>
                  <span>Add Vault Item</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between overflow-x-auto pb-1 gap-space-xs">
              <div className="flex items-center gap-space-xs min-w-max">
                {filterChips.map((chip) => (
                  <button
                    key={chip.label}
                    className={`px-space-md py-1.5 rounded-lg font-label-md text-label-md font-medium transition-colors shadow-sm flex items-center gap-1 ${
                      chip.active
                        ? 'bg-primary-container text-on-primary-container'
                        : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface'
                    }`}
                    type="button"
                  >
                    <span
                      className={`material-symbols-outlined text-body-sm ${chip.color ?? ''}`}
                    >
                      {chip.icon}
                    </span>
                    {chip.label}
                  </button>
                ))}
              </div>
              <div className="hidden xl:flex items-center gap-space-xs pl-space-md font-code-sm text-code-sm text-outline">
                <span className="material-symbols-outlined text-body-sm text-secondary">
                  verified
                </span>
                <span>Hardware Security Key Authenticated</span>
              </div>
            </div>

            <div className="bg-surface-container-low p-space-sm rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-sm shadow-sm">
              <div className="flex-1 relative">
                <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-outline text-body-lg pointer-events-none">
                  search
                </span>
                <input
                  className="w-full bg-surface-container text-on-surface placeholder-outline pl-10 pr-24 py-space-xs rounded-lg font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-high transition-colors"
                  id="vault-search-input"
                  placeholder="Search site name, username, URL, or tag (Ctrl+K)..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute right-space-sm top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <span className="font-code-sm text-code-sm px-1.5 py-0.5 rounded bg-surface-container-highest text-outline">
                    ⌘K
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-space-xs flex-wrap">
                <div className="relative">
                  <select
                    className="appearance-none bg-surface-container text-on-surface font-label-md text-label-md pl-space-sm pr-7 py-space-xs rounded-lg cursor-pointer focus:outline-none"
                  >
                    <option>All Folders</option>
                    <option>Work (18)</option>
                    <option>Personal (12)</option>
                    <option>Finance (4)</option>
                    <option>Cloud & Infra (2)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-space-xs top-1/2 -translate-y-1/2 text-outline text-body-sm pointer-events-none">
                    expand_more
                  </span>
                </div>
                <div className="flex items-center gap-1 overflow-x-auto">
                  <button className="px-space-xs py-0.5 rounded bg-surface-container text-primary font-code-sm text-code-sm hover:bg-surface-container-high transition-colors" type="button">
                    #production
                  </button>
                  <button className="px-space-xs py-0.5 rounded bg-surface-container text-on-surface-variant hover:text-primary font-code-sm text-code-sm hover:bg-surface-container-high transition-colors" type="button">
                    #cloud
                  </button>
                  <button className="px-space-xs py-0.5 rounded bg-surface-container text-on-surface-variant hover:text-primary font-code-sm text-code-sm hover:bg-surface-container-high transition-colors" type="button">
                    #finance
                  </button>
                </div>
                <div className="relative">
                  <select
                    className="appearance-none bg-surface-container text-on-surface font-label-md text-label-md pl-space-sm pr-7 py-space-xs rounded-lg cursor-pointer focus:outline-none"
                  >
                    <option>Sort: Last Modified</option>
                    <option>Sort: Name A-Z</option>
                    <option>Sort: Security Score</option>
                    <option>Sort: Password Age</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-space-xs top-1/2 -translate-y-1/2 text-outline text-body-sm pointer-events-none">
                    sort
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-error-container/20 rounded-xl p-space-md flex flex-col md:flex-row items-start md:items-center justify-between gap-space-sm shadow-sm">
              <div className="flex items-center gap-space-sm">
                <div className="p-2 rounded-lg bg-error-container text-on-error-container">
                  <span className="material-symbols-outlined text-headline-md">
                    gpp_maybe
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-space-xs">
                    <span className="font-label-lg text-label-lg font-semibold text-on-surface">
                      1 Compromised Password Detected
                    </span>
                    <span className="font-code-sm text-code-sm px-1.5 py-0.5 rounded bg-error-container text-on-error-container">
                      Urgent
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Netflix password appeared in an external third-party data leak compilation. We advise instant credential rotation.
                  </p>
                </div>
              </div>
              <button
                className="flex items-center gap-space-xs px-space-md py-space-xs bg-error text-on-error font-label-md text-label-md rounded-lg hover:opacity-90 transition-opacity"
                type="button"
              >
                <span className="material-symbols-outlined text-body-md">
                  lock_reset
                </span>
                <span>Review & Rotate</span>
              </button>
            </div>

            <VaultTable />
          </div>
        </main>
      </div>
    </div>
  )
}
