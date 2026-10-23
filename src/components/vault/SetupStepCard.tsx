import React from 'react'
import { DownloadCloud, FileCode, Shield, ArrowRight } from 'lucide-react'
import type { SetupStepCardProps } from '@/types'

const variantIcons: Record<SetupStepCardProps['variant'], { icon: React.ReactNode; colorClass: string }> = {
  quick: { icon: <DownloadCloud size={28} />, colorClass: 'text-secondary bg-secondary-container/20' },
  autofill: { icon: <FileCode size={28} />, colorClass: 'text-primary bg-primary-container/20' },
  critical: { icon: <Shield size={28} />, colorClass: 'text-error bg-error-container/30' },
}

export function SetupStepCard({ icon, title, description, label, actionLabel, onAction, variant }: SetupStepCardProps) {
  const resolved = variantIcons[variant]
  const cardIcon = icon ?? resolved.icon
  const colorClass = resolved.colorClass

  return (
    <div className="bg-surface-container rounded-xl p-space-md flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
      <div className="flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center">
            {cardIcon}
          </div>
          <span className={`font-code-sm text-code-sm px-space-xs py-0.5 rounded font-medium ${colorClass}`}>
            {label}
          </span>
        </div>
        <div>
          <h4 className="font-label-lg text-label-lg font-semibold text-on-surface">
            {title}
          </h4>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            {description}
          </p>
        </div>
      </div>
      <div className="pt-space-md">
        <button
          className="w-full flex items-center justify-between bg-surface-container-high hover:bg-surface-bright px-space-md py-space-sm rounded-lg font-label-md text-label-md transition-colors"
          onClick={onAction}
          type="button"
        >
          <span>{actionLabel}</span>
          <ArrowRight size={16} className="text-secondary" />
        </button>
      </div>
    </div>
  )
}
