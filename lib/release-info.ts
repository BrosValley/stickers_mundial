import { execSync } from 'child_process'
import { readFileSync } from 'fs'
import { join } from 'path'
import packageJson from '@/package.json'

function firstEnv(names: string[]) {
  for (const name of names) {
    const value = process.env[name]
    if (value) return value
  }
  return null
}

function gitValue(command: string) {
  try {
    return execSync(command, { cwd: process.cwd(), encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch {
    return null
  }
}

function getReleaseDate() {
  const explicitReleaseDate = firstEnv(['NEXT_PUBLIC_RELEASE_DATE', 'RELEASE_DATE', 'HARNESS_RELEASE_DATE'])
  if (explicitReleaseDate) return explicitReleaseDate

  try {
    const sw = readFileSync(join(process.cwd(), 'public', 'sw.js'), 'utf8')
    const timestamp = sw.match(/const CACHE = 'album-(\d+)'/)?.[1]
    if (timestamp) return new Date(Number(timestamp)).toISOString()
  } catch {}

  return 'sin fecha configurada'
}

export function getReleaseInfo() {
  const commit = firstEnv([
    'NEXT_PUBLIC_RELEASE_SHA',
    'RELEASE_SHA',
    'HARNESS_COMMIT_ID',
    'HARNESS_GIT_COMMIT',
    'CI_COMMIT_SHA',
    'GITHUB_SHA',
    'VERCEL_GIT_COMMIT_SHA',
  ]) ?? gitValue('git rev-parse --short HEAD') ?? 'sin commit'

  const branch = firstEnv([
    'NEXT_PUBLIC_RELEASE_BRANCH',
    'RELEASE_BRANCH',
    'HARNESS_BRANCH',
    'HARNESS_GIT_BRANCH',
    'CI_COMMIT_BRANCH',
    'GITHUB_REF_NAME',
    'VERCEL_GIT_COMMIT_REF',
  ]) ?? gitValue('git rev-parse --abbrev-ref HEAD') ?? 'sin rama'

  return {
    version: packageJson.version,
    releaseDate: getReleaseDate(),
    branch,
    commit: commit.length > 12 ? commit.slice(0, 12) : commit,
    environment: process.env.NODE_ENV ?? 'unknown',
  }
}
