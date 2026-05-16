import { NextResponse } from 'next/server'
import { getReleaseInfo } from '@/lib/release-info'

export function GET() {
  return NextResponse.json(getReleaseInfo())
}
