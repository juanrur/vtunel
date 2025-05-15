import { createServerClient as createServerClientSupabase } from '@supabase/ssr'

export const pad = (number: number) => number < 10 ? '0' + number : number

export const createServerClient = (cookies: any) => {
  const cookieStore = cookies()

  return createServerClientSupabase(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    {
      cookies: {
        getAll () {
          return cookieStore.getAll()
        },
        setAll (cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch (error) {
            console.error('Error al establecer cookies:', error)
          }
        }
      }
    })
}
