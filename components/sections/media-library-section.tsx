"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import SectionHeader from "@/components/ui/section-header"
import SectionContainer from "@/components/ui/section-container"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mediaLibraryData } from "@/data/media-library-data"
import { Video, FileIcon as FilePresentation, FileText } from "lucide-react"
import Image from "next/image"

export default function MediaLibrarySection() {
  const { t } = useLanguage()

  return (
    <SectionContainer id="media">
      <SectionHeader title={t("section.media")} subtitle={t("media.subtitle")} />

      <Tabs defaultValue="videos" className="w-full">
        <TabsList className="w-full max-w-md mx-auto mb-8">
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
  const { language, t } = useLanguage()
  const [dialogOpen, setDialogOpen] = useState(false)

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

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <Card
          className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50 cursor-pointer"
          onClick={() => setDialogOpen(true)}
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
          <CardContent className="p-4">
            <h3 className="text-lg font-bold mb-2 line-clamp-2">{item.title[language]}</h3>
            <p className="text-muted-foreground text-sm line-clamp-3">{item.description[language]}</p>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{item.title[language]}</DialogTitle>
            <DialogDescription>{item.description[language]}</DialogDescription>
          </DialogHeader>

          {type === "video" && (
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={item.url}
                title={item.title[language]}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}

          {type === "lecture" && (
            <div className="prose dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: item.content[language] }} />
              {item.url && (
                <div className="mt-4 flex justify-end">
                  <Button onClick={() => window.open(item.url, "_blank")}>{t("common.download")}</Button>
                </div>
              )}
            </div>
          )}

          {type === "presentation" && (
            <div className="flex flex-col items-center">
              <Image
                src={item.thumbnailUrl || "/placeholder.svg"}
                alt={item.title[language]}
                width={600}
                height={400}
                className="object-contain rounded-md mb-4"
              />
              <Button onClick={() => window.open(item.url, "_blank")}>{t("common.download")}</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
