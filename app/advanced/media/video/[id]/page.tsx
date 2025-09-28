import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { container } from "@/core/di/container"
import VideoPageClient from "./VideoPageClient"

interface VideoPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: VideoPageProps): Promise<Metadata> {
  try {
    const video = await container.services.media.getApiVideoById(params.id)

    if (!video) {
      return {
        title: "Video Not Found | Cybersecurity Portal",
        description: "The requested video could not be found.",
      }
    }

    return {
      title: `${video.nameEn || video.nameAr} | Cybersecurity Portal`,
      description: video.summaryEn || video.summaryAr || "Cybersecurity video content",
    }
  } catch (error) {
    return {
      title: "Video Not Found | Cybersecurity Portal",
      description: "The requested video could not be found.",
    }
  }
}

export default async function VideoPage({ params }: VideoPageProps) {
  try {
    const video = await container.services.media.getApiVideoById(params.id)

    if (!video) {
      notFound()
    }

    return <VideoPageClient video={video} />
  } catch (error) {
    console.error("❌ Error in VideoPage:", error)
    notFound()
  }
}
