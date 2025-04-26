"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layouts/main-layout";
import NewsTicker from "@/components/news-ticker";
import NewsCarousel from "@/components/news-carousel";
import TipOfTheDayPopup from "@/components/tip-of-the-day-popup";
import SystemsSection from "@/components/sections/systems-section";
import CyberSecurityRegulationSection from "@/components/sections/cybersecurity-regulation-section";
import AwarenessSection from "@/components/sections/awareness-section";
import SecurityRequirementsSection from "@/components/sections/security-requirements-section";
import CybersecurityConceptsSection from "@/components/sections/standards-section";
import MediaLibrarySection from "@/components/sections/media-library-section";
import HeroSection from "@/components/hero-section";

export default function Home() {
  const router = useRouter();
  const initialScrollDone = useRef(false);

  // Force client-side navigation
  useEffect(() => {
    router.prefetch("/news");
    router.prefetch("/standards/international");
    router.prefetch("/instructions/group");
    router.prefetch("/instructions/branch");
    router.prefetch("/framework");
  }, [router]);

  // Handle hash navigation
  useEffect(() => {
    // Check if there's a hash in the URL
    if (typeof window !== "undefined" && !initialScrollDone.current) {
      const hash = window.location.hash;
      if (hash) {
        // Wait for the page to fully load
        setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
            initialScrollDone.current = true;

            // Check if there's stored tab information for this section
            const sectionId = hash.substring(1);
            const storedTab = sessionStorage.getItem(`${sectionId}_activeTab`);

            if (storedTab) {
              // Dispatch a tab change event
              const tabChangeEvent = new CustomEvent("tabchange", {
                detail: { sectionId, tab: storedTab },
              });
              window.dispatchEvent(tabChangeEvent);

              // Clear the stored tab information
              sessionStorage.removeItem(`${sectionId}_activeTab`);
            }
          }
        }, 300);
      }
    }
  }, []);

  return (
    <MainLayout>
      {/* Hero Section with background animation */}
      <HeroSection />

      <NewsTicker />
      {/* The TipOfTheDayPopup will now show every time the page loads unless disabled */}
      <TipOfTheDayPopup />

      {/* Latest news section */}
      <NewsCarousel articles={[]} />

      <div id="regulation" className="section-anchor pt-16 -mt-16"></div>
      <CyberSecurityRegulationSection />

      <div id="awareness" className="section-anchor pt-16 -mt-16"></div>
      <AwarenessSection />

      <div
        id="security-requirements"
        className="section-anchor pt-16 -mt-16"
      ></div>
      <SecurityRequirementsSection />

      {/* Add Framework Preview Section */}
      <div id="standards" className="section-anchor pt-16 -mt-16"></div>
      <CybersecurityConceptsSection />

      <div id="media" className="section-anchor pt-16 -mt-16"></div>
      <MediaLibrarySection />

      <div id="systems" className="section-anchor pt-16 -mt-16"></div>
      <SystemsSection />
    </MainLayout>
  );
}
