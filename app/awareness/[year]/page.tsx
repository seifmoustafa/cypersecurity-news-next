import type { Metadata } from "next"
import AwarenessYearPageClient from "./AwarenessYearPageClient"

export const metadata: Metadata = {
  title: "Awareness Year",
  description: "Awareness content for specific year",
}

export default function AwarenessYearPage({ params }: { params: { year: string } }) {
  return <AwarenessYearPageClient year={params.year} />
}
