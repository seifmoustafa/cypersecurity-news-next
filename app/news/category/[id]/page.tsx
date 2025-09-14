import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { container } from "@/core/di/container"
import NewsCategoryPageClient from "./NewsCategoryPageClient"

interface PageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const category = await container.services.news.getNewsCategoryById(params.id)

    if (!category) {
      return {
        title: "News Category Not Found | Cybersecurity Portal",
        description: "The requested news category could not be found.",
      }
    }

    const categoryName = category.nameEn || category.name || ""

    return {
      title: `${categoryName} News | Cybersecurity Portal`,
      description: `Browse news articles in the ${categoryName} category`,
    }
  } catch (error) {
    return {
      title: "News Category | Cybersecurity Portal",
      description: "Browse news articles by category",
    }
  }
}

export default async function NewsCategoryPage({ params }: PageProps) {
  try {
    const category = await container.services.news.getNewsCategoryById(params.id)

    if (!category) {
      notFound()
    }

    // Get news for this category
    const newsData = await container.services.news.getNewsByCategory(category.id, 1, 100)

    return <NewsCategoryPageClient category={category} news={newsData} />
  } catch (error) {
    console.error("❌ Error in NewsCategoryPage:", error)
    notFound()
  }
}
