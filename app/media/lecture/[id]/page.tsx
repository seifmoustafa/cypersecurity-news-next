import { mediaLibraryData } from "@/data/media-library-data"
import type { Metadata } from "next"
import LecturePageClient from "./LecturePageClient"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const lecture = mediaLibraryData.lectures.find(
    (item) => item.id.toString() === params.id
  )

  if (!lecture) {
    return {
      title: "Lecture Not Found",
    }
  }

  return {
    title: `${lecture.title.ar} | ${lecture.title.en}`,
    description: lecture.description.ar,
  }
}

export async function generateStaticParams() {
  return mediaLibraryData.lectures.map((item) => ({
    id: item.id.toString(),
  }))
}

export default function LecturePage({
  params,
}: {
  params: { id: string }
}) {
  return <LecturePageClient id={params.id} />
}
