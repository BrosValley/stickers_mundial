interface ProgressBarProps {
  percentage: number
  className?: string
}

export function ProgressBar({ percentage, className = '' }: ProgressBarProps) {
  const color = percentage === 100 ? 'bg-(--accent)' : percentage >= 50 ? 'bg-(--accent)/80' : 'bg-(--primary)'
  return (
    <div className={`progress-bar ${className}`}>
      <div
        className={`progress-fill ${color}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}
