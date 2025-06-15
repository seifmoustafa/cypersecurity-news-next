import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { container } from "@/core/di/container"
import LecturePageClient from "./LecturePageClient"

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const lecture = await container.services.media.getLectureBySlug(params.slug)

    if (!lecture) {
      return {
        title: "Lecture Not Found | Cybersecurity Portal",
        description: "The requested lecture could not be found.",
      }
    }

    return {
      title: `${lecture.nameEn || lecture.nameAr} | Cybersecurity Portal`,
      description: lecture.summaryEn || lecture.summaryAr || "Cybersecurity lecture content",
    }
  } catch (error) {
    return {
      title: "Lecture Not Found | Cybersecurity Portal",
      description: "The requested lecture could not be found.",
    }
  }
}

export default async function LecturePage({ params }: PageProps) {
  try {
    const lecture = await container.services.media.getLectureBySlug(params.slug)

    if (!lecture) {
      notFound()
    }

    return <LecturePageClient lecture={lecture} />
  } catch (error) {
    console.error("❌ Error in LecturePage:", error)
    notFound()
  }
}
