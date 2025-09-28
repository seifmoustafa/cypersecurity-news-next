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
    // Try to get category name from the categories list
    let categoryName = "News Category"
    
    try {
      const categoriesResponse = await container.services.news.getNewsCategories(1, 100)
      const foundCategory = categoriesResponse.data.find(cat => cat.id === params.id)
      if (foundCategory) {
        categoryName = foundCategory.nameEn || foundCategory.name || "News Category"
      }
    } catch (error) {
      console.log("Could not fetch category details for metadata, using fallback name")
    }
    
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
    // Get news for this category first
    const newsData = await container.services.news.getNewsByCategory(params.id, 1, 100)

    if (!newsData || newsData.length === 0) {
      notFound()
    }

    // Try to get the actual category name from the categories list
    let categoryName = "News Category"
    let categoryNameEn = "News Category"
    
    try {
      const categoriesResponse = await container.services.news.getNewsCategories(1, 100)
      const foundCategory = categoriesResponse.data.find(cat => cat.id === params.id)
      if (foundCategory) {
        categoryName = foundCategory.name || "News Category"
        categoryNameEn = foundCategory.nameEn || foundCategory.name || "News Category"
      }
    } catch (error) {
      console.log("Could not fetch category details, using fallback name")
    }

    // Create a category object
    const category = {
      id: params.id,
      name: categoryName,
      nameEn: categoryNameEn
    }

    return <NewsCategoryPageClient category={category} news={newsData} />
  } catch (error) {
    console.error("❌ Error in NewsCategoryPage:", error)
    notFound()
  }
}
