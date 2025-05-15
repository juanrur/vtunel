import { type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@/utils'

import { NextResponse } from 'next/server'

export async function GET (request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  console.log(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '')
  if (code) {
    const supabase = createServerClient(cookies)

    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(requestUrl.origin)
}
