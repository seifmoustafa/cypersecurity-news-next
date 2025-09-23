"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import TipsTicker from "@/components/tips-ticker"
import TipOfTheDayPopup from "@/components/tip-of-the-day-popup"

import SecurityRequirementsSection from "@/components/sections/security-requirements-section"
import CybersecurityConceptsSection from "@/components/sections/cybersecurity-concepts"
import HeroNewsSection from "@/components/sections/hero-news-section"
import { useScrollUrl } from "@/core/hooks/use-scroll-url"
import AwarenessSection from "@/components/sections/awareness-section"
import MediaLibrarySection from "@/components/sections/media-library-section"
import HelperSystemsSection from "@/components/sections/helper-systems-section"
import SystemsSection from "@/components/sections/systems-section"

export default function Home() {
  const router = useRouter()
  const initialScrollDone = useRef(false)
  
  // Use the scroll URL hook for dynamic URL updates
  useScrollUrl()

  // Prefetch advanced routes
  useEffect(() => {
    router.prefetch("/advanced/news")
    router.prefetch("/advanced/standards/international")
    router.prefetch("/advanced/instructions/category")
    router.prefetch("/advanced/framework")
  }, [router])

  // Handle hash navigation
  useEffect(() => {
    // Check if there's a hash in the URL
    if (typeof window !== "undefined" && !initialScrollDone.current) {
      const hash = window.location.hash
      if (hash) {
        // Wait for the page to fully load
        setTimeout(() => {
          const element = document.querySelector(hash)
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" })
            initialScrollDone.current = true

            // Check if there's stored tab information for this section
            const sectionId = hash.substring(1)
            const storedTab = sessionStorage.getItem(`${sectionId}_activeTab`)

            if (storedTab) {
              // Dispatch a tab change event
              const tabChangeEvent = new CustomEvent("tabchange", {
                detail: { sectionId, tab: storedTab },
              })
              window.dispatchEvent(tabChangeEvent)

              // Clear the stored tab information
              sessionStorage.removeItem(`${sectionId}_activeTab`)
            }
          }
        }, 300)
      }
    }
  }, [])

  return (
    <MainLayout>
      <TipsTicker />
      {/* The TipOfTheDayPopup will now show every time the page loads unless disabled */}
      <TipOfTheDayPopup />

      {/* Hero and News Carousel combined section */}
      <HeroNewsSection />


      <div id="awareness" className="section-anchor pt-16 -mt-16"></div>
      <AwarenessSection />

      <div id="security-requirements" className="section-anchor pt-16 -mt-16"></div>
      <SecurityRequirementsSection />

      {/* Add Framework Preview Section */}
      <div id="standards" className="section-anchor pt-16 -mt-16"></div>
      <CybersecurityConceptsSection />

      <div id="media" className="section-anchor pt-16 -mt-16"></div>
      <MediaLibrarySection />

      <div id="helpers" className="section-anchor pt-16 -mt-16"></div>
      <HelperSystemsSection />

      <div id="systems" className="section-anchor pt-16 -mt-16"></div>
      <SystemsSection />
    </MainLayout>
  )
}
