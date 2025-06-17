import type { Metadata } from "next"
import AwarenessYearsPageClient from "./AwarenessYearsPageClient"

export const metadata: Metadata = {
  title: "Awareness Years | Cybersecurity Portal",
  description: "Browse awareness content by year",
}

export default function AwarenessYearsPage() {
  return <AwarenessYearsPageClient />
}
