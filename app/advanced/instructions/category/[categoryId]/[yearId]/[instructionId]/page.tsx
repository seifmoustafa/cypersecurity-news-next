import type { Metadata } from "next"
import { notFound } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import InstructionPageClient from "./InstructionPageClient"
import { container } from "@/core/di/container"

interface PageProps {
  params: Promise<{
    categoryId: string
    yearId: string
    instructionId: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const { instructionId } = resolvedParams

  try {
    const instruction = await container.services.instructions.getInstructionById(instructionId)

    if (!instruction) {
      return { title: "Instruction Not Found" }
    }

    return {
      title: instruction.titleEn || instruction.title,
      description: instruction.summaryEn || instruction.summary,
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Instruction",
    }
  }
}

export default async function InstructionPage({ params }: PageProps) {
  const resolvedParams = await params
  const { instructionId, categoryId, yearId } = resolvedParams

  try {
    console.log(`🚀 Loading instruction page for ID: ${instructionId}`)

    // Get the full instruction details by ID
    const fullInstruction = await container.services.instructions.getInstructionById(instructionId)

    if (!fullInstruction) {
      console.error("Instruction not found for ID:", instructionId)
      return notFound()
    }

    // Fetch category and year data for breadcrumbs
    let category
    let year

    try {
      category = await container.services.instructionCategories.getCategoryById(categoryId)
    } catch (error) {
      console.warn("Could not fetch category:", error)
    }

    try {
      year = await container.services.instructionYears.getYearById(yearId)
    } catch (error) {
      console.warn("Could not fetch year:", error)
    }

    console.log(`✅ Successfully loaded instruction:`, fullInstruction.titleEn || fullInstruction.title)

    return (
      <MainLayout>
        <InstructionPageClient
          instruction={fullInstruction}
          categoryId={categoryId}
          categoryName={category?.nameEn}
          categoryNameAr={category?.name}
          yearId={yearId}
          year={year?.year?.toString()}
        />
      </MainLayout>
    )
  } catch (error) {
    console.error("Error in InstructionPage:", error)
    notFound()
  }
}
