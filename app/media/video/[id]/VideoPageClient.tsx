"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Video } from "@/core/domain/models/media"

interface VideoPageClientProps {
  video: Video
}

export default function VideoPageClient({ video }: VideoPageClientProps) {
  const { language, t } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/#media">
          <Button variant="ghost" className="group flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            {t("common.back")}
          </Button>
        </Link>
      </div>

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 mb-4">
            {video.title[language]}
          </h1>
          <p className="text-lg text-muted-foreground mb-6">{video.description[language]}</p>
        </div>

        <div className="aspect-video rounded-lg overflow-hidden shadow-md">
          <iframe
            width="100%"
            height="100%"
            src={video.url}
            title={video.title[language]}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  )
}
