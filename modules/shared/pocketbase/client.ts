import PocketBase from 'pocketbase'

export const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || '')

export const getCurrentUser = () => pb.authStore.record || null
