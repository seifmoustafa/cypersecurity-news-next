import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { container } from "@/core/di/container"
import { getLocalizedText } from "@/lib/utils"
import LectureCategoryPageClient from "./LectureCategoryPageClient"
import type { LectureCategory, LecturesPaginatedResponse } from "@/core/domain/models/media"
import { use } from "react"

interface PageProps {
  params: Promise<{
    categoryId: string
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Server-side function to fetch initial data
async function getInitialData(categoryId: string, search = "", page = 1) {
  try {
    // Fetch lectures for the category
    const lecturesResponse: LecturesPaginatedResponse = await container.services.media.getLecturesByCategoryForProfessionals(
      categoryId,
      page,
      12,
      search
    )
    
    // Fetch category info
    const categoriesResponse = await container.services.media.getLectureCategoriesForProfessionals(1, 100)
    const category = categoriesResponse.data.find((cat: LectureCategory) => cat.id === categoryId)
    
    return {
      lectures: lecturesResponse,
      category: category || null
    }
  } catch (error) {
    console.error("Error fetching initial data:", error)
    return {
      lectures: {
        data: [],
        pagination: {
          itemsCount: 0,
          pagesCount: 0,
          pageSize: 12,
          currentPage: 1,
        },
      },
      category: null
    }
  }
}

export async function generateMetadata({ params }: { params: Promise<{ categoryId: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const { category } = await getInitialData(resolvedParams.categoryId)
  
  if (!category) {
    return {
      title: "Category Not Found",
      description: "The requested lecture category could not be found.",
    }
  }

  const categoryName = getLocalizedText("en", category.name, category.nameEn)
  
  return {
    title: `${categoryName} Lectures | Cybersecurity Portal`,
    description: `Browse cybersecurity lectures in the ${categoryName} category.`,
  }
}

export default async function LectureCategoryPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const search = typeof resolvedSearchParams.search === "string" ? resolvedSearchParams.search : ""
  const page = typeof resolvedSearchParams.page === "string" ? Number.parseInt(resolvedSearchParams.page) : 1

  const { lectures, category } = await getInitialData(resolvedParams.categoryId, search, page)

  if (!category) {
    notFound()
  }

  return <LectureCategoryPageClient 
    initialLectures={lectures} 
    initialSearch={search} 
    initialPage={page} 
    category={category} 
  />
}