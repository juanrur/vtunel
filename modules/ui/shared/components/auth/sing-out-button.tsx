'use client'
import { useRouter } from 'next/navigation'
import { pb } from '@shared/pocketbase/client'
import LogoutIcon from '@icons/logout'

export default function SingOutButton ({ expanded }: { expanded: boolean }) {
  const router = useRouter()

  const handleSignOut = async () => {
    pb.authStore.clear()
    document.cookie = 'pb_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; sameSite=Lax; secure=false'
    router.push('/login')
    router.refresh()
  }

  return (
    <button type='button' className='flex items-center justify-center gap-3 rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary md:w-full' onClick={handleSignOut} title='Sign out'>
      <LogoutIcon />
      <span className={(expanded ? '' : 'md:hidden') + ' text-nowrap font-bold'}>Sign Out</span>
    </button>
  )
}
