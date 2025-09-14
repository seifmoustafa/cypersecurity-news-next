import type { Metadata } from "next"
import RegulationPageClient from "./RegulationPageClient"
import { notFound } from "next/navigation"
import { container } from "@/core/di/container"
import MainLayout from "@/components/layouts/main-layout"

interface RegulationPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: RegulationPageProps): Promise<Metadata> {
  try {
    const regulation = await container.services.regulations.getRegulationById(params.id)

    if (!regulation) {
      return {
        title: "Regulation Not Found | Cybersecurity Portal",
        description: "The requested regulation could not be found.",
      }
    }

    const title = regulation.titleEn || regulation.titleAr || ""
    const summary = regulation.summaryEn || regulation.summaryAr || ""

    return {
      title: `${title} | Cybersecurity Portal`,
      description: summary,
    }
  } catch (error) {
    return {
      title: "Regulation Not Found | Cybersecurity Portal",
      description: "The requested regulation could not be found.",
    }
  }
}

export default async function RegulationPage({ params }: RegulationPageProps) {
  try {
    const regulation = await container.services.regulations.getRegulationById(params.id)

    if (!regulation) {
      notFound()
    }

    return (
      <MainLayout>
        <RegulationPageClient regulationId={params.id} />
      </MainLayout>
    )
  } catch (error) {
    console.error("❌ Error in RegulationPage:", error)
    notFound()
  }
}
