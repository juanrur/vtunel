import { type NextRequest, NextResponse } from 'next/server'
import PocketBase from 'pocketbase'

export async function middleware (request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (pathname.startsWith('/login')) {
    return NextResponse.next()
  }

  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || '')

  const cookieHeader = request.headers.get('cookie') || ''
  pb.authStore.loadFromCookie(cookieHeader)

  if (!pb.authStore.isValid) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}
