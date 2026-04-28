import type { CollectionProgress } from '@/types/album'
import { ProgressBar } from '@/components/ui/ProgressBar'

interface StatsBarProps {
  progress: CollectionProgress
  collectionName: string
}

export function StatsBar({ progress, collectionName }: StatsBarProps) {
  return (
    <div className="bg-(--surface) rounded-xl border border-(--border) p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold uppercase tracking-wide text-(--text)">{collectionName}</h2>
        <span className="text-2xl font-bold text-(--accent)">{progress.percentage}%</span>
      </div>
      <ProgressBar percentage={progress.percentage} className="mb-4" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatItem label="Total" value={progress.total} />
        <StatItem label="Obtenidas" value={progress.obtained} color="text-(--accent)" />
        <StatItem label="Faltantes" value={progress.missing} color="text-(--muted)" />
        <StatItem label="Duplicados" value={progress.duplicates} color="text-(--amber)" />
      </div>
      <div className="mt-3 pt-3 border-t border-(--border)">
        <span className="text-sm text-(--muted)">
          Países completos: <span className="text-(--accent) font-semibold">{progress.completedCountries}</span>
          <span className="text-(--muted) opacity-50"> / {progress.totalCountries}</span>
        </span>
      </div>
    </div>
  )
}

function StatItem({ label, value, color = 'text-(--text)' }: { label: string; value: number; color?: string }) {
  return (
    <div className="text-center">
      <div className={`text-xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-(--muted)">{label}</div>
    </div>
  )
}
