import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getShareLinkByToken, getUserStickersForMatch, calcMatchResult } from '@/lib/share'
import { getCountries } from '@/lib/collections'
import { MatchClient } from './MatchClient'

interface PageProps {
  params: Promise<{ token: string }>
}

export default async function SharePage({ params }: PageProps) {
  const { token } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?next=/share/${token}`)
  }

  const shareLink = await getShareLinkByToken(token)
  if (!shareLink) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Enlace no válido</h2>
          <p className="text-slate-400">Este enlace no existe o ya no está activo.</p>
        </div>
      </div>
    )
  }

  if (shareLink.user_id === user.id) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-4xl mb-4">🔗</div>
          <h2 className="text-xl font-semibold mb-2">Este es tu enlace de compartir</h2>
          <p className="text-slate-400 mb-6">Compártelo con otro usuario para ver qué intercambios son posibles entre sus colecciones.</p>
          <a href="/" className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg transition-colors">
            Ir a mi colección
          </a>
        </div>
      </div>
    )
  }

  const [ownerStickers, visitorStickers, countries] = await Promise.all([
    getUserStickersForMatch(shareLink.user_id, shareLink.collection_id),
    getUserStickersForMatch(user.id, shareLink.collection_id),
    getCountries(shareLink.collection_id),
  ])

  const matchResult = calcMatchResult(ownerStickers, visitorStickers)

  const { data: ownerProfileRaw } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', shareLink.user_id)
    .single()

  const ownerProfile = ownerProfileRaw as { full_name: string | null; email: string | null } | null

  return (
    <MatchClient
      matchResult={matchResult}
      ownerName={ownerProfile?.full_name ?? ownerProfile?.email ?? 'Otro usuario'}
      countries={countries}
    />
  )
}
