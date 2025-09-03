"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, Settings } from "lucide-react"

export default function SecurityProceduresContent() {
  const { language, isRtl } = useLanguage()
  const [activeCategory, setActiveCategory] = useState("general")

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
                  {language === "ar" ? "الإجراءات العامة" : "General Procedures"}
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
                  {language === "ar" ? "إجراءات الحماية الشخصية" : "Personal Protect Procedures"}
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
                {language === "ar" ? "الإجراءات العامة" : "General Procedures"}
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {language === "ar"
                  ? "الإجراءات العامة للأمن السيبراني التي تنطبق على جميع المستخدمين والأنظمة"
                  : "General cybersecurity procedures that apply to all users and systems"}
              </p>
            </div>
            
            {/* Placeholder for General Procedures content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="h-48 border-dashed border-2 border-muted-foreground/30">
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Shield className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      {language === "ar" ? "سيتم إضافة المحتوى قريباً" : "Content will be added soon"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {activeCategory === "personal" && (
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRtl ? -20 : 20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">
                {language === "ar" ? "إجراءات الحماية الشخصية" : "Personal Protect Procedures"}
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {language === "ar"
                  ? "إجراءات الحماية الشخصية للأفراد والمستخدمين لحماية بياناتهم ومعلوماتهم"
                  : "Personal protection procedures for individuals and users to protect their data and information"}
              </p>
            </div>
            
            {/* Placeholder for Personal Protect Procedures content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="h-48 border-dashed border-2 border-muted-foreground/30">
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Shield className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      {language === "ar" ? "سيتم إضافة المحتوى قريباً" : "Content will be added soon"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
