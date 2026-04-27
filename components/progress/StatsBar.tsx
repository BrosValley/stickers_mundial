import type { CollectionProgress } from '@/types/album'
import { ProgressBar } from '@/components/ui/ProgressBar'

interface StatsBarProps {
  progress: CollectionProgress
  collectionName: string
}

export function StatsBar({ progress, collectionName }: StatsBarProps) {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold">{collectionName}</h2>
        <span className="text-2xl font-bold text-blue-400">{progress.percentage}%</span>
      </div>
      <ProgressBar percentage={progress.percentage} className="mb-4" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatItem label="Total" value={progress.total} />
        <StatItem label="Obtenidas" value={progress.obtained} color="text-blue-400" />
        <StatItem label="Faltantes" value={progress.missing} color="text-slate-400" />
        <StatItem label="Duplicados" value={progress.duplicates} color="text-amber-400" />
      </div>
      <div className="mt-3 pt-3 border-t border-slate-700">
        <span className="text-sm text-slate-400">
          Países completos: <span className="text-green-400 font-semibold">{progress.completedCountries}</span>
          <span className="text-slate-500"> / {progress.totalCountries}</span>
        </span>
      </div>
    </div>
  )
}

function StatItem({ label, value, color = 'text-slate-100' }: { label: string; value: number; color?: string }) {
  return (
    <div className="text-center">
      <div className={`text-xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  )
}
