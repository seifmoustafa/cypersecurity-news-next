import type { Metadata } from "next"
import RegulationPageClient from "./RegulationPageClient"
import { notFound } from "next/navigation"
import { container } from "@/core/di/container"
import MainLayout from "@/components/layouts/main-layout"

interface RegulationPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: RegulationPageProps): Promise<Metadata> {
  const { slug } = params
  const regulation = await container.services.regulations.getRegulationBySlug(slug)

  if (!regulation) {
    return {
      title: "Regulation Not Found | Cybersecurity Center",
      description: "The requested regulation could not be found.",
    }
  }

  return {
    title: `${regulation.titleEn} | Cybersecurity Center`,
    description: regulation.summaryEn,
  }
}

export default async function RegulationPage({ params }: RegulationPageProps) {
  const { slug } = params
  const regulation = await container.services.regulations.getRegulationBySlug(slug)

  if (!regulation) {
    notFound()
  }

  return (
    <MainLayout>
      <RegulationPageClient regulationSlug={slug} />
    </MainLayout>
  )
}
