'use client'

import { useMemo, useState } from 'react'
import { StickerCard } from './StickerCard'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { calcCountryProgress, filterStickers, searchStickers } from '@/lib/progress'
import type { Country, StickerWithQuantity, StickerFilter } from '@/types/album'

interface CountryCardProps {
  country: Country
  stickers: StickerWithQuantity[]
  filter: StickerFilter
  searchQuery: string
  onIncrement: (stickerId: string) => void
  onDecrement: (stickerId: string) => void
  updatingIds: Set<string>
}

export function CountryCard({
  country, stickers, filter, searchQuery, onIncrement, onDecrement, updatingIds
}: CountryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const progress = useMemo(() => calcCountryProgress(country, stickers), [country, stickers])

  const visibleStickers = useMemo(() => {
    let result = stickers
    result = filterStickers(result, filter)
    result = searchStickers(result, searchQuery)
    return result
  }, [stickers, filter, searchQuery])

  if (visibleStickers.length === 0 && filter !== 'all') return null

  return (
    <div className="border border-slate-700 rounded-xl overflow-hidden bg-slate-800/50">
      <button
        className="w-full flex items-center justify-between p-4 hover:bg-slate-700/30 transition-colors text-left"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="font-semibold text-slate-100 truncate">{country.name}</span>
          <span className="text-xs text-slate-400 font-mono">{country.code}</span>
          {progress.isComplete && (
            <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded">
              ✓ Completo
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-sm text-slate-400">{progress.obtained}/{progress.total}</span>
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      <div className="px-4 pb-2">
        <ProgressBar percentage={progress.percentage} />
      </div>

      {isExpanded && (
        <div className="px-4 pb-4">
          {visibleStickers.length === 0 ? (
            <p className="text-sm text-slate-500 py-4 text-center">No hay estampas con este filtro.</p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 mt-3">
              {visibleStickers.map(sticker => (
                <StickerCard
                  key={sticker.id}
                  sticker={sticker}
                  onIncrement={onIncrement}
                  onDecrement={onDecrement}
                  isUpdating={updatingIds.has(sticker.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
