'use client'
import { useRouter } from 'next/navigation'
import { pb } from '@shared/pocketbase/client'

export default function SingOutButton () {
  const router = useRouter()

  const handleSignOut = async () => {
    pb.authStore.clear()
    document.cookie = 'pb_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; sameSite=Lax; secure=false'
    router.push('/login')
    router.refresh()
  }

  return (
    <button className='p-2 rounded-lg w-full md:w-32 text-sm' onClick={handleSignOut}>Sign Out</button>
  )
}
