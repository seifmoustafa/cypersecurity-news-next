import type { Metadata } from "next"
import { notFound } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import InstructionYearPageClient from "./InstructionYearPageClient"
import { container } from "@/core/di/container"

interface PageProps {
  params: {
    slug: string
    year: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, year } = params
  const yearNumber = Number.parseInt(year, 10)

  if (isNaN(yearNumber)) return { title: "Invalid Year" }

  try {
    const category = await container.services.instructionCategories.getCategoryBySlug(slug)
    if (!category) return { title: "Category Not Found" }

    const yearData = await container.services.instructionYears.getYearByCategoryAndYear(category.id, yearNumber)
    if (!yearData) return { title: "Year Not Found" }

    return {
      title: `${category.nameEn} Instructions - ${yearNumber}`,
      description: `Cybersecurity instructions for ${category.nameEn} for the year ${yearNumber}`,
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Instructions Year",
    }
  }
}

export default async function InstructionYearPage({ params }: PageProps) {
  const { slug, year } = params
  const yearNumber = Number.parseInt(year, 10)

  if (isNaN(yearNumber)) return notFound()

  try {
    // Find category by slug
    const category = await container.services.instructionCategories.getCategoryBySlug(slug)
    if (!category) return notFound()

    // Find year by category and year number
    const yearData = await container.services.instructionYears.getYearByCategoryAndYear(category.id, yearNumber)
    if (!yearData) return notFound()

    return (
      <MainLayout>
        <InstructionYearPageClient
          categorySlug={slug}
          yearNumber={yearNumber}
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
