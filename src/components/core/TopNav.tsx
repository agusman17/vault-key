import { Bell, Menu, Shield, User } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'
import { useAuth } from '@/hooks/useAuth'

interface TopNavProps {
  onToggleSidebar: () => void
  searchQuery: string
  onSearchChange: (value: string) => void
}

export function TopNav({ onToggleSidebar, searchQuery, onSearchChange }: TopNavProps) {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleLogout = async () => {
    setUserMenuOpen(false)
    const result = await signOut()
    if (result.success) {
      navigate('/login', { replace: true })
    } else if (result.error) {
      console.error(result.error)
    }
  }

  return (
    <nav className="h-16 flex-shrink-0 bg-surface/95 backdrop-blur border-b border-outline/10 z-20">
      <div className="px-space-md lg:px-space-lg py-space-sm h-full flex items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-sm">
          <button
            className="p-1.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-outline transition-colors"
            onClick={onToggleSidebar}
            type="button"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Shield size={18} className="text-on-primary" />
            </div>
            <span className="font-headline-md text-headline-md font-semibold text-on-surface tracking-tight">
              Vault Key
            </span>
          </div>
        </div>

        <div className="flex items-center gap-space-sm flex-1 md:flex-none max-w-2xl">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-outline text-body-lg pointer-events-none">
              search
            </span>
            <input
              className="w-full bg-surface-container text-on-surface placeholder-outline pl-10 pr-24 py-space-sm rounded-lg font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-high transition-colors"
              placeholder="Search site name, username, URL, or tag (Ctrl+K)..."
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <div className="absolute right-space-sm top-1/2 -translate-y-1/2 flex items-center gap-1">
              <span className="font-code-sm text-code-sm px-1.5 py-0.5 rounded bg-surface-container-highest text-outline">
                ⌘K
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-space-xs">
          <ThemeToggle iconOnly />
          <button
            className="p-1.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-outline transition-colors hidden md:block"
            type="button"
          >
            <Bell size={18} />
          </button>
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen((prev) => !prev)}
              className="p-1.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-outline transition-colors hidden md:block"
              type="button"
            >
              <User size={18} />
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-surface-container rounded-lg border border-outline/10 shadow-xl z-50 py-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-on-surface font-label-md text-label-md hover:bg-surface-container-high hover:text-primary transition-colors"
                  type="button"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
