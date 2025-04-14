"use client"

import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { type ReactNode, useEffect, useState } from "react"

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isFirstRender, setIsFirstRender] = useState(true)

  useEffect(() => {
    // Skip animation on first render
    setIsFirstRender(false)
  }, [])

  // Skip animation on first render
  if (isFirstRender) {
    return <>{children}</>
  }

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0.8, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0.8, y: 10 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}
