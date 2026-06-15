import PocketBase from 'pocketbase'

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || '')
if (process.env.NODE_ENV === 'development') {
  pb.autoCancellation(false)
}

export { pb }
export const getCurrentUser = () => pb.authStore.record || null
