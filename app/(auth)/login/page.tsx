'use client'

import { SignIn } from '@clerk/nextjs'
import { dark, neobrutalism } from '@clerk/ui/themes'

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-16 scanlines">
      <SignIn   appearance={{
     theme: dark,

   }} />
    </main>
  )
}
