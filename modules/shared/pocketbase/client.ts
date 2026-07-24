import PocketBase from 'pocketbase'

const pb = new PocketBase('/')
if (process.env.NODE_ENV === 'development') {
  pb.autoCancellation(false)
}

if (typeof window !== 'undefined' && document.cookie) {
  pb.authStore.loadFromCookie(document.cookie)
}

export { pb }
export const getCurrentUser = () => pb.authStore.record || null
