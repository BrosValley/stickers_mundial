'use client'

import type { StickerFilter } from '@/types/album'

interface FilterBarProps {
  activeFilter: StickerFilter
  onChange: (filter: StickerFilter) => void
}

const FILTERS: { value: StickerFilter; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'missing', label: 'Faltantes' },
  { value: 'complete', label: 'Completas' },
  { value: 'repeated', label: 'Repetidas' },
]

export function FilterBar({ activeFilter, onChange }: FilterBarProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
      {FILTERS.map(f => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilter === f.value
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
