import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { container } from "@/core/di/container"
import PersonalProtectControlPageClient from "./PersonalProtectControlPageClient"

interface PageProps {
  params: Promise<{
    categoryId: string
    subcategoryId: string
    controlId: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params
    const control = await container.services.personalProtect.getControlById(resolvedParams.controlId)

    if (!control) {
      return {
        title: "Personal Protection Control Not Found | Cybersecurity Portal",
        description: "The requested personal protection control could not be found.",
      }
    }

    const title = control.nameEn || control.name || ""
    const description = control.descriptionEn || control.description || ""

    return {
      title: `${title} | Personal Protection | Cybersecurity Portal`,
      description: description,
    }
  } catch (error) {
    return {
      title: "Personal Protection Control | Cybersecurity Portal",
      description: "Personal protection control details",
    }
  }
}

export default async function PersonalProtectControlPage({ params }: PageProps) {
  try {
    const resolvedParams = await params
    const control = await container.services.personalProtect.getControlById(resolvedParams.controlId)

    if (!control) {
      notFound()
    }

    return <PersonalProtectControlPageClient control={control} categoryId={resolvedParams.categoryId} subcategoryId={resolvedParams.subcategoryId} />
  } catch (error) {
    console.error("❌ Error in PersonalProtectControlPage:", error)
    notFound()
  }
}
