import { NextResponse } from 'next/server'
import { auditLog } from '@/lib/security/audit'
import { requireAuthenticatedUser } from '@/lib/security/api'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const route = 'POST /auth/signout'
  const auth = await requireAuthenticatedUser(request, route)
  if (auth.error) return auth.error

  const { supabase, user } = auth
  await supabase.auth.signOut()
  auditLog('auth.signout', { route, userId: user.id })
  return NextResponse.redirect(new URL('/', request.url))
}
