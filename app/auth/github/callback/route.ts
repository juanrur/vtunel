import PocketBase from 'pocketbase'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET (request: NextRequest): Promise<NextResponse> {
  const proto = request.headers.get('x-forwarded-proto') || 'http'
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000'
  const callbackUrl = new URL('/auth/github/callback', `${proto}://${host}`).toString()

  const code = request.nextUrl.searchParams.get('code')
  const stateParam = request.nextUrl.searchParams.get('state')

  if (!code || !stateParam) {
    return new NextResponse('Missing code or state', { status: 400 })
  }

  const store = cookies()
  const oauthCookie = store.get('oauth_github')?.value
  if (!oauthCookie) {
    return new NextResponse('OAuth session expired, try again', { status: 400 })
  }

  let parsed: { codeVerifier: string, state: string, name: string }
  try {
    parsed = JSON.parse(oauthCookie)
  } catch {
    return new NextResponse('Invalid OAuth session', { status: 400 })
  }

  if (parsed.state !== stateParam) {
    return new NextResponse('State mismatch', { status: 400 })
  }

  const pb = new PocketBase(process.env.POCKETBASE_URL || '')

  try {
    await pb.collection('users').authWithOAuth2Code(
      parsed.name,
      code,
      parsed.codeVerifier,
      callbackUrl
    )
  } catch (err) {
    console.error('authWithOAuth2Code failed:', err)
    return new NextResponse('Authentication failed', { status: 401 })
  }

  const pbAuth = JSON.stringify({
    token: pb.authStore.token,
    record: pb.authStore.record
  })

  store.set('pb_auth', pbAuth, {
    httpOnly: false,
    sameSite: 'lax',
    path: '/'
  })

  store.delete('oauth_github')

  return NextResponse.redirect(new URL('/', `${proto}://${host}`))
}
