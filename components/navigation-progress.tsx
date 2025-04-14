"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function NavigationProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isNavigating, setIsNavigating] = useState(false)
  const [prevPathname, setPrevPathname] = useState("")
  const [prevSearchParams, setPrevSearchParams] = useState("")
  const [isFirstRender, setIsFirstRender] = useState(true)

  useEffect(() => {
    // Skip the first render to avoid showing the progress bar on initial load
    if (isFirstRender) {
      setPrevPathname(pathname)
      setPrevSearchParams(searchParams.toString())
      setIsFirstRender(false)
      return
    }

    // Only show progress indicator when actual navigation occurs
    const currentSearchParams = searchParams.toString()

    if (prevPathname !== pathname || prevSearchParams !== currentSearchParams) {
      // Real navigation detected
      setIsNavigating(true)

      // Hide progress indicator after navigation completes
      const timeout = setTimeout(() => {
        setIsNavigating(false)
      }, 500)

      // Update previous values
      setPrevPathname(pathname)
      setPrevSearchParams(currentSearchParams)

      return () => clearTimeout(timeout)
    }
  }, [pathname, searchParams, prevPathname, prevSearchParams, isFirstRender])

  if (!isNavigating) return null

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-primary z-[100]"
      initial={{ width: "0%" }}
      animate={{ width: "100%" }}
      transition={{ duration: 0.5 }}
    />
  )
}
