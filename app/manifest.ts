import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Album Checklist',
    short_name: 'Album',
    description: 'Registra tu colección de estampas',
    start_url: '/',
    display: 'standalone',
    background_color: '#f0f4ff',
    theme_color: '#009e90',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
