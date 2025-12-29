import type { Metadata } from "next"
import AwarenessYearPageClient from "./AwarenessYearPageClient"

export const metadata: Metadata = {
  title: "Awareness Year",
  description: "Awareness content for specific year",
}

interface PageProps {
  params: Promise<{ year: string }>
}

export default async function AwarenessYearPage({ params }: PageProps) {
  const resolvedParams = await params
  return <AwarenessYearPageClient year={resolvedParams.year} />
}
