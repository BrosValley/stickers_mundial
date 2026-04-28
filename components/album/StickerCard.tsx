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
      <button
          onClick={(e) => { e.stopPropagation(); onDecrement(sticker.id) }}
          disabled={sticker.quantity === 0 || isUpdating}
          className="w-5 h-5 rounded-full flex items-center justify-center bg-(--border) hover:bg-(--border-hover) disabled:opacity-30 disabled:cursor-not-allowed text-xs transition-colors absolute -left-2 -top-2 z-40"
        >
          −
        </button>
      <span className="text-xs font-mono font-bold">{sticker.code}</span>
      {sticker.name && (
        <span className="text-[10px] text-center leading-tight opacity-70 px-1">{sticker.name}</span>
      )}

      <div className="flex items-center gap-1 mt-auto" onClick={e => e.stopPropagation()}>
        
        
      </div>

      {state === 'repeated' && (
        <span className="absolute h-5 w-5 -top-1 -right-1 text-[9px] bg-(--primary) text-white font-bold rounded-full grid place-content-center">
          x{sticker.quantity - 1}
        </span>
      )}
    </div>
  )
}
