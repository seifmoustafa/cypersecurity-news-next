"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { forwardRef } from "react"

interface OptimizedLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  prefetch?: boolean
  children: React.ReactNode
}

export const OptimizedLink = forwardRef<HTMLAnchorElement, OptimizedLinkProps>(
  ({ href, prefetch = true, children, ...props }, ref) => {
    const pathname = usePathname()
    const isActive = pathname === href

    return (
      <Link ref={ref} href={href} prefetch={prefetch} {...props}>
        {children}
      </Link>
    )
  },
)

OptimizedLink.displayName = "OptimizedLink"
