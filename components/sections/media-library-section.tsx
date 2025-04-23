"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import SectionHeader from "@/components/ui/section-header"
import SectionContainer from "@/components/ui/section-container"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mediaLibraryData } from "@/data/media-library-data"
import { Video, FileIcon as FilePresentation, FileText } from "lucide-react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"

export default function MediaLibrarySection() {
  const { t, language, isRtl } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("videos")

  // Check URL for tab parameter on mount
  useEffect(() => {
    const tabParam = searchParams?.get("tab")
    if (tabParam && ["videos", "lectures", "presentations"].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  // Listen for tab change events
  useEffect(() => {
    const handleTabChange = (event: Event) => {
      const customEvent = event as CustomEvent
      const { sectionId, tab } = customEvent.detail

      if (sectionId === "media" && tab) {
        setActiveTab(tab)
      }
    }

    window.addEventListener("tabchange", handleTabChange)
    return () => {
      window.removeEventListener("tabchange", handleTabChange)
    }
  }, [])

  // Prefetch media pages
  useEffect(() => {
    mediaLibraryData.videos.forEach((video) => {
      router.prefetch(`/media/video/${video.id}`)
    })

    mediaLibraryData.lectures.forEach((lecture) => {
      router.prefetch(`/media/lecture/${lecture.id}`)
    })

    mediaLibraryData.presentations.forEach((presentation) => {
      router.prefetch(`/media/presentation/${presentation.id}`)
    })
  }, [router])

  return (
    <SectionContainer id="media">
      <SectionHeader title={t("section.media")} subtitle={t("media.subtitle")} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`w-full max-w-md mx-auto mb-8 ${isRtl ? "flex-row-reverse" : ""}`}>
          <TabsTrigger value="videos" className="flex-1">
            {t("media.videos")}
          </TabsTrigger>
          <TabsTrigger value="lectures" className="flex-1">
            {t("media.lectures")}
          </TabsTrigger>
          <TabsTrigger value="presentations" className="flex-1">
            {t("media.presentations")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediaLibraryData.videos.map((item, index) => (
              <MediaCard key={item.id} item={item} index={index} type="video" />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="lectures" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediaLibraryData.lectures.map((item, index) => (
              <MediaCard key={item.id} item={item} index={index} type="lecture" />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="presentations" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediaLibraryData.presentations.map((item, index) => (
              <MediaCard key={item.id} item={item} index={index} type="presentation" />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </SectionContainer>
  )
}

interface MediaCardProps {
  item:
    | (typeof mediaLibraryData.videos)[0]
    | (typeof mediaLibraryData.lectures)[0]
    | (typeof mediaLibraryData.presentations)[0]
  index: number
  type: "video" | "lecture" | "presentation"
}

function MediaCard({ item, index, type }: MediaCardProps) {
  const { language, isRtl } = useLanguage()
  const router = useRouter()

  const getIcon = () => {
    switch (type) {
      case "video":
        return <Video className="h-10 w-10 text-primary" />
      case "lecture":
        return <FileText className="h-10 w-10 text-primary" />
      case "presentation":
        return <FilePresentation className="h-10 w-10 text-primary" />
    }
  }

  const handleCardClick = () => {
    router.push(`/media/${type}/${item.id}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card
        className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50 cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="relative h-48">
          <Image
            src={item.thumbnailUrl || "/placeholder.svg"}
            alt={item.title[language]}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">{getIcon()}</div>
        </div>
        <CardContent className={`p-4 ${isRtl ? "text-right" : "text-left"}`}>
          <h3 className="text-lg font-bold mb-2 line-clamp-2">{item.title[language]}</h3>
          <p className="text-muted-foreground text-sm line-clamp-3">{item.description[language]}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
