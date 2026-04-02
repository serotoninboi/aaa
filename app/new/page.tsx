import type { Metadata } from "next"
import LandingPageClient from "./client_page"

// Update the metadata title
export const metadata: Metadata = {
  title: "Dynavor - The Future of AI Cryptocurrency Trading",
  description:
    "Revolutionary AI-Powered Cryptocurrency Trading Platform. Join the future of intelligent crypto trading.",
}

export default function LandingPage() {
  return <LandingPageClient />
}
