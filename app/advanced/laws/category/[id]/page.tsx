import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { container } from "@/core/di/container"
import LawCategoryPageClient from "./LawCategoryPageClient"

interface PageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const category = await container.services.laws.getCategoryById(params.id)

    if (!category) {
      return {
        title: "Law Category Not Found | Cybersecurity Portal",
      }
    }

    return {
      title: `${category.nameEn || category.name} Laws | Cybersecurity Portal`,
      description: `Browse laws in the ${category.nameEn || category.name} category`,
    }
  } catch (error) {
    console.error("❌ Error generating metadata for law category:", error)
    return {
      title: "Law Category | Cybersecurity Portal",
    }
  }
}

export default async function LawCategoryPage({ params }: PageProps) {
  try {
    const category = await container.services.laws.getCategoryById(params.id)

    if (!category) {
      notFound()
    }

    // Get laws for this category
    const lawsResponse = await container.services.laws.getLawsByCategory(category.id, 1, 20)

    return (
      <LawCategoryPageClient
        category={category}
        laws={lawsResponse?.data || []}
        pagination={lawsResponse?.pagination}
      />
    )
  } catch (error) {
    console.error("❌ Error in LawCategoryPage:", error)
    // Return empty state instead of notFound for better UX
    return (
      <LawCategoryPageClient
        category={{
          id: "",
          name: "Unknown Category",
          nameEn: "Unknown Category",
          isActive: true,
          createdAt: "",
          updatedAt: null,
        }}
        laws={[]}
        pagination={null}
      />
    )
  }
}
