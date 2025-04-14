import { getInstructionByTypeAndYear } from "@/data/instructions-data"
import InstructionsPageClient from "./InstructionsPageClient"
import type { Metadata } from "next"

// Force dynamic rendering for these routes
export const dynamic = "force-dynamic"

// This function runs on the server
export async function generateMetadata({
  params,
}: {
  params: { type: string; year: string }
}): Promise<Metadata> {
  // Access params safely
  const type = params.type
  const year = params.year

  // Get the instruction data
  const instruction = getInstructionByTypeAndYear(type, year)

  // Check if the data exists
  if (!instruction) {
    return {
      title: "Instructions Not Found",
    }
  }

  return {
    title: `${type === "group" ? "تعليمات المجموعة" : "تعليمات الفرع"} - ${year}`,
    description: instruction.description,
  }
}

// This is the main page component that runs on the server
export default function InstructionsPage({
  params,
}: {
  params: { type: string; year: string }
}) {
  // Get the data on the server
  const type = params.type
  const year = params.year

  // Get the instruction data
  const instruction = getInstructionByTypeAndYear(type, year)

  // Pass the params and instruction data to the client component
  return <InstructionsPageClient params={params} instructionData={instruction} />
}
