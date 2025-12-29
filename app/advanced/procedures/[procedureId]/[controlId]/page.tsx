import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { container } from "@/core/di/container"
import ControlPageClient from "./ControlPageClient"

interface PageProps {
  params: Promise<{
    procedureId: string
    controlId: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params
    const control = await container.services.procedures.getControlById(resolvedParams.controlId)

    if (!control) {
      return {
        title: "Control Not Found | Cybersecurity Portal",
        description: "The requested control could not be found.",
      }
    }

    const title = control.nameEn || control.nameAr || ""
    const description = control.descriptionEn || control.descriptionAr || ""

    return {
      title: `${title} | Cybersecurity Portal`,
      description: description,
    }
  } catch (error) {
    return {
      title: "Control | Cybersecurity Portal",
      description: "Control details",
    }
  }
}

export default async function ControlPage({ params }: PageProps) {
  try {
    const resolvedParams = await params
    const control = await container.services.procedures.getControlById(resolvedParams.controlId)

    if (!control) {
      notFound()
    }

    return <ControlPageClient control={control} procedureId={resolvedParams.procedureId} />
  } catch (error) {
    console.error("❌ Error in ControlPage:", error)
    notFound()
  }
}
