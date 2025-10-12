import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { container } from "@/core/di/container"
import LecturePageClient from "./LecturePageClient"
import { use } from "react"

interface PageProps {
  params: Promise<{ 
    categoryId: string
    lectureId: string
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: { params: Promise<{ categoryId: string, lectureId: string }> }): Promise<Metadata> {
  try {
    const resolvedParams = await params
    const lecture = await container.services.media.getApiLectureById(resolvedParams.lectureId)

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

export default async function LecturePage({ params, searchParams }: PageProps) {
  try {
    // Resolve the params Promise
    const resolvedParams = await params
    const lecture = await container.services.media.getApiLectureById(resolvedParams.lectureId)
    
    // We already have the categoryId from the route params
    const categoryId = resolvedParams.categoryId

    if (!lecture) {
      notFound()
    }

    return <LecturePageClient lecture={lecture} categoryId={categoryId} />
  } catch (error) {
    console.error("❌ Error in LecturePage:", error)
    notFound()
  }
}