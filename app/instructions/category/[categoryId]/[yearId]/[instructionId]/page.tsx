import type { Metadata } from "next"
import { notFound } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import InstructionPageClient from "./InstructionPageClient"
import { container } from "@/core/di/container"

interface PageProps {
  params: {
    categoryId: string
    yearId: string
    instructionId: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { instructionId } = params

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
  const { instructionId, categoryId, yearId } = params

  try {
    console.log(`🚀 Loading instruction page for ID: ${instructionId}`)

    // Get the full instruction details by ID
    const fullInstruction = await container.services.instructions.getInstructionById(instructionId)

    if (!fullInstruction) {
      console.error("Instruction not found for ID:", instructionId)
      return notFound()
    }

    console.log(`✅ Successfully loaded instruction:`, fullInstruction.titleEn || fullInstruction.title)

    return (
      <MainLayout>
        <InstructionPageClient
          instruction={fullInstruction}
          categoryId={categoryId}
          yearId={yearId}
        />
      </MainLayout>
    )
  } catch (error) {
    console.error("Error in InstructionPage:", error)
    notFound()
  }
}
