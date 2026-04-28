import { createClient } from '@/lib/supabase/server'
import { getCollections } from '@/lib/collections'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const collections = await getCollections().catch(() => [])

  return (
    <div className="min-h-screen bg-(--bg) flex flex-col">
      <nav className="border-b border-(--border) px-4 py-3 flex items-center justify-between bg-(--bg) sticky top-0 z-10 backdrop-blur-sm">
        <h1 className="text-lg font-bold text-(--accent) tracking-wide uppercase">Album Checklist</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <span className="text-sm text-(--muted) hidden sm:block">{user.email}</span>
              <form action="/auth/signout" method="post">
                <button className="text-sm text-(--muted) hover:text-(--text) px-3 py-1 rounded border border-(--border) hover:border-(--primary) transition-colors">
                  Cerrar sesión
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" className="text-sm bg-(--primary) hover:bg-(--primary-hover) text-white px-3 py-1.5 rounded font-medium transition-colors">
              Iniciar sesión
            </Link>
          )}
        </div>
      </nav>

      <main className="flex-1 px-4 py-8 max-w-4xl mx-auto w-full">
        <h2 className="text-2xl font-bold mb-2 uppercase tracking-wide text-(--text)">Mis Colecciones</h2>
        <p className="text-(--muted) mb-8">Selecciona una colección para ver y registrar tus estampas.</p>

        {collections.length === 0 ? (
          <div className="text-center py-16 text-(--muted)">
            <p>No hay colecciones disponibles aún.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.map(col => (
              <Link
                key={col.id}
                href={`/album/${col.slug}`}
                className="block rounded-xl border border-(--border) bg-(--surface) hover:border-(--accent) hover:bg-(--surface-hover) transition-all p-5 group"
              >
                <div className="h-32 rounded-lg bg-(--border) mb-4 flex items-center justify-center overflow-hidden">
                  {col.cover_image_url ? (
                    <img src={col.cover_image_url} alt={col.name} className="h-full w-full object-cover rounded-lg" />
                  ) : (
                    <span className="text-4xl">🏆</span>
                  )}
                </div>
                <h3 className="font-semibold text-(--text) group-hover:text-(--accent) transition-colors uppercase tracking-wide text-sm">{col.name}</h3>
                {col.description && <p className="text-sm text-(--muted) mt-1">{col.description}</p>}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
