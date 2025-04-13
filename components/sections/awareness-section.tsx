"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/language-provider";
import SectionHeader from "@/components/ui/section-header";
import SectionContainer from "@/components/ui/section-container";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { awarenessData } from "@/data/awareness-data";
import Image from "next/image";

export default function AwarenessSection() {
  const { t } = useLanguage();

  return (
    <SectionContainer id="awareness" className="bg-muted/30">
      <SectionHeader
        title={t("section.awareness")}
        subtitle={t("awareness.subtitle")}
      />

      <Tabs defaultValue="bulletins" className="w-full">
        <TabsList className="w-full max-w-md mx-auto mb-8">
          <TabsTrigger value="bulletins" className="flex-1">
            {t("awareness.bulletins")}
          </TabsTrigger>
          <TabsTrigger value="articles" className="flex-1">
            {t("awareness.articles")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bulletins" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {awarenessData.bulletins.map((item, index) => (
              <AwarenessCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="articles" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {awarenessData.articles.map((item, index) => (
              <AwarenessCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </SectionContainer>
  );
}

interface AwarenessCardProps {
  item: (typeof awarenessData.bulletins)[0] | (typeof awarenessData.articles)[0];
  index: number;
}

function AwarenessCard({ item, index }: AwarenessCardProps) {
  const { language } = useLanguage();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Format the date consistently between server and client by:
  // - Forcing the Gregorian calendar and a fixed time zone.
  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      timeZone: 'UTC',
    };
    // The Unicode extension "u-ca-gregory" forces the Gregorian calendar.
    const locale = language === 'ar' ? 'ar-SA-u-ca-gregory' : 'en-US';
    return new Intl.DateTimeFormat(locale, options).format(dateObj);
  };

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
              src={item.imageUrl || "/placeholder.svg"}
              alt={item.title[language]}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded">
              {formatDate(item.date)}
            </div>
          </div>
          <CardContent className="p-4">
            <h3 className="text-lg font-bold mb-2 line-clamp-2">
              {item.title[language]}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-3">
              {item.summary[language]}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{item.title[language]}</DialogTitle>
            <DialogDescription>
              {formatDate(item.date)}
            </DialogDescription>
          </DialogHeader>

          <div className="relative w-full h-64 my-4 rounded-md overflow-hidden">
            <Image
              src={item.imageUrl || "/placeholder.svg"}
              alt={item.title[language]}
              fill
              className="object-cover"
            />
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: item.content[language] }} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
