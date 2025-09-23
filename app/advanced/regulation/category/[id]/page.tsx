import type { Metadata } from "next"
import { container } from "@/core/di/container"
import { notFound } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import RegulationCategoryPageClient from "./RegulationCategoryPageClient"

interface RegulationCategoryPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: RegulationCategoryPageProps): Promise<Metadata> {
  try {
    const category = await container.services.regulationCategories.getCategoryById(params.id)

    if (!category) {
      return {
        title: "Category Not Found | Cybersecurity Portal",
        description: "The requested regulation category could not be found.",
      }
    }

    const categoryName = category.name_En || category.name_Ar || ""

    return {
      title: `${categoryName} Regulations | Cybersecurity Portal`,
      description: `Browse cybersecurity regulations in the ${categoryName} category.`,
    }
  } catch (error) {
    return {
      title: "Regulation Category | Cybersecurity Portal",
      description: "Browse cybersecurity regulations by category",
    }
  }
}

export default async function RegulationCategoryPage({ params }: RegulationCategoryPageProps) {
  try {
    const category = await container.services.regulationCategories.getCategoryById(params.id)

    if (!category) {
      notFound()
    }

    return (
      <MainLayout>
        <RegulationCategoryPageClient categoryId={params.id} />
      </MainLayout>
    )
  } catch (error) {
    console.error("❌ Error in RegulationCategoryPage:", error)
    notFound()
  }
}
