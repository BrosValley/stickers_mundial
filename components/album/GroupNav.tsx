'use client'

import type { Group } from '@/types/album'

interface GroupNavProps {
  groups: Group[]
  selectedGroupId: string | null
  onChange: (groupId: string | null) => void
}

export function GroupNav({ groups, selectedGroupId, onChange }: GroupNavProps) {
  if (groups.length === 0) return null

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
      <button
        onClick={() => onChange(null)}
        className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-bold uppercase tracking-wide transition-colors ${
          selectedGroupId === null
            ? 'bg-(--accent) text-(--bg) border border-(--accent)'
            : 'bg-(--surface) text-(--muted) hover:bg-(--surface-hover) border border-(--border) hover:text-(--text)'
        }`}
      >
        Todos
      </button>
      {groups.map(g => (
        <button
          key={g.id}
          onClick={() => onChange(g.id)}
          className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-bold uppercase tracking-wide transition-colors ${
            selectedGroupId === g.id
              ? 'bg-(--accent) text-(--bg) border border-(--accent)'
              : 'bg-(--surface) text-(--muted) hover:bg-(--surface-hover) border border-(--border) hover:text-(--text)'
          }`}
        >
          {g.name}
        </button>
      ))}
    </div>
  )
}
