import { useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"

export function useScrollUrl() {
  const router = useRouter()
  const pathname = usePathname()
  const isHomePage = pathname === "/"
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastHashRef = useRef<string>("")

  useEffect(() => {
    if (!isHomePage) return

    const handleScroll = () => {
      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

             // Debounce scroll events
       scrollTimeoutRef.current = setTimeout(() => {
         const sections = document.querySelectorAll(".section-anchor")
         let currentActiveSection = ""
         const windowHeight = window.innerHeight

         sections.forEach((section) => {
           const sectionTop = section.getBoundingClientRect().top
           const sectionHeight = section.getBoundingClientRect().height

           // Consider a section active if it's in the top portion of the viewport
           // or if we're at the bottom of the page and this is the last section
           if (sectionTop <= windowHeight * 0.3) {
             currentActiveSection = section.id
           }
         })

         // If we're at the bottom of the page and no section is active,
         // use the last section
         if (!currentActiveSection && sections.length > 0) {
           const lastSection = sections[sections.length - 1] as HTMLElement
           const lastSectionBottom = lastSection.getBoundingClientRect().bottom
           if (lastSectionBottom <= windowHeight) {
             currentActiveSection = lastSection.id
           }
         }

        // Update URL if the active section has changed
        if (currentActiveSection && currentActiveSection !== lastHashRef.current) {
          const newHash = `#${currentActiveSection}`
          lastHashRef.current = currentActiveSection

          // Update URL without triggering a page reload
          window.history.replaceState(null, "", newHash)
        } else if (!currentActiveSection && lastHashRef.current) {
          // If no section is active and we had one before, clear the hash
          lastHashRef.current = ""
          window.history.replaceState(null, "", window.location.pathname)
        }
      }, 100) // 100ms debounce
    }

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true })

    // Initial check
    handleScroll()

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      window.removeEventListener("scroll", handleScroll)
    }
  }, [isHomePage])

  // Handle browser back/forward navigation
  useEffect(() => {
    if (!isHomePage) return

    const handlePopState = () => {
      const hash = window.location.hash
      if (hash) {
        const sectionId = hash.substring(1)
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [isHomePage])
}
