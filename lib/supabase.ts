import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoaXJvdmxnbW5lYnR0aHBjY3FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NzkwMDAsImV4cCI6MjA4ODI1NTAwMH0.cpgRA16P88kGHI7QGPXtK4fEbiNaQMKpjS2NWXiqBrg",
  )
}
