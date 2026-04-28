'use client'

import { useState, useMemo, useCallback } from 'react'
import { StatsBar } from '@/components/progress/StatsBar'
import { FilterBar } from '@/components/album/FilterBar'
import { GroupNav } from '@/components/album/GroupNav'
import { CountryCard } from '@/components/album/CountryCard'
import { ShareModal } from '@/components/share/ShareModal'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { calcCollectionProgress } from '@/lib/progress'
import { updateStickerQuantity, MIN_QUANTITY, MAX_QUANTITY } from '@/lib/stickers'
import { getOrCreateShareLink, getShareUrl } from '@/lib/share'
import type { Collection, Group, Country, Section, StickerWithQuantity, StickerFilter } from '@/types/album'
import Link from 'next/link'

interface AlbumClientProps {
  user: { id: string; email: string }
  collection: Collection
  groups: Group[]
  countries: Country[]
  sections: Section[]
  stickersWithQuantity: StickerWithQuantity[]
}

export function AlbumClient({ user, collection, groups, countries, sections, stickersWithQuantity: initial }: AlbumClientProps) {
  const [stickers, setStickers] = useState(initial)
  const [filter, setFilter] = useState<StickerFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set())
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isLoadingShare, setIsLoadingShare] = useState(false)

  const progress = useMemo(() => calcCollectionProgress(stickers, countries), [stickers, countries])

  const visibleCountries = useMemo(() => {
    let result = countries
    if (selectedGroupId) result = result.filter(c => c.group_id === selectedGroupId)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        stickers.some(s => s.country_id === c.id && (
          s.code.toLowerCase().includes(q) ||
          (s.name?.toLowerCase().includes(q) ?? false)
        ))
      )
    }
    return result
  }, [countries, selectedGroupId, searchQuery, stickers])

  const countryStickersMap = useMemo(() => {
    const map = new Map<string, StickerWithQuantity[]>()
    for (const s of stickers) {
      if (s.country_id) {
        const arr = map.get(s.country_id) ?? []
        arr.push(s)
        map.set(s.country_id, arr)
      }
    }
    return map
  }, [stickers])

  const updateQuantity = useCallback(async (stickerId: string, delta: number) => {
    const current = stickers.find(s => s.id === stickerId)
    if (!current) return
    const newQty = Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, current.quantity + delta))
    if (newQty === current.quantity) return

    setStickers(prev => prev.map(s => s.id === stickerId ? { ...s, quantity: newQty } : s))
    setUpdatingIds(prev => new Set(prev).add(stickerId))

    try {
      await updateStickerQuantity(user.id, collection.id, stickerId, newQty)
    } catch {
      setStickers(prev => prev.map(s => s.id === stickerId ? { ...s, quantity: current.quantity } : s))
    } finally {
      setUpdatingIds(prev => { const next = new Set(prev); next.delete(stickerId); return next })
    }
  }, [stickers, user.id, collection.id])

  const handleShare = useCallback(async () => {
    setIsLoadingShare(true)
    try {
      const link = await getOrCreateShareLink(user.id, collection.id)
      setShareUrl(getShareUrl(link.token))
      setIsShareModalOpen(true)
    } catch {
      alert('Error al generar el enlace. Intenta de nuevo.')
    } finally {
      setIsLoadingShare(false)
    }
  }, [user.id, collection.id])

  return (
    <div className="min-h-screen bg-(--bg)">
      <nav className="border-b border-(--border) px-4 py-3 flex items-center justify-between sticky top-0 z-10 bg-(--bg) backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2 text-(--muted) hover:text-(--text) transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">Colecciones</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <span className="text-xs text-(--muted) hidden sm:block">{user.email}</span>
          <form action="/auth/signout" method="post">
            <button className="text-xs text-(--muted) hover:text-(--text) px-2 py-1 rounded border border-(--border) hover:border-(--primary) transition-colors">
              Salir
            </button>
          </form>
        </div>
      </nav>

      <main className="px-4 py-6 max-w-5xl mx-auto space-y-5">
        <StatsBar progress={progress} collectionName={collection.name} />

        <div className="flex items-center justify-between gap-3">
          <input
            type="text"
            placeholder="Buscar por país, código o nombre..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 bg-(--surface) border border-(--border) rounded-lg px-4 py-2.5 text-sm text-(--text) placeholder-(--muted) focus:outline-none focus:border-(--accent) transition-colors"
          />
          <button
            onClick={handleShare}
            disabled={isLoadingShare}
            className="shrink-0 flex items-center gap-2 bg-(--primary) hover:bg-(--primary-hover) disabled:opacity-50 text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-colors uppercase tracking-wide"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            {isLoadingShare ? 'Generando...' : 'Compartir'}
          </button>
        </div>

        <FilterBar activeFilter={filter} onChange={setFilter} />

        {groups.length > 0 && (
          <GroupNav groups={groups} selectedGroupId={selectedGroupId} onChange={setSelectedGroupId} />
        )}

        <div className="space-y-3">
          {visibleCountries.length === 0 ? (
            <div className="text-center py-12 text-(--muted)">
              <p>No se encontraron países con ese criterio.</p>
            </div>
          ) : (
            visibleCountries.map(country => (
              <CountryCard
                key={country.id}
                country={country}
                stickers={countryStickersMap.get(country.id) ?? []}
                filter={filter}
                searchQuery={searchQuery}
                onIncrement={id => updateQuantity(id, 1)}
                onDecrement={id => updateQuantity(id, -1)}
                updatingIds={updatingIds}
              />
            ))
          )}
        </div>
      </main>

      {shareUrl && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          shareUrl={shareUrl}
        />
      )}
    </div>
  )
}
