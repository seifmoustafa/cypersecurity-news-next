"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/language-provider";
import SectionHeader from "@/components/ui/section-header";
import SectionContainer from "@/components/ui/section-container";
import { cn } from "@/lib/utils";
import SecurityInstructionsContent from "@/components/sections/security-instructions-content";
import SecurityProceduresContent from "@/components/sections/security-procedures-content";
import { FileText, Shield, ChevronRight } from "lucide-react";

export default function SecurityRequirementsSection() {
  const { t, language, isRtl } = useLanguage();
  const [activeTab, setActiveTab] = useState("instructions");

  // Listen for tab change events
  useEffect(() => {
    const handleTabChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { sectionId, tab } = customEvent.detail;

      if (sectionId === "security-requirements" && tab) {
        setActiveTab(tab);
      }
    };

    window.addEventListener("tabchange", handleTabChange);
    return () => {
      window.removeEventListener("tabchange", handleTabChange);
    };
  }, []);

  return (
    <SectionContainer id="security-requirements" className="bg-gradient-to-br from-green-50/50 via-white to-emerald-50/30 dark:from-green-950/30 dark:via-slate-900 dark:to-emerald-950/20">
      <SectionHeader
        title={t("section.securityRequirements")}
        subtitle={
          language === "ar"
            ? "متطلبات وإجراءات شاملة لتعزيز الأمن السيبراني وحماية البنية التحتية الرقمية"
            : "Comprehensive requirements and procedures to enhance cybersecurity and protect digital infrastructure"
        }
      />

      {/* Enhanced Professional Tabs */}
      <div className="w-full mb-12">
        <div className="flex justify-center">
          <div className="inline-flex rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-2 border border-green-200/50 dark:border-green-800/50 shadow-lg shadow-green-500/10 dark:shadow-green-500/20">
            <button
              onClick={() => setActiveTab("instructions")}
              className={cn(
                "px-8 py-4 text-sm font-semibold rounded-xl transition-all duration-300 min-w-[180px] flex items-center justify-center gap-3 hover:scale-105",
                isRtl ? "ml-1" : "mr-1",
                activeTab === "instructions"
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/30 dark:shadow-green-500/40"
                  : "text-gray-600 dark:text-gray-300 hover:bg-green-50/50 dark:hover:bg-green-900/20"
              )}
            >
              <FileText className="h-5 w-5" />
              {t("nav.instructions")}
            </button>
            <button
              onClick={() => setActiveTab("procedures")}
              className={cn(
                "px-8 py-4 text-sm font-semibold rounded-xl transition-all duration-300 min-w-[180px] flex items-center justify-center gap-3 hover:scale-105",
                activeTab === "procedures"
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/30 dark:shadow-green-500/40"
                  : "text-gray-600 dark:text-gray-300 hover:bg-green-50/50 dark:hover:bg-green-900/20"
              )}
            >
              <Shield className="h-5 w-5" />
              {t("nav.securityProcedures")}
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Tab content with animations */}
      <div className="w-full">
        {activeTab === "instructions" && (
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRtl ? -20 : 20 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-emerald-500/5 rounded-2xl pointer-events-none"></div>
            <SecurityInstructionsContent />
          </motion.div>
        )}

        {activeTab === "procedures" && (
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRtl ? -20 : 20 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-green-500/5 rounded-2xl pointer-events-none"></div>
            <SecurityProceduresContent />
          </motion.div>
        )}
      </div>
    </SectionContainer>
  );
}
