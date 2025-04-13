import type React from "react"
interface SectionContainerProps {
  children: React.ReactNode
  className?: string
  id?: string
}

export default function SectionContainer({ children, className = "", id }: SectionContainerProps) {
  return (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      <div className="container mx-auto px-4">{children}</div>
    </section>
  )
}
