import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

type UserStickerUpsert = Database['public']['Tables']['user_stickers']['Insert']

const MIN_QUANTITY = 0
const MAX_QUANTITY = 1000

export async function updateStickerQuantity(
  userId: string,
  collectionId: string,
  stickerId: string,
  quantity: number
): Promise<void> {
  const clamped = Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, quantity))
  const supabase = createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('user_stickers')
    .upsert(
      { user_id: userId, collection_id: collectionId, sticker_id: stickerId, quantity: clamped, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,sticker_id' }
    )

  if (error) throw error
}

export { MIN_QUANTITY, MAX_QUANTITY }
