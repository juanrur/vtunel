'use client'
import { useRouter } from 'next/navigation'
import { supabase } from '@/db/supabase-client'

export default function SingOutButton () {
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <button className='p-2 rounded-lg w-32' onClick={handleSignOut}>Sing Out</button>
  )
}
