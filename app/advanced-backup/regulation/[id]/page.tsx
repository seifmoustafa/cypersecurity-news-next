import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { container } from "@/core/di/container"
import RegulationPageClient from "./RegulationPageClient"
import MainLayout from "@/components/layouts/main-layout"

interface PageProps {
      params: Promise<{
            id: string
      }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
      try {
            const resolvedParams = await params
            const regulation = await container.services.regulations.getRegulationById(resolvedParams.id)

            if (!regulation) {
                  return {
                        title: "Regulation Not Found | Cybersecurity Portal",
                        description: "The requested regulation could not be found.",
                  }
            }

            const title = regulation.titleEn || regulation.title || ""
            const summary = regulation.summaryEn || regulation.summary || ""

            return {
                  title: `${title} | Cybersecurity Portal`,
                  description: summary,
            }
      } catch (error) {
            return {
                  title: "Regulation | Cybersecurity Portal",
                  description: "Regulation details",
            }
      }
}

export default async function RegulationPage({ params }: PageProps) {
      try {
            const resolvedParams = await params

            // RegulationPageClient fetches its own data based on ID
            return (
                  <MainLayout>
                        <RegulationPageClient regulationId={resolvedParams.id} />
                  </MainLayout>
            )
      } catch (error) {
            console.error("❌ Error in RegulationPage:", error)
            notFound()
      }
}
