"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import HeroSection from "@/components/sections/hero-section"
import NewsTicker from "@/components/news-ticker"
import NewsCarousel from "@/components/news-carousel"
import TipOfTheDayPopup from "@/components/tip-of-the-day-popup"
import SystemsSection from "@/components/sections/systems-section"
import CyberSecurityRegulationSection from "@/components/sections/cybersecurity-regulation-section"
import AwarenessSection from "@/components/sections/awareness-section"
import SecurityInstructionsSection from "@/components/sections/security-instructions-section"
import StandardsSection from "@/components/sections/standards-section"
import MediaLibrarySection from "@/components/sections/media-library-section"

export default function Home() {
  const router = useRouter()

  // Force client-side navigation
  useEffect(() => {
    router.prefetch("/news")
    router.prefetch("/standards/international")
    router.prefetch("/instructions/group")
    router.prefetch("/instructions/branch")
  }, [router])

  return (
    <MainLayout>
      <NewsTicker />
      <TipOfTheDayPopup />
      <HeroSection />
      <NewsCarousel />

      <div id="systems" className="section-anchor"></div>
      <SystemsSection />

      <div id="regulation" className="section-anchor"></div>
      <CyberSecurityRegulationSection />

      <div id="awareness" className="section-anchor"></div>
      <AwarenessSection />

      <div id="instructions" className="section-anchor"></div>
      <SecurityInstructionsSection />

      <div id="standards" className="section-anchor"></div>
      <StandardsSection />

      <div id="media" className="section-anchor"></div>
      <MediaLibrarySection />
    </MainLayout>
  )
}
