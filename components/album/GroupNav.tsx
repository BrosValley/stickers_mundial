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
        className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm transition-colors ${
          selectedGroupId === null
            ? 'bg-blue-600 text-white font-medium'
            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
        }`}
      >
        Todos
      </button>
      {groups.map(g => (
        <button
          key={g.id}
          onClick={() => onChange(g.id)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm transition-colors ${
            selectedGroupId === g.id
              ? 'bg-blue-600 text-white font-medium'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
          }`}
        >
          {g.name}
        </button>
      ))}
    </div>
  )
}
