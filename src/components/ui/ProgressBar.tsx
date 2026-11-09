import React from 'react'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'success' | 'warning' | 'danger'
  showLabel?: boolean
  className?: string
}

export function ProgressBar({
  value,
  max = 100,
  size = 'md',
  color = 'primary',
  showLabel = false,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100)

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }

  const colors = {
    primary: 'bg-indigo-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
  }

  const getAutoColor = () => {
    if (percentage >= 80) return 'bg-emerald-500'
    if (percentage >= 50) return 'bg-indigo-500'
    if (percentage >= 25) return 'bg-amber-500'
    return 'bg-red-500'
  }

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">التقدم</span>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {percentage}%
          </span>
        </div>
      )}
      <div
        className={cn(
          'w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden',
          sizes[size]
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            color === 'primary' ? getAutoColor() : colors[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
