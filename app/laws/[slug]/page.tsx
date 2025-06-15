import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { container } from "@/core/di/container"
import LawPageClient from "./LawPageClient"

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const law = await container.services.laws.getLawBySlug(params.slug)

    if (!law) {
      return {
        title: "Law Not Found | Cybersecurity Portal",
      }
    }

    return {
      title: `${law.titleEn || law.title} | Cybersecurity Portal`,
      description: law.summaryEn || law.summary || "Cybersecurity law details",
    }
  } catch (error) {
    console.error("❌ Error generating metadata for law:", error)
    return {
      title: "Law | Cybersecurity Portal",
    }
  }
}

export default async function LawPage({ params }: PageProps) {
  try {
    const law = await container.services.laws.getLawBySlug(params.slug)

    if (!law) {
      notFound()
    }

    // Get the category details using the correct method name
    const category = await container.services.laws.getCategoryById(law.categoryId)

    return <LawPageClient law={law} category={category} />
  } catch (error) {
    console.error("❌ Error in LawPage:", error)
    notFound()
  }
}
