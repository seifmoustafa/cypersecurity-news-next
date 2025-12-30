import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { container } from "@/core/di/container"
import LawPageClient from "./LawPageClient"

interface PageProps {
      params: Promise<{
            id: string
      }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
      try {
            const resolvedParams = await params
            const law = await container.services.laws.getLawById(resolvedParams.id)

            if (!law) {
                  return {
                        title: "Law Not Found | Cybersecurity Portal",
                        description: "The requested law could not be found.",
                  }
            }

            const title = law.titleEn || law.title || ""
            const summary = law.summaryEn || law.summary || ""

            return {
                  title: `${title} | Cybersecurity Portal`,
                  description: summary,
            }
      } catch (error) {
            return {
                  title: "Law | Cybersecurity Portal",
                  description: "Law details",
            }
      }
}

export default async function LawPage({ params }: PageProps) {
      try {
            const resolvedParams = await params
            const law = await container.services.laws.getLawById(resolvedParams.id)

            if (!law) {
                  notFound()
            }

            // Get the category if categoryId exists
            let category = null
            if (law.categoryId) {
                  try {
                        category = await container.services.laws.getCategoryById(law.categoryId)
                  } catch (e) {
                        console.error("Error fetching law category:", e)
                  }
            }

            return <LawPageClient law={law} category={category} />
      } catch (error) {
            console.error("❌ Error in LawPage:", error)
            notFound()
      }
}
