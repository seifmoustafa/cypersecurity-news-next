import type { Metadata } from "next"
import RegulationPageClient from "./RegulationPageClient"
import { notFound } from "next/navigation"
import { regulationData } from "@/data/regulation-data"

interface RegulationPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: RegulationPageProps): Promise<Metadata> {
  const numericId = Number.parseInt(params.id, 10)
  const regulation = regulationData.find((reg) => reg.id === numericId)

  if (!regulation) {
    return {
      title: "Regulation Not Found | Cybersecurity Center",
      description: "The requested regulation could not be found.",
    }
  }

  return {
    title: `${regulation.title.en} | Cybersecurity Center`,
    description: regulation.shortDescription.en,
  }
}

export default async function RegulationPage({ params }: RegulationPageProps) {
  const numericId = Number.parseInt(params.id, 10)
  const regulation = regulationData.find((reg) => reg.id === numericId)

  if (!regulation) {
    notFound()
  }

  return <RegulationPageClient regulation={regulation} />
}
