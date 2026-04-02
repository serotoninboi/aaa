import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Header } from '@/components/Header'
import { ClerkProvider } from '@clerk/nextjs'

export const metadata: Metadata = {
  title: {
    default: 'PixelForge – AI Image Studio',
    template: '%s | PixelForge',
  },
  description: 'Edit images and poses with AI - Create stunning visual content with advanced AI tools',
  keywords: ['AI', 'image editing', 'pose estimation', 'AI studio', 'image processing'],
  authors: [{ name: 'PixelForge' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#080808',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ClerkProvider>
          <Header />
          <main className="w-full flex-1">{children}</main>
        </ClerkProvider>
      </body>
    </html>
  )
}
