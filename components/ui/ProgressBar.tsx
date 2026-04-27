interface ProgressBarProps {
  percentage: number
  className?: string
}

export function ProgressBar({ percentage, className = '' }: ProgressBarProps) {
  const color = percentage === 100 ? 'bg-green-500' : percentage >= 50 ? 'bg-blue-500' : 'bg-blue-600'
  return (
    <div className={`progress-bar ${className}`}>
      <div
        className={`progress-fill ${color}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}
