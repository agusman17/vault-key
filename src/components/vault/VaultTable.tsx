import { useState } from 'react'
import { Star } from 'lucide-react'
import { ItemDetailDrawer } from './ItemDetailDrawer'
import type { VaultItem } from '@/types'

const columns = [
  { key: 'service', label: 'Service / Name', minW: 'min-w-[200px]' },
  { key: 'username', label: 'Username / Account', minW: 'min-w-[180px]' },
  { key: 'password', label: 'Decrypted Secret', minW: 'min-w-[220px]' },
  { key: 'totp', label: '2FA / TOTP', minW: 'min-w-[150px]' },
  { key: 'health', label: 'Health', minW: 'min-w-[120px]' },
  { key: 'folder', label: 'Folder & Tags', minW: 'min-w-[130px]' },
  { key: 'updated', label: 'Updated', minW: 'min-w-[110px]' },
  { key: 'actions', label: 'Actions', minW: 'w-24 text-right' },
]

const mockItems: VaultItem[] = [
  {
    id: '1',
    user_id: 'user-1',
    site_name: 'GitHub',
    username: 'octocat@company.com',
    encrypted_password: 'G#7$vK!9xZ0#mQpL',
    created_at: '2h ago',
    updated_at: '2h ago',
  },
  {
    id: '2',
    user_id: 'user-1',
    site_name: 'AWS Console',
    username: 'iam-admin-dev',
    encrypted_password: 'aW$91x#Lp092m!VzK',
    created_at: '1d ago',
    updated_at: '1d ago',
  },
  {
    id: '3',
    user_id: 'user-1',
    site_name: 'Stripe Dashboard',
    username: 'billing@startup.io',
    encrypted_password: 'str_live_9381kKll$2',
    created_at: '3d ago',
    updated_at: '3d ago',
  },
  {
    id: '4',
    user_id: 'user-1',
    site_name: 'Google Workspace',
    username: 'alex@acme.dev',
    encrypted_password: 'g00g!Enterprise92$x',
    created_at: '1w ago',
    updated_at: '1w ago',
  },
  {
    id: '5',
    user_id: 'user-1',
    site_name: 'Netflix',
    username: 'alex.personal@gmail.com',
    encrypted_password: 'k8#N!92xQv$L',
    created_at: '180d ago',
    updated_at: '180d ago',
  },
  {
    id: '6',
    user_id: 'user-1',
    site_name: 'DigitalOcean',
    username: 'ops-team@acme.dev',
    encrypted_password: 'do_pat_838vV190mP!#',
    created_at: '2w ago',
    updated_at: '2w ago',
  },
]

