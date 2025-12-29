import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { container } from "@/core/di/container"
import ProcedurePageClient from "./ProcedurePageClient"

interface PageProps {
  params: Promise<{
    procedureId: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params
    const procedure = await container.services.procedures.getProcedureById(resolvedParams.procedureId)

    if (!procedure) {
      return {
        title: "Procedure Not Found | Cybersecurity Portal",
        description: "The requested procedure could not be found.",
      }
    }

    const title = procedure.nameEn || procedure.nameAr || ""
    const description = procedure.descriptionEn || procedure.descriptionAr || ""

    return {
      title: `${title} | Cybersecurity Portal`,
      description: description,
    }
  } catch (error) {
    return {
      title: "Procedure | Cybersecurity Portal",
      description: "Procedure details",
    }
  }
}

export default async function ProcedurePage({ params }: PageProps) {
  try {
    const resolvedParams = await params
    const procedure = await container.services.procedures.getProcedureById(resolvedParams.procedureId)

    if (!procedure) {
      notFound()
    }

    return <ProcedurePageClient procedure={procedure} />
  } catch (error) {
    console.error("❌ Error in ProcedurePage:", error)
    notFound()
  }
}
