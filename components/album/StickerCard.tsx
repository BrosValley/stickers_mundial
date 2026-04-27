'use client'

import { calcStickerState } from '@/lib/progress'
import type { StickerWithQuantity } from '@/types/album'

interface StickerCardProps {
  sticker: StickerWithQuantity
  onIncrement: (stickerId: string) => void
  onDecrement: (stickerId: string) => void
  isUpdating?: boolean
}

export function StickerCard({ sticker, onIncrement, onDecrement, isUpdating }: StickerCardProps) {
  const state = calcStickerState(sticker.quantity)

  const cardStyles = {
    missing: 'sticker-card sticker-missing',
    obtained: 'sticker-card sticker-obtained',
    repeated: 'sticker-card sticker-repeated',
  }

  return (
    <div
      className={`${cardStyles[state]} p-2 gap-1 min-h-[80px] ${isUpdating ? 'opacity-60' : ''}`}
      onClick={() => onIncrement(sticker.id)}
    >
      <span className="text-xs font-mono font-bold">{sticker.code}</span>
      {sticker.name && (
        <span className="text-[10px] text-center leading-tight opacity-70 px-1">{sticker.name}</span>
      )}

      <div className="flex items-center gap-1 mt-auto" onClick={e => e.stopPropagation()}>
        <button
          onClick={() => onDecrement(sticker.id)}
          disabled={sticker.quantity === 0 || isUpdating}
          className="w-5 h-5 rounded flex items-center justify-center bg-slate-700/50 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-xs transition-colors"
        >
          −
        </button>
        <span className="text-sm font-bold min-w-[20px] text-center">{sticker.quantity}</span>
        <button
          onClick={() => onIncrement(sticker.id)}
          disabled={sticker.quantity >= sticker.max_quantity || isUpdating}
          className="w-5 h-5 rounded flex items-center justify-center bg-slate-700/50 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-xs transition-colors"
        >
          +
        </button>
      </div>

      {state === 'repeated' && (
        <span className="absolute top-1 right-1 text-[9px] bg-amber-500 text-amber-900 font-bold rounded px-1">
          +{sticker.quantity - 1}
        </span>
      )}
    </div>
  )
}
