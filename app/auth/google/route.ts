import PocketBase from 'pocketbase'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET (request: NextRequest): Promise<NextResponse> {
  const proto = request.headers.get('x-forwarded-proto') || 'http'
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000'
  const callbackUrl = new URL('/auth/google/callback', `${proto}://${host}`).toString()

  const pb = new PocketBase(process.env.POCKETBASE_URL || '')

  let authMethods
  try {
    authMethods = await pb.collection('users').listAuthMethods()
  } catch (err) {
    console.error('listAuthMethods failed:', err)
    return new NextResponse('Failed to contact auth backend', { status: 502 })
  }

  const provider = authMethods.oauth2?.providers?.find((p: any) => p.name === 'google')
  if (!provider) {
    return new NextResponse('Google OAuth provider not configured', { status: 500 })
  }

  const googleUrl = new URL(provider.authURL)
  googleUrl.searchParams.set('redirect_uri', callbackUrl)

  const state = {
    codeVerifier: provider.codeVerifier,
    state: provider.state,
    name: provider.name
  }

  const store = cookies()
  store.set('oauth_google', JSON.stringify(state), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 600
  })

  return NextResponse.redirect(googleUrl.toString())
}
