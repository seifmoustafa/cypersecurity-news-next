import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { container } from "@/core/di/container"
import PersonalProtectSubCategoryPageClient from "./PersonalProtectSubCategoryPageClient"

interface PageProps {
  params: {
    categoryId: string
    subcategoryId: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const subCategory = await container.services.personalProtect.getSubCategoryById(params.subcategoryId)

    if (!subCategory) {
      return {
        title: "Personal Protection Sub-Category Not Found | Cybersecurity Portal",
        description: "The requested personal protection sub-category could not be found.",
      }
    }

    const title = subCategory.nameEn || subCategory.name || ""
    const description = subCategory.descriptionEn || subCategory.description || ""

    return {
      title: `${title} | Personal Protection | Cybersecurity Portal`,
      description: description,
    }
  } catch (error) {
    return {
      title: "Personal Protection Sub-Category | Cybersecurity Portal",
      description: "Personal protection sub-category details",
    }
  }
}

export default async function PersonalProtectSubCategoryPage({ params }: PageProps) {
  try {
    const subCategory = await container.services.personalProtect.getSubCategoryById(params.subcategoryId)

    if (!subCategory) {
      notFound()
    }

    return <PersonalProtectSubCategoryPageClient subCategory={subCategory} categoryId={params.categoryId} />
  } catch (error) {
    console.error("❌ Error in PersonalProtectSubCategoryPage:", error)
    notFound()
  }
}
