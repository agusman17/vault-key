import {
  Lock,
  LogOut,
  Shield,
  User,
  History,
  Trash2,
  Star,
  Folder,
  Mail,
  Key,
  CreditCard,
  FileText,
} from 'lucide-react'

interface SidebarProps {
  collapsed: boolean
}

const navItems = [
  { label: 'Vault', icon: Lock, href: '/vault' },
  { label: 'Favorites', icon: Star, href: '/vault/favorites' },
  { label: 'Work', icon: Folder, href: '/vault/work' },
  { label: 'Personal', icon: User, href: '/vault/personal' },
  { label: 'Secure Notes', icon: FileText, href: '/vault/notes' },
  { label: 'Cards', icon: CreditCard, href: '/vault/cards' },
  { label: 'Identities', icon: Mail, href: '/vault/identities' },
  { label: 'Passkeys', icon: Key, href: '/vault/passkeys' },
]

const settingsItems = [
  { label: 'Security', icon: Shield, href: '/settings/security' },
  { label: 'Billing', icon: CreditCard, href: '/settings/billing' },
  { label: 'Privacy', icon: Mail, href: '/settings/privacy' },
  { label: 'History', icon: History, href: '/settings/history' },
  { label: 'Trash', icon: Trash2, href: '/vault/trash' },
]

export function Sidebar({ collapsed }: SidebarProps) {
  return (
    <aside
      className={`h-full z-50 bg-surface-container-low border-r border-outline/20 transition-all duration-300 shrink-0 ${
        collapsed ? 'w-14' : 'w-64'
      }`}
    >
      <nav className="overflow-y-auto space-y-1 px-2 pt-6">
        <div className="px-2 pt-1 pb-1 mb-1">
          {!collapsed && (
            <span className="font-code-xs text-code-xs text-outline uppercase tracking-wider font-semibold block mb-2 ml-1">
              Vault
            </span>
          )}
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                onClick={() => {}}
                className={`flex ${collapsed ? 'items-center justify-center' : 'items-start'} w-full ${collapsed ? 'px-0.5' : 'px-3'} py-2.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors`}
              >
                <div className={`flex-shrink-0 ${collapsed ? 'w-full' : ''}`}>
                  <Icon size={collapsed ? 20 : 18} />
                </div>
                {!collapsed && (
                  <span className="ml-3 text-label-sm">{item.label}</span>
                )}
              </button>
            )
          })}
        </div>

        <div className="px-2 pt-1 pb-1 border-t border-outline/10">
          {!collapsed && (
            <span className="font-code-xs text-code-xs text-outline uppercase tracking-wider font-semibold block mb-2 ml-1">
              Settings
            </span>
          )}
          {settingsItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                onClick={() => {}}
                className={`flex ${collapsed ? 'items-center justify-center' : 'items-start'} w-full ${collapsed ? 'px-0.5' : 'px-3'} py-2.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors`}
              >
                <div className={`flex-shrink-0 ${collapsed ? 'w-full' : ''}`}>
                  <Icon size={collapsed ? 20 : 18} />
                </div>
                {!collapsed && (
                  <span className="ml-3 text-label-sm">{item.label}</span>
                )}
              </button>
            )
          })}
        </div>
      </nav>

      <div className="p-2 border-t border-outline/10">
        <button
          onClick={() => {}}
          className={`flex ${collapsed ? 'items-center justify-center' : 'items-start'} w-full ${collapsed ? 'px-0.5' : 'px-3'} py-3 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface transition-colors`}
        >
          <div className={`flex-shrink-0 ${collapsed ? 'w-full' : ''}`}>
            <LogOut size={collapsed ? 20 : 18} />
          </div>
          {!collapsed && <span className="ml-3 text-label-sm">Sign Out</span>}
        </button>
      </div>
    </aside>
  )
}
