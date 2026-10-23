import type { BlankStateCardProps } from '@/types'

export function BlankStateCard({ icon, category, title, description, buttonLabel, onButtonClick }: BlankStateCardProps) {
  return (
    <div className="bg-surface-container rounded-xl p-space-lg flex flex-col items-center text-center shadow-sm relative group overflow-hidden">
      <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center text-primary mb-space-md">
        {icon}
      </div>
      <span className="font-code-sm text-code-sm text-primary uppercase font-bold tracking-wider mb-1">
        {category}
      </span>
      <h4 className="font-headline-md text-headline-md font-semibold text-on-surface">
        {title}
      </h4>
      <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 max-w-xs">
        {description}
      </p>
      <div className="mt-space-md w-full pt-space-xs">
        <button
          className="w-full bg-surface-container-high hover:bg-surface-bright text-on-surface py-space-xs px-space-md rounded-lg font-label-md text-label-md transition-colors flex items-center justify-center gap-space-xs"
          onClick={onButtonClick}
          type="button"
        >
          {buttonLabel}
        </button>
      </div>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="font-code-sm text-code-sm bg-surface-container-highest px-1.5 py-0.5 rounded text-outline">
          React Component
        </span>
      </div>
    </div>
  )
}
