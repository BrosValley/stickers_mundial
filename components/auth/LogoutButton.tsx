'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { ReactNode } from 'react'

interface LogoutButtonProps {
  children?: ReactNode
  className?: string
}

export function LogoutButton({ children = 'Cerrar sesión', className }: LogoutButtonProps) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  async function handleLogout() {
    if (isPending) return

    setIsPending(true)
    try {
      await fetch('/auth/signout', {
        method: 'POST',
        headers: { Accept: 'application/json' },
      })
    } finally {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <button
      type="button"
      className={className}
      onClick={handleLogout}
      disabled={isPending}
    >
      {isPending ? 'Cerrando...' : children}
    </button>
  )
}
