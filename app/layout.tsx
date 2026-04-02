import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Header } from '@/components/Header'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/ui/themes'

export const metadata: Metadata = {
  title: {
    default: 'Claudine AI – Creative Studio',
    template: '%s | Claudine AI',
  },
  description: 'Transform your images with AI-powered creativity. Generate, edit, and enhance visuals in our private creative studio.',
  keywords: ['AI', 'image generation', 'image editing', 'face swap', 'pose editing', 'creative AI'],
  authors: [{ name: 'Claudine AI' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0d0609',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased ambient-sensual mesh-gradient">
        <ClerkProvider appearance={{ theme: dark }}>
          <Header />
          <main className="relative z-10 w-full flex-1">{children}</main>
        </ClerkProvider>
      </body>
    </html>
  )
}
