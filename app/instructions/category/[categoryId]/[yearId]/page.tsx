import type { Metadata } from "next"
import { notFound } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import InstructionYearPageClient from "./InstructionYearPageClient"
import { container } from "@/core/di/container"

interface PageProps {
  params: {
    categoryId: string
    yearId: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categoryId, yearId } = params

  try {
    const category = await container.services.instructionCategories.getCategoryById(categoryId)
    if (!category) return { title: "Category Not Found" }

    const yearData = await container.services.instructionYears.getYearById(yearId)
    if (!yearData) return { title: "Year Not Found" }

    return {
      title: `${category.nameEn} Instructions - ${yearData.year}`,
      description: `Cybersecurity instructions for ${category.nameEn} for the year ${yearData.year}`,
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Instructions Year",
    }
  }
}

export default async function InstructionYearPage({ params }: PageProps) {
  const { categoryId, yearId } = params

  try {
    // Find category by ID
    const category = await container.services.instructionCategories.getCategoryById(categoryId)
    if (!category) return notFound()

    // Find year by ID
    const yearData = await container.services.instructionYears.getYearById(yearId)
    if (!yearData) return notFound()

    return (
      <MainLayout>
        <InstructionYearPageClient
          categoryId={categoryId}
          yearId={yearId}
          initialCategory={category}
          initialYear={yearData}
        />
      </MainLayout>
    )
  } catch (error) {
    console.error("Error in InstructionYearPage:", error)
    notFound()
  }
}
