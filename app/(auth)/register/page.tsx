'use client'

import { SignUp } from '@clerk/nextjs'
import {shadesOfPurple, neobrutalism } from '@clerk/ui/themes'

export default function RegisterPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-16 scanlines">
      <SignUp appearance={{
     theme: neobrutalism,

   }}  />
         <SignUp appearance={{
     theme: shadesOfPurple,

   }}  />
    </main>
  )
}
