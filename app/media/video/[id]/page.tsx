import type { Metadata } from "next"
import { container } from "@/core/di/container"
import VideoPageClient from "./VideoPageClient"

interface VideoPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: VideoPageProps): Promise<Metadata> {
  const video = await container.services.media.getVideoById(params.id)

  return {
    title: `${video.title.en} | Cybersecurity Center`,
    description: video.description.en,
  }
}

export default async function VideoPage({ params }: VideoPageProps) {
  const video = await container.services.media.getVideoById(params.id)

  return <VideoPageClient video={video} />
}
