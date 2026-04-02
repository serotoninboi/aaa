'use client'

import { SignUp } from '@clerk/nextjs'

export default function RegisterPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-16 scanlines">
      <SignUp />
    </main>
  )
}
