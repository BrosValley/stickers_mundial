import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { sanitizeRedirectPath } from '@/lib/auth-redirect'
import { auditLog } from '@/lib/security/audit'
import { enforceRateLimit, getClientIp, rateLimitRules } from '@/lib/security/rate-limit'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const route = 'GET /auth/callback'
  const rateLimit = enforceRateLimit(request, route, rateLimitRules.auth)
  if (rateLimit) return rateLimit

  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = sanitizeRedirectPath(searchParams.get('next'))

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const nickname = user.user_metadata?.nickname as string | undefined
        const fullName = user.user_metadata?.full_name as string | undefined
        const avatarUrl = user.user_metadata?.avatar_url as string | undefined
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: upsertError } = await (supabase as any).from('profiles').upsert({
          id: user.id,
          email: user.email ?? null,
          ...(fullName ? { full_name: fullName } : {}),
          ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
          ...(nickname ? { nickname } : {}),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id', ignoreDuplicates: false })
        if (upsertError) {
          auditLog('mutation.failed', { route, ip: getClientIp(request), resourceType: 'profile', reason: upsertError.message })
        }
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  auditLog('auth.callback_failed', { route, ip: getClientIp(request), reason: 'exchange_failed' })
  return NextResponse.redirect(`${origin}/login?error=auth_error`)
}
