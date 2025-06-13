import type { Metadata } from "next"
import { notFound } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import InstructionCategoryPageClient from "./InstructionCategoryPageClient"
import { container } from "@/core/di/container"

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = params

  try {
    const category = await container.services.instructionCategories.getCategoryBySlug(slug)
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
  const { slug } = params

  try {
    // Find category by slug
    const category = await container.services.instructionCategories.getCategoryBySlug(slug)
    if (!category) return notFound()

    return (
      <MainLayout>
        <InstructionCategoryPageClient categorySlug={slug} initialCategory={category} />
      </MainLayout>
    )
  } catch (error) {
    console.error("Error in InstructionCategoryPage:", error)
    notFound()
  }
}
