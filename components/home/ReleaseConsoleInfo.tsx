'use client'

import { useEffect } from 'react'

interface ReleaseConsoleInfoProps {
  version: string
  releaseDate: string
}

export function ReleaseConsoleInfo({ version, releaseDate }: ReleaseConsoleInfoProps) {
  useEffect(() => {
    console.info(`[release] versión actual: ${version} · último release: ${releaseDate}`)
  }, [version, releaseDate])

  return null
}
