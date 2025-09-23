import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { container } from "@/core/di/container"
import PersonalProtectCategoryPageClient from "./PersonalProtectCategoryPageClient"

interface PageProps {
  params: {
    categoryId: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const category = await container.services.personalProtect.getPersonalProtectCategoryById(params.categoryId)

    if (!category) {
      return {
        title: "Personal Protection Category Not Found | Cybersecurity Portal",
        description: "The requested personal protection category could not be found.",
      }
    }

    const title = category.nameEn || category.name || ""
    const description = category.descriptionEn || category.description || ""

    return {
      title: `${title} | Personal Protection | Cybersecurity Portal`,
      description: description,
    }
  } catch (error) {
    return {
      title: "Personal Protection Category | Cybersecurity Portal",
      description: "Personal protection category details",
    }
  }
}

export default async function PersonalProtectCategoryPage({ params }: PageProps) {
  try {
    const category = await container.services.personalProtect.getPersonalProtectCategoryById(params.categoryId)

    if (!category) {
      notFound()
    }

    return <PersonalProtectCategoryPageClient category={category} />
  } catch (error) {
    console.error("❌ Error in PersonalProtectCategoryPage:", error)
    notFound()
  }
}
