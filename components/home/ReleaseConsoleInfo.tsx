'use client'

import { useEffect } from 'react'

interface ReleaseConsoleInfoProps {
  version: string
  releaseDate: string
  branch: string
  commit: string
  environment: string
}

export function ReleaseConsoleInfo({ version, releaseDate, branch, commit, environment }: ReleaseConsoleInfoProps) {
  useEffect(() => {
    console.info(`[release] versión actual: ${version} · último release: ${releaseDate} · rama: ${branch} · commit: ${commit} · env: ${environment}`)
  }, [version, releaseDate, branch, commit, environment])

  return null
}
