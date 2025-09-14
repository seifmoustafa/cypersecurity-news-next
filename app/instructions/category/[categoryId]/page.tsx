import type { Metadata } from "next"
import { notFound } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import { container } from "@/core/di/container"
import InstructionCategoryPageClient from "./InstructionCategoryPageClient"

interface PageProps {
  params: {
    categoryId: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categoryId } = params

  try {
    const category = await container.services.instructionCategories.getCategoryById(categoryId)
    if (!category) return { title: "Category Not Found" }

    return {
      title: `${category.nameEn} Instructions`,
      description: `Cybersecurity instructions for ${category.nameEn}`,
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Instructions Category",
    }
  }
}

export default async function InstructionCategoryPage({ params }: PageProps) {
  const { categoryId } = params

  try {
    // Find category by ID
    const category = await container.services.instructionCategories.getCategoryById(categoryId)
    if (!category) return notFound()

    return (
      <MainLayout>
        <InstructionCategoryPageClient categoryId={categoryId} initialCategory={category} />
      </MainLayout>
    )
  } catch (error) {
    console.error("Error in InstructionCategoryPage:", error)
    notFound()
  }
}
