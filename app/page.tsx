import { createClient } from '@/lib/supabase/server'
import { getCollections } from '@/lib/collections'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const collections = await getCollections().catch(() => [])

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <nav className="border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-blue-400">Album Checklist</h1>
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400 hidden sm:block">{user.email}</span>
            <form action="/auth/signout" method="post">
              <button className="text-sm text-slate-400 hover:text-slate-200 px-3 py-1 rounded border border-slate-700 hover:border-slate-500 transition-colors">
                Cerrar sesión
              </button>
            </form>
          </div>
        ) : (
          <Link href="/login" className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded transition-colors">
            Iniciar sesión
          </Link>
        )}
      </nav>

      <main className="flex-1 px-4 py-8 max-w-4xl mx-auto w-full">
        <h2 className="text-2xl font-bold mb-2">Mis Colecciones</h2>
        <p className="text-slate-400 mb-8">Selecciona una colección para ver y registrar tus estampas.</p>

        {collections.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <p>No hay colecciones disponibles aún.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.map(col => (
              <Link
                key={col.id}
                href={`/album/${col.slug}`}
                className="block rounded-xl border border-slate-700 bg-slate-800 hover:border-blue-500/50 transition-all p-5"
              >
                <div className="h-32 rounded-lg bg-slate-700 mb-4 flex items-center justify-center">
                  {col.cover_image_url ? (
                    <img src={col.cover_image_url} alt={col.name} className="h-full w-full object-cover rounded-lg" />
                  ) : (
                    <span className="text-4xl">🏆</span>
                  )}
                </div>
                <h3 className="font-semibold text-slate-100">{col.name}</h3>
                {col.description && <p className="text-sm text-slate-400 mt-1">{col.description}</p>}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
