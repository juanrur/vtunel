'use client'
import { useRouter } from 'next/navigation'
import { pb } from '@shared/pocketbase/client'

export default function SingOutButton () {
  const router = useRouter()

  const handleSignOut = async () => {
    pb.authStore.clear()
    router.refresh()
  }

  return (
    <button className='p-2 rounded-lg w-32' onClick={handleSignOut}>Sing Out</button>
  )
}
