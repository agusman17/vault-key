import { useState } from 'react'
import { type VaultItem } from '@/types'

export function ItemDetailDrawer({ item, onClose }: { item: VaultItem; onClose: () => void }) {
  const [showPw, setShowPw] = useState(false)

  return (
    <div className="w-full xl:w-[440px] bg-surface-container-low rounded-xl p-space-md shadow-xl flex flex-col gap-space-md shrink-0 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-primary text-headline-md">
            shield_lock
          </span>
          <div>
            <span className="font-label-md text-label-md text-outline uppercase tracking-wider block">
              Decrypted Record
            </span>
            <h2 className="font-headline-md text-headline-md text-on-surface font-semibold leading-tight">
              {item.site_name}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-space-xs">
          <button
            className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-tertiary"
            type="button"
          >
            <span className="material-symbols-outlined text-body-md" style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
          </button>
          <button
            className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface"
            onClick={onClose}
            type="button"
          >
            <span className="material-symbols-outlined text-body-md">
              close
            </span>
          </button>
        </div>
      </div>

      <div className="bg-surface-container p-space-sm rounded-lg flex items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-sm min-w-0">
          <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center font-code-lg text-code-lg font-bold">
            {item.site_name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="font-label-lg text-label-lg text-on-surface font-medium truncate">
              https://{item.site_name.toLowerCase().replace(' ', '')}.com/login
            </div>
            <span className="font-code-sm text-code-sm text-outline">Auto-fill matched</span>
          </div>
        </div>
        <a
          className="p-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-primary"
          href={`https://${item.site_name.toLowerCase().replace(' ', '')}.com`}
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="material-symbols-outlined text-body-md">
            open_in_new
          </span>
        </a>
      </div>

      <div className="space-y-space-sm">
        <div className="space-y-1">
          <label className="font-label-md text-label-md text-on-surface-variant flex items-center justify-between">
            <span>Username / Email</span>
            <button
              className="font-code-sm text-code-sm text-primary hover:underline"
              type="button"
            >
              Copy
            </button>
          </label>
          <div className="flex items-center justify-between bg-surface-container px-space-md py-space-xs rounded-lg">
            <input
              className="bg-transparent font-body-sm text-body-sm text-on-surface w-full focus:outline-none"
              readOnly
              type="text"
              value={item.username}
            />
            <span className="material-symbols-outlined text-outline text-body-md">
              person
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between font-label-md text-label-md text-on-surface-variant">
            <span>Password</span>
            <div className="flex items-center gap-space-xs">
              <button
                className="font-code-sm text-code-sm text-secondary hover:underline flex items-center gap-1"
                type="button"
              >
                <span className="material-symbols-outlined text-body-sm">
                  auto_mode
                </span>
                Regenerate
              </button>
              <span className="text-outline">•</span>
              <button
                className="font-code-sm text-code-sm text-primary hover:underline"
                type="button"
              >
                Copy
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between bg-surface-container px-space-md py-space-xs rounded-lg">
            <input
              className="bg-transparent font-code-md text-code-md text-on-surface w-full focus:outline-none"
              id="drawer-pw-input"
              type={showPw ? 'text' : 'password'}
              value={item.encrypted_password}
            />
            <button
              className="text-outline hover:text-primary"
              onClick={() => setShowPw(!showPw)}
              type="button"
            >
              <span className="material-symbols-outlined text-body-md" id="drawer-pw-icon">
                {showPw ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
          <div className="space-y-1 pt-1">
            <div className="grid grid-cols-4 gap-1 h-1.5 w-full">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-full rounded-full bg-secondary"></div>
              ))}
            </div>
            <div className="flex items-center justify-between font-code-sm text-code-sm text-outline">
              <span>Entropy: 104 bits</span>
              <span className="text-secondary font-medium">Military Grade (Very Strong)</span>
            </div>
          </div>
        </div>

        <div className="p-space-sm bg-surface-container rounded-lg space-y-space-xs">
          <div className="flex items-center justify-between font-label-md text-label-md text-on-surface-variant">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-body-sm text-secondary">
                verified_user
              </span>
              <span>TOTP Authenticator Token</span>
            </span>
            <span className="font-code-sm text-code-sm text-secondary">28s remaining</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-code-lg text-code-lg font-bold tracking-widest text-secondary">
              492 810
            </span>
            <button
              className="px-space-sm py-1 bg-secondary-container text-on-secondary-container rounded-lg font-code-sm text-code-sm font-semibold hover:opacity-90 transition-opacity"
              type="button"
            >
              Copy OTP
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-space-xs">
          <div className="space-y-1">
            <label className="font-label-md text-label-md text-on-surface-variant">Folder</label>
            <div className="relative">
              <select className="w-full bg-surface-container text-on-surface font-body-sm text-body-sm px-space-sm py-space-xs rounded-lg appearance-none cursor-pointer">
                <option>Work</option>
                <option>Personal</option>
                <option>Finance</option>
              </select>
              <span className="material-symbols-outlined absolute right-space-xs top-1/2 -translate-y-1/2 text-outline text-body-sm pointer-events-none">
                folder
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <label className="font-label-md text-label-md text-on-surface-variant">Tags</label>
            <input
              className="w-full bg-surface-container text-on-surface font-code-sm text-code-sm px-space-sm py-space-xs rounded-lg focus:outline-none"
              type="text"
              value="#dev, #github"
            />
          </div>
        </div>

        <div className="space-y-space-xs pt-space-xs">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-outline uppercase tracking-wider">
              Custom Fields (2)
            </span>
            <button
              className="font-code-sm text-code-sm text-primary hover:underline flex items-center gap-0.5"
              type="button"
            >
              <span className="material-symbols-outlined text-body-sm">
                add
              </span>
              Add
            </button>
          </div>
          <div className="p-space-xs bg-surface-container rounded-lg space-y-0.5">
            <div className="flex items-center justify-between font-label-md text-label-md text-outline">
              <span>Personal Access Token</span>
              <button className="hover:text-primary" type="button">
                <span className="material-symbols-outlined text-body-sm">
                  content_copy
                </span>
              </button>
            </div>
            <div className="font-code-sm text-code-sm text-on-surface truncate">
              ghp_920kxL928qweN182xPk...
            </div>
          </div>
          <div className="p-space-xs bg-surface-container rounded-lg space-y-0.5">
            <div className="flex items-center justify-between font-label-md text-label-md text-outline">
              <span>Recovery Backup Codes</span>
              <span className="font-code-sm text-code-sm text-secondary">8 remaining</span>
            </div>
            <div className="font-code-sm text-code-sm text-on-surface-variant">
              4b91-10aa • 9912-ff81 • e019-33ca
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-space-xs bg-surface-container-high rounded-lg font-code-sm text-code-sm text-on-surface-variant">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-body-sm text-primary">
              history
            </span>
            <span>Version 3 of 20</span>
          </span>
          <button className="text-primary hover:underline" type="button">
            View History
          </button>
        </div>
      </div>

      <div className="pt-space-xs flex items-center justify-between gap-space-xs">
        <button
          className="flex items-center gap-1 px-space-md py-space-xs rounded-lg text-error hover:bg-error-container/20 font-label-md text-label-md transition-colors"
          type="button"
        >
          <span className="material-symbols-outlined text-body-md">
            delete
          </span>
          <span>Delete</span>
        </button>
        <div className="flex items-center gap-space-xs">
          <button
            className="px-space-md py-space-xs rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label-md text-label-md transition-colors"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="px-space-md py-space-xs rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-fixed transition-colors shadow-sm font-semibold"
            type="button"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
