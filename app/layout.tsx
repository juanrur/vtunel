import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from 'react'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/utils'
import { cookies } from 'next/headers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Vtunel',
  description: 'A simple calendar and effective app'
}

export default async function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createServerClient(cookies)
  const { data: { session } } = await supabase.auth.getSession()

  if (session === null) redirect('/login')
  return (
    <html lang="en">
    <body className={`${inter.className} h-svh`}>{children}</body>
    </html>
  )
}
