import { createClient } from '@/lib/supabase/client'
import type { Collection, Group, Country, Section, Sticker, UserSticker, StickerWithQuantity } from '@/types/album'

export async function getCollections(): Promise<Collection[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  if (error) return null
  return data
}

export async function getGroups(collectionId: string): Promise<Group[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .eq('collection_id', collectionId)
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data
}

export async function getCountries(collectionId: string): Promise<Country[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .eq('collection_id', collectionId)
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data
}

export async function getSections(collectionId: string): Promise<Section[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('sections')
    .select('*')
    .eq('collection_id', collectionId)
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data
}

export async function getStickers(collectionId: string): Promise<Sticker[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('stickers')
    .select('*')
    .eq('collection_id', collectionId)
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data
}

export async function getUserStickers(userId: string, collectionId: string): Promise<UserSticker[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_stickers')
    .select('*')
    .eq('user_id', userId)
    .eq('collection_id', collectionId)
  if (error) throw error
  return data
}

export function mergeStickersWithQuantity(
  stickers: Sticker[],
  userStickers: UserSticker[]
): StickerWithQuantity[] {
  const quantityMap = new Map(userStickers.map(us => [us.sticker_id, us.quantity]))
  return stickers.map(s => ({
    ...s,
    quantity: quantityMap.get(s.id) ?? 0,
  }))
}
