"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, Settings, FileText } from "lucide-react"
import Link from "next/link"
import { slugify, getLocalizedText } from "@/lib/utils"
import { useProcedures } from "@/core/hooks/use-procedures"
import PersonalProtectProceduresContent from "./personal-protect-procedures-content"

export default function SecurityProceduresContent() {
  const { language, isRtl } = useLanguage()
  const [activeCategory, setActiveCategory] = useState("general")
  const { procedures, loading, error } = useProcedures(1, 3) // Get first 3 procedures for preview

  const tabIcons = {
    general: <Settings className="h-5 w-5" />,
    personal: <Users className="h-5 w-5" />,
  }

  return (
    <div className="w-full">
      {/* Custom styled tabs for procedures categories */}
      <div className="w-full mb-8">
        <div className="flex justify-center">
          <div className="inline-flex rounded-lg bg-blue-50/50 dark:bg-blue-900/10 p-1 border border-blue-100/50 dark:border-blue-800/30 shadow-sm">
            <button
              onClick={() => setActiveCategory("general")}
              className={cn(
                "px-6 py-3 text-sm font-medium rounded-md transition-all duration-200 min-w-[180px]",
                isRtl ? "ml-1" : "mr-1",
                activeCategory === "general"
                  ? "bg-white dark:bg-gray-800 text-primary shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50"
              )}
            >
              <span className={`flex items-center gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
                {tabIcons.general}
                <span>
                  {language === "ar" ? "تأمين البنية التحتية المعلوماتية لجهات ق.م" : "General Procedures"}
                </span>
              </span>
            </button>
            <button
              onClick={() => setActiveCategory("personal")}
              className={cn(
                "px-6 py-3 text-sm font-medium rounded-md transition-all duration-200 min-w-[180px]",
                activeCategory === "personal"
                  ? "bg-white dark:bg-gray-800 text-primary shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50"
              )}
            >
              <span className={`flex items-center gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
                {tabIcons.personal}
                <span>
                  {language === "ar" ? "الحماية الشخصية" : "Personal Protect Procedures"}
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab content with animations */}
      <div className="w-full">
        {activeCategory === "general" && (
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRtl ? -20 : 20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">
                {language === "ar" ? "تأمين البنية التحتية المعلوماتية لجهات ق.م" : "General Procedures"}
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {language === "ar"
                  ? "تأمين البنية التحتية المعلوماتية لجهات ق.م التي تنطبق على جميع المستخدمين والأنظمة"
                  : "General cybersecurity procedures that apply to all users and systems"}
              </p>
            </div>
            
            {/* General Procedures content */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, index) => (
                  <Card key={index} className="h-48">
                    <CardContent className="p-6">
                      <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-muted rounded w-1/3"></div>
                        <div className="h-5 bg-muted rounded w-2/3"></div>
                        <div className="h-3 bg-muted rounded w-full"></div>
                        <div className="h-3 bg-muted rounded w-3/4"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  {language === "ar" ? "حدث خطأ في تحميل الإجراءات" : "Error loading procedures"}
                </h3>
                <p className="text-muted-foreground">{error}</p>
              </div>
            ) : procedures.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  {language === "ar" ? "لا توجد إجراءات متاحة" : "No procedures available"}
                </h3>
                <p className="text-muted-foreground">
                  {language === "ar" ? "لم يتم العثور على أي إجراءات في الوقت الحالي" : "No procedures found at the moment"}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {procedures.map((procedure, index) => {
                    const procedureSlug = slugify(procedure.nameEn || procedure.nameAr || "", procedure.id)
                    const title = getLocalizedText(language, procedure.nameAr, procedure.nameEn)
                    const description = getLocalizedText(language, procedure.descriptionAr, procedure.descriptionEn)

                    return (
                      <Link href={`/procedures/${procedureSlug}`} key={procedure.id}>
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                            <CardHeader className="pb-2">
                              <CardTitle className={`text-xl ${isRtl ? "text-right" : "text-left"}`}>
                                {title}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className={isRtl ? "text-right" : "text-left"}>
                              <p className="text-muted-foreground line-clamp-4">
                                {description || (language === "ar" ? "لا يوجد وصف متاح" : "No description available")}
                              </p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Link>
                    )
                  })}
                </div>
                <div className="mt-8 text-center">
                  <Link
                    href="/procedures"
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                  >
                    {language === "ar" ? "عرض جميع الإجراءات" : "View All Procedures"}
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        )}

        {activeCategory === "personal" && (
          <PersonalProtectProceduresContent />
        )}
      </div>
    </div>
  )
}
