import arTranslations from "@/locales/ar.json"
import enTranslations from "@/locales/en.json"

export type Language = "ar" | "en"

export const translations = {
  ar: arTranslations,
  en: enTranslations,
}

export type TranslationKey = string

export function getTranslation(language: Language, key: TranslationKey): string {
  const keys = key.split(".")
  let value: any = translations[language]

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k]
    } else {
      return key // Return the key if translation not found
    }
  }

  return typeof value === "string" ? value : key
}

export function getDirection(language: Language): "rtl" | "ltr" {
  return language === "ar" ? "rtl" : "ltr"
}
