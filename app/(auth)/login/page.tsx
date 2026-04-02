'use client'

import { SignIn } from '@clerk/nextjs'

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-16 scanlines">
      <SignIn />
    </main>
  )
}
