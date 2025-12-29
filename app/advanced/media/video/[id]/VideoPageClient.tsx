"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import Link from "next/link"
import type { Video } from "@/core/domain/models/media"
import { CommentSection } from "@/components/video/comments"
import AdvancedBreadcrumbs from "@/components/advanced-breadcrumbs"
import { useSimpleAdvancedBreadcrumbs } from "@/hooks/use-advanced-breadcrumbs"
import MainLayout from "@/components/layouts/main-layout"

interface VideoPageClientProps {
  video: Video
}

export default function VideoPageClient({ video }: VideoPageClientProps) {
  const { language, t } = useLanguage()

  // Breadcrumbs
  const { items: breadcrumbItems } = useSimpleAdvancedBreadcrumbs([
    { label: "Media", labelAr: "المكتبة", href: "/advanced#media" },
    { label: "Videos", labelAr: "الفيديوهات" },
  ])

  return (
    <MainLayout>
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-4xl">
        <AdvancedBreadcrumbs items={breadcrumbItems} />

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

          {/* Comments Section */}
          <div className="border-t pt-8">
            <CommentSection videoId={video.id} />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

