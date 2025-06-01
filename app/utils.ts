import { createServerClient as createServerClientSupabase } from '@supabase/ssr'

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

export const getWeekStartEndDates = (date: Date) => {
  const dayOfWeek = date.getDay()
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const startOfWeek = new Date(date)
  startOfWeek.setDate(date.getDate() + diffToMonday)
  startOfWeek.setHours(0, 0, 0, 0)

  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  endOfWeek.setHours(23, 59, 59, 999)
  return { startOfWeek, endOfWeek }
}
