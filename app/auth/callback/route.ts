import { type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@/utils'

import { NextResponse } from 'next/server'

export async function GET (request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  console.log('Code received:', code)
  try {
    if (code) {
      const supabase = createServerClient(cookies)

      await supabase.auth.exchangeCodeForSession(code)
    }
  } catch (error) {
    console.error('Error exchanging code for session:', error)
    return NextResponse.json({ error: 'Failed to sign in' }, { status: 500 })
  }

  return NextResponse.redirect(requestUrl.origin)
}
