import { type NextRequest, NextResponse } from 'next/server'
import PocketBase from 'pocketbase'

export async function GET (request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const provider = requestUrl.searchParams.get('provider') || 'github'
  const redirectURL = `${requestUrl.origin}/auth/callback?provider=${provider}`

  try {
    if (!code) {
      return NextResponse.redirect(`${requestUrl.origin}/login`)
    }

    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL ?? '')
    await pb.collection('users').authWithOAuth2({
      provider,
      code,
      redirectURL
    })

    const response = NextResponse.redirect(requestUrl.origin)
    response.cookies.set('pb_auth', pb.authStore.token, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax'
    })

    return response
  } catch (error) {
    console.error('Error during OAuth callback:', error)
    return NextResponse.redirect(`${requestUrl.origin}/login`)
  }
}
