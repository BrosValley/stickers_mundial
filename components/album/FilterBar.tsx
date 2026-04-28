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
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide transition-colors ${
            activeFilter === f.value
              ? 'bg-(--primary) text-white border border-(--primary)'
              : 'bg-(--surface) text-(--muted) hover:bg-(--surface-hover) border border-(--border) hover:text-(--text)'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
