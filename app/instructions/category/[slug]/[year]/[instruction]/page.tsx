import type { Metadata } from "next"
import { notFound } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import InstructionPageClient from "./InstructionPageClient"
import { container } from "@/core/di/container"
import { slugify } from "@/lib/utils"

interface PageProps {
  params: {
    slug: string
    year: string
    instruction: string
  }
}

async function findInstructionBySlugAndYear(instructionSlug: string, categorySlug: string, year: string) {
  try {
    console.log(`🔍 Finding instruction by slug: ${instructionSlug}, category: ${categorySlug}, year: ${year}`)

    // First, get the category and year to get the year ID
    const categoriesResponse = await container.services.instructionCategories.getAllCategories()
    const category = categoriesResponse.data.find((cat) => slugify(cat.nameEn || cat.name) === categorySlug)

    if (!category) {
      console.log(`❌ Category not found for slug: ${categorySlug}`)
      return null
    }

    console.log(`✅ Found category:`, category)

    const yearsResponse = await container.services.instructionYears.getYearsByCategory(category.id)
    const yearObj = yearsResponse.data.find((y) => y.year.toString() === year)

    if (!yearObj) {
      console.log(`❌ Year not found: ${year} for category ${category.id}`)
      return null
    }

    console.log(`✅ Found year:`, yearObj)

    // Get instructions for this year (first page with large page size to get all)
    const instructionsResponse = await container.services.instructions.getInstructionsByYearId(yearObj.id, 1, 100)

    console.log(`📋 Found ${instructionsResponse.data.length} instructions for year ${yearObj.id}`)

    // Find the instruction by slug
    const instruction = instructionsResponse.data.find((inst) => {
      const instSlug = slugify(inst.titleEn || inst.title)
      console.log(`🔍 Comparing instruction slug: ${instSlug} with target: ${instructionSlug}`)
      return instSlug === instructionSlug
    })

    if (instruction) {
      console.log(`✅ Found instruction:`, instruction)
    } else {
      console.log(`❌ Instruction not found for slug: ${instructionSlug}`)
    }

    return instruction || null
  } catch (error) {
    console.error("Error finding instruction by slug:", error)
    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { instruction: instructionSlug, slug: categorySlug, year } = params

  try {
    const instruction = await findInstructionBySlugAndYear(instructionSlug, categorySlug, year)

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
  const { instruction: instructionSlug, slug: categorySlug, year } = params

  try {
    console.log(`🚀 Loading instruction page for: ${instructionSlug}`)

    // Find the instruction by slug
    const instruction = await findInstructionBySlugAndYear(instructionSlug, categorySlug, year)

    if (!instruction) {
      console.error("Instruction not found for slug:", instructionSlug)
      return notFound()
    }

    console.log(`📄 Getting full instruction details for ID: ${instruction.id}`)

    // Get the full instruction details by ID
    const fullInstruction = await container.services.instructions.getInstructionById(instruction.id)

    if (!fullInstruction) {
      console.error("Full instruction not found for ID:", instruction.id)
      return notFound()
    }

    console.log(`✅ Successfully loaded instruction:`, fullInstruction.titleEn || fullInstruction.title)

    return (
      <MainLayout>
        <InstructionPageClient
          instruction={fullInstruction}
          categorySlug={categorySlug}
          yearNumber={Number.parseInt(year)}
        />
      </MainLayout>
    )
  } catch (error) {
    console.error("Error in InstructionPage:", error)
    notFound()
  }
}
