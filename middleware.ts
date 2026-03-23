import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient as createServerClientSupabase } from '@supabase/ssr'

export async function middleware (request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // No verificar sesión en /login y /auth
  if (pathname.startsWith('/login') || pathname.startsWith('/auth')) {
    return NextResponse.next()
  }

  // Para otras rutas, verificar sesión
  const supabase = createServerClientSupabase(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    {
      cookies: {
        getAll () {
          return request.cookies.getAll()
        },
        setAll (cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
          })
        }
      }
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  if (session === null) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}
