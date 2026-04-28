'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setMessage({ text: 'Correo o contraseña incorrectos.', type: 'error' })
      } else {
        router.push('/')
        router.refresh()
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setMessage({ text: error.message, type: 'error' })
      } else {
        setMessage({ text: 'Revisa tu correo para confirmar tu cuenta.', type: 'success' })
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-(--bg) flex items-center justify-center px-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-(--accent) mb-2 uppercase tracking-widest">Album Checklist</h1>
          <p className="text-(--muted)">Registra tu colección de estampas</p>
        </div>
        <div className="bg-(--surface) rounded-2xl border border-(--border) p-8">
          <h2 className="text-xl font-semibold mb-6 text-center uppercase tracking-wide text-(--text)">
            {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              suppressHydrationWarning
              className="w-full bg-(--bg) border border-(--border) rounded-lg px-4 py-3 text-(--text) placeholder-(--muted) focus:outline-none focus:border-(--accent) transition-colors"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              suppressHydrationWarning
              className="w-full bg-(--bg) border border-(--border) rounded-lg px-4 py-3 text-(--text) placeholder-(--muted) focus:outline-none focus:border-(--accent) transition-colors"
            />

            {message && (
              <p className={`text-sm text-center ${message.type === 'error' ? 'text-(--primary)' : 'text-(--accent)'}`}>
                {message.text}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-(--primary) hover:bg-(--primary-hover) disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-colors uppercase tracking-wide"
            >
              {loading ? 'Cargando...' : mode === 'login' ? 'Entrar' : 'Registrarme'}
            </button>
          </form>

          <p className="text-center text-sm text-(--muted) mt-5">
            {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMessage(null) }}
              className="text-(--accent) hover:text-(--accent-hover) transition-colors font-medium"
            >
              {mode === 'login' ? 'Crear cuenta' : 'Iniciar sesión'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
