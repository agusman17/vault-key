import { X } from 'lucide-react'

type AlertVariant = 'error' | 'success' | 'warning' | 'info'

interface AlertProps {
  children: React.ReactNode
  variant?: AlertVariant
  title?: string
  dismissible?: boolean
  onDismiss?: () => void
}

const variantStyles: Record<AlertVariant, { bg: string; border: string; text: string; icon: string }> = {
  error: {
    bg: 'bg-error-container/20',
    border: 'border border-error-container/40',
    text: 'text-error',
    icon: 'text-error',
  },
  success: {
    bg: 'bg-secondary-container/20',
    border: 'border border-secondary-container/40',
    text: 'text-secondary',
    icon: 'text-secondary',
  },
  warning: {
    bg: 'bg-primary-container/20',
    border: 'border border-primary-container/40',
    text: 'text-primary',
    icon: 'text-primary',
  },
  info: {
    bg: 'bg-surface-container-high',
    border: 'border border-outline/20',
    text: 'text-on-surface-variant',
    icon: 'text-on-surface-variant',
  },
}

export function Alert({
  children,
  variant = 'error',
  title,
  dismissible = false,
  onDismiss,
}: AlertProps) {
  const styles = variantStyles[variant]
  const iconMap: Record<AlertVariant, string> = {
    error: 'error',
    success: 'check_circle',
    warning: 'warning',
    info: 'info',
  }

  return (
    <div className={`${styles.bg} ${styles.border} rounded-lg p-space-sm flex items-start gap-space-sm`}>
      <span className="material-symbols-outlined shrink-0 mt-0.5 text-body-sm">{iconMap[variant]}</span>
      <div className="flex-1 min-w-0">
        {title && (
          <h3 className={`font-label-md text-label-md ${styles.text} mb-0.5`}>{title}</h3>
        )}
        <div className={`font-body-sm text-body-sm ${styles.text} leading-relaxed`}>
          {children}
        </div>
      </div>
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="shrink-0 text-on-surface-variant hover:text-on-surface p-1 rounded hover:bg-surface-container transition-colors"
          type="button"
          aria-label="Dismiss alert"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
