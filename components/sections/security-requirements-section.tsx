"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import SectionHeader from "@/components/ui/section-header"
import SectionContainer from "@/components/ui/section-container"
import { cn } from "@/lib/utils"
import SecurityInstructionsContent from "@/components/sections/security-instructions-content"
import SecurityProceduresContent from "@/components/sections/security-procedures-content"

export default function SecurityRequirementsSection() {
  const { t, language, isRtl } = useLanguage()
  const [activeTab, setActiveTab] = useState("instructions")

  // Listen for tab change events
  useEffect(() => {
    const handleTabChange = (event: Event) => {
      const customEvent = event as CustomEvent
      const { sectionId, tab } = customEvent.detail

      if (sectionId === "security-requirements" && tab) {
        setActiveTab(tab)
      }
    }

    window.addEventListener("tabchange", handleTabChange)
    return () => {
      window.removeEventListener("tabchange", handleTabChange)
    }
  }, [])

  return (
    <SectionContainer id="security-requirements">
      <SectionHeader
        title={t("section.securityRequirements")}
        subtitle={
          language === "ar"
            ? "متطلبات وإجراءات شاملة لتعزيز الأمن السيبراني وحماية البنية التحتية الرقمية"
            : "Comprehensive requirements and procedures to enhance cybersecurity and protect digital infrastructure"
        }
      />

      {/* Custom styled tabs */}
      <div className="w-full mb-8">
        <div className="flex justify-center">
          <div className="inline-flex rounded-lg bg-blue-50/50 dark:bg-blue-900/10 p-1 border border-blue-100/50 dark:border-blue-800/30 shadow-sm">
            <button
              onClick={() => setActiveTab("instructions")}
              className={cn(
                "px-6 py-3 text-sm font-medium rounded-md transition-all duration-200 min-w-[160px]",
                isRtl ? "ml-1" : "mr-1",
                activeTab === "instructions"
                  ? "bg-white dark:bg-gray-800 text-primary shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50",
              )}
            >
              {t("nav.instructions")}
            </button>
            <button
              onClick={() => setActiveTab("procedures")}
              className={cn(
                "px-6 py-3 text-sm font-medium rounded-md transition-all duration-200 min-w-[160px]",
                activeTab === "procedures"
                  ? "bg-white dark:bg-gray-800 text-primary shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50",
              )}
            >
              {t("nav.securityProcedures")}
            </button>
          </div>
        </div>
      </div>

      {/* Tab content with animations */}
      <div className="w-full">
        {activeTab === "instructions" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <SecurityInstructionsContent />
          </motion.div>
        )}

        {activeTab === "procedures" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <SecurityProceduresContent />
          </motion.div>
        )}
      </div>
    </SectionContainer>
  )
}
