"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"

type Language = "ar" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Translation data
const translations = {
  ar: {
    // Navigation
    "nav.systems": "منظومات",
    "nav.strategy": "إستراتيجية الأمن السيبراني",
    "nav.regulations": "اللائحة التنفيذية للأمن السيبراني",
    "nav.instructions": "تعليمات التأمين",
    "nav.awareness": "نشرات التوعية",
    "nav.news": "أخبار",
    "nav.videos": "فيديوهات",
    "nav.vulnerabilities": "قاعدة بيانات الثغرات",
    "nav.definitions": "تعريفات",
    "nav.framework": "اطار عمل الأمن السيبراني",
    "nav.standards": "المعايير القياسية",
    "nav.procedures": "إجراءات التأمين",

    // Sections
    "section.systems": "منظومات",
    "section.regulation": "تنظيم الأمن السيبراني",
    "section.awareness": "نشر الوعي",
    "section.instructions": "تعليمات التأمين",
    "section.standards": "المعايير القياسية",
    "section.media": "مكتبة الوثائق المتعددة",

    // Systems
    "systems.operations": "عمليات الأمن السيبراني",
    "systems.support": "دعم متخذ القرار",
    "systems.vulnerabilities": "الثغرات",
    "systems.subtitle": "أنظمة متكاملة لإدارة ومراقبة الأمن السيبراني",
    "systems.visitSystem": "زيارة النظام",

    // Regulation
    "regulation.council": "المجلس الأعلي للأمن السيبراني",
    "regulation.strategy": "الإسترتيجية",
    "regulation.executive": "اللائحة التنفيذية",
    "regulation.subtitle": "الإطار التنظيمي والتشريعي للأمن السيبراني",

    // Awareness
    "awareness.bulletins": "نشرات التوعية",
    "awareness.articles": "المقالات",
    "awareness.subtitle": "مواد توعوية لتعزيز ثقافة الأمن السيبراني",

    // Instructions
    "instructions.group": "مجموعة ٩٩",
    "instructions.branch": "فرع حرب المعلومات",
    "instructions.subtitle": "إرشادات وتعليمات لتعزيز الأمن السيبراني",

    // Standards
    "standards.international": "الدولية",
    "standards.local": "محلية",
    "standards.internal": "داخلية",
    "standards.subtitle": "المعايير والضوابط المعتمدة في مجال الأمن السيبراني",

    // Media
    "media.videos": "الفيديوهات",
    "media.lectures": "المحاضرات",
    "media.presentations": "العروض التقديمية",
    "media.subtitle": "مكتبة متكاملة من الوسائط المتعددة حول الأمن السيبراني",

    // Common
    "common.readMore": "قراءة المزيد",
    "common.close": "إغلاق",
    "common.download": "تحميل",
    "common.view": "عرض",
    "common.language": "English",
    "common.darkMode": "الوضع الداكن",
    "common.lightMode": "الوضع الفاتح",
    "common.tipOfTheDay": "نصيحة اليوم",
    "common.understood": "فهمت",
    "common.exploreMore": "استكشف المزيد",

    // Hero
    "hero.title": "الأمن السيبراني",
    "hero.subtitle": "أحدث المستجدات والتحليلات حول التهديدات السيبرانية وتقنيات الحماية",
  },
  en: {
    // Navigation
    "nav.systems": "Systems",
    "nav.strategy": "Cybersecurity Strategy",
    "nav.regulations": "Cybersecurity Executive Regulations",
    "nav.instructions": "Security Instructions",
    "nav.awareness": "Awareness Bulletins",
    "nav.news": "News",
    "nav.videos": "Videos",
    "nav.vulnerabilities": "Vulnerabilities Database",
    "nav.definitions": "Definitions",
    "nav.framework": "Cybersecurity Framework",
    "nav.standards": "Standards",
    "nav.procedures": "Security Procedures",

    // Sections
    "section.systems": "Systems",
    "section.regulation": "Cybersecurity Regulation",
    "section.awareness": "Awareness",
    "section.instructions": "Security Instructions",
    "section.standards": "Standards",
    "section.media": "Media Library",

    // Systems
    "systems.operations": "Cybersecurity Operations",
    "systems.support": "Decision-Making Support",
    "systems.vulnerabilities": "Vulnerabilities",
    "systems.subtitle": "Integrated systems for cybersecurity management and monitoring",
    "systems.visitSystem": "Visit System",

    // Regulation
    "regulation.council": "Council",
    "regulation.strategy": "Strategy",
    "regulation.executive": "Executive Regulations",
    "regulation.subtitle": "Regulatory and legislative framework for cybersecurity",

    // Awareness
    "awareness.bulletins": "Awareness Bulletins",
    "awareness.articles": "Articles",
    "awareness.subtitle": "Awareness materials to promote cybersecurity culture",

    // Instructions
    "instructions.group": "Group 99",
    "instructions.branch": "Information Warfare Branch",
    "instructions.subtitle": "Guidelines and instructions to enhance cybersecurity",

    // Standards
    "standards.international": "International",
    "standards.local": "Local",
    "standards.internal": "Internal",
    "standards.subtitle": "Approved standards and controls in the field of cybersecurity",

    // Media
    "media.videos": "Videos",
    "media.lectures": "Lectures",
    "media.presentations": "Presentations",
    "media.subtitle": "Integrated library of multimedia about cybersecurity",

    // Common
    "common.readMore": "Read More",
    "common.close": "Close",
    "common.download": "Download",
    "common.view": "View",
    "common.language": "العربية",
    "common.darkMode": "Dark Mode",
    "common.lightMode": "Light Mode",
    "common.tipOfTheDay": "Tip of the Day",
    "common.understood": "Got it",
    "common.exploreMore": "Explore More",

    // Hero
    "hero.title": "Cybersecurity",
    "hero.subtitle": "Latest updates and analysis on cybersecurity threats and protection techniques",
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("ar")

  // Update document direction based on language
  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = language

    // Add a class to the body for language-specific styling
    document.body.classList.toggle("rtl", language === "ar")
    document.body.classList.toggle("ltr", language === "en")

    // Update font family based on language
    if (language === "ar") {
      document.body.style.fontFamily = "var(--font-tajawal), sans-serif"
    } else {
      document.body.style.fontFamily = "var(--font-roboto), sans-serif"
    }
  }, [language])

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