export function VaultTable() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<VaultItem | null>(null)
  const [revealedPw, setRevealedPw] = useState<Record<string, string>>({})

  const filteredItems = mockItems

  const togglePassword = (id: string, plain: string) => {
    setRevealedPw((prev) => ({
      ...prev,
      [id]: prev[id] ? '' : plain,
    }))
  }

  return (
    <>
      <div className="relative flex flex-col xl:flex-row gap-space-md items-start">
        <div className="w-full flex-1 bg-surface-container-low rounded-xl overflow-hidden shadow-md">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse" id="vault-table">
              <thead>
                <tr className="bg-surface-container-high text-on-surface-variant font-label-md text-label-md uppercase tracking-wider select-none">
                  <th className="py-space-sm px-space-md w-10 text-center">
                    <input
                      className="rounded bg-surface-container-highest cursor-pointer accent-primary"
                      type="checkbox"
                    />
                  </th>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={`py-space-sm px-space-md ${col.minW}`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container font-body-sm text-body-sm text-on-surface">
                {filteredItems.map((item) => {
                  const isCompromised = item.id === '5'
                  const showPw = revealedPw[item.id] === item.encrypted_password
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-surface-container/60 transition-colors group cursor-pointer ${
                        isCompromised ? 'bg-error-container/5' : ''
                      }`}
                      onClick={() => {
                        setSelectedItem(item)
                        setDrawerOpen(true)
                      }}
                    >
                      <td
                        className="py-space-sm px-space-md text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          className="rounded bg-surface-container-highest cursor-pointer accent-primary"
                          type="checkbox"
                        />
                      </td>
                      <td className="py-space-sm px-space-md">
                        <div className="flex items-center gap-space-sm">
                          <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center font-code-sm text-code-sm text-primary font-bold shadow-sm">
                            {item.site_name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-label-lg text-label-lg font-medium text-on-surface truncate">
                                {item.site_name}
                              </span>
                              <button
                                className="text-tertiary hover:scale-110 transition-transform"
                                onClick={(e) => {
                                  e.stopPropagation()
                                }}
                                type="button"
                              >
                                <Star size={18} />
                              </button>
                            </div>
                            <span className="font-body-sm text-body-sm text-outline truncate block">
                              {item.site_name.toLowerCase().replace(' ', '') + '.com'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-space-sm px-space-md">
                        <div className="flex items-center gap-1">
                          <span className="font-code-sm text-code-sm text-on-surface truncate">
                            {item.username}
                          </span>
                          <button
                            className="p-1 rounded hover:bg-surface-container-highest text-outline hover:text-on-surface transition-colors"
                            onClick={(e) => {
                              e.stopPropagation()
                            }}
                            type="button"
                            title="Copy Username"
                          >
                            <span className="material-symbols-outlined text-body-sm">
                              content_copy
                            </span>
                          </button>
                        </div>
                      </td>
                      <td
                        className="py-space-sm px-space-md"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-space-xs">
                          <span
                            className={`font-code-md text-code-md tracking-widest ${
                              showPw ? 'text-on-surface' : 'text-on-surface-variant'
                            } font-medium select-none`}
                            id={`pw-field-${item.id}`}
                          >
                            {showPw ? item.encrypted_password : '••••••••••••••••'}
                          </span>
                          <button
                            className="p-1 rounded hover:bg-surface-container-highest text-outline hover:text-primary transition-colors"
                            onClick={() => togglePassword(item.id, item.encrypted_password)}
                            title="Reveal Password"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-body-md">
                              visibility
                            </span>
                          </button>
                          <button
                            className="p-1 rounded hover:bg-surface-container-highest text-outline hover:text-secondary transition-colors"
                            onClick={(e) => {
                              e.stopPropagation()
                            }}
                            type="button"
                            title="Copy Password"
                          >
                            <span className="material-symbols-outlined text-body-md">
                              key
                            </span>
                          </button>
                        </div>
                      </td>
                      <td className="py-space-sm px-space-md">
                        <div className="inline-flex items-center gap-space-xs bg-surface-container px-2 py-1 rounded-lg">
                          <span className="material-symbols-outlined text-secondary text-body-sm">
                            timer
                          </span>
                          <span className="font-code-sm text-code-sm text-secondary font-semibold">
                            492 810
                          </span>
                          <div className="relative w-3.5 h-3.5">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                              <circle
                                className="stroke-surface-container-highest"
                                cx="18"
                                cy="18"
                                fill="none"
                                r="15"
                                strokeWidth="4"
                              ></circle>
                              <circle
                                className="stroke-secondary"
                                cx="18"
                                cy="18"
                                fill="none"
                                r="15"
                                strokeDasharray="94.2"
                                strokeDashoffset="18"
                                strokeWidth="4"
                              ></circle>
                            </svg>
                          </div>
                        </div>
                      </td>
                      <td className="py-space-sm px-space-md">
                        <span className="px-space-xs py-0.5 rounded-full bg-secondary-container/20 text-secondary font-code-sm text-code-sm font-medium inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                          Strong (98%)
                        </span>
                      </td>
                      <td className="py-space-sm px-space-md">
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="font-label-md text-label-md text-on-surface-variant">
                            Work
                          </span>
                          <span className="font-code-sm text-code-sm px-1 rounded bg-surface-container text-primary">
                            #dev
                          </span>
                        </div>
                      </td>
                      <td className="py-space-sm px-space-md font-code-sm text-code-sm text-outline">
                        {item.updated_at}
                      </td>
                      <td
                        className="py-space-sm px-space-md text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <button
                            className="p-1 rounded hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface"
                            onClick={() => {
                              setSelectedItem(item)
                              setDrawerOpen(true)
                            }}
                            title="Edit Item"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-body-md">
                              edit
                            </span>
                          </button>
                          <button
                            className="p-1 rounded hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface"
                            type="button"
                            title="Share Item"
                          >
                            <span className="material-symbols-outlined text-body-md">
                              share
                            </span>
                          </button>
                          <button
                            className="p-1 rounded hover:bg-surface-container-highest text-outline hover:text-error"
                            type="button"
                            title="Delete"
                          >
                            <span className="material-symbols-outlined text-body-md">
                              delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="p-space-md bg-surface-container flex flex-col sm:flex-row items-center justify-between gap-space-sm">
            <div className="flex items-center gap-space-sm font-body-sm text-body-sm text-on-surface-variant">
              <span>
                Showing <span className="font-semibold text-on-surface">1 - 6</span> of{' '}
                <span className="font-semibold text-on-surface">36</span> items
              </span>
              <span className="hidden sm:inline text-outline">•</span>
              <span className="font-code-sm text-code-sm text-secondary flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                Client Hash: sha256:7f49c...9a
              </span>
            </div>
            <div className="flex items-center gap-space-xs">
              <button
                className="p-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-outline disabled:opacity-40"
                disabled
                type="button"
              >
                <span className="material-symbols-outlined text-body-md">
                  chevron_left
                </span>
              </button>
              <button
                className="px-space-sm py-1 rounded-lg bg-primary-container text-on-primary-container font-code-sm text-code-sm font-semibold"
                type="button"
              >
                1
              </button>
              <button
                className="px-space-sm py-1 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant font-code-sm text-code-sm"
                type="button"
              >
                2
              </button>
              <button
                className="px-space-sm py-1 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant font-code-sm text-code-sm"
                type="button"
              >
                3
              </button>
              <button
                className="p-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface"
                type="button"
              >
                <span className="material-symbols-outlined text-body-md">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </div>

        {drawerOpen && selectedItem && (
          <ItemDetailDrawer
            item={selectedItem}
            onClose={() => setDrawerOpen(false)}
          />
        )}
      </div>
    </>
  )
}
