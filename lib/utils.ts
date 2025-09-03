import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Language } from "@/lib/i18n"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLocalizedText(
  language: Language,
  ar?: string | null,
  en?: string | null
): string {
  return language === "ar" ? ar || en || "" : en || ar || ""
}

export function slugify(text: string | null | undefined, fallback?: string): string {
  if (!text || text.trim() === "") {
    return fallback || ""
  }

  const slug =
    text
      .toString()
      .normalize("NFD") // Normalize Unicode
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .toLowerCase()
      .trim()
      // Replace Arabic/Unicode characters with transliteration or remove them
      .replace(/[^\w\s-]/g, "") // Remove special characters except word chars, spaces, hyphens
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/--+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
      .substring(0, 50)

  return slug || fallback || ""
}

// Alternative slugify for Arabic - creates ID-based slugs
export function createNewsSlug(news: any, language: string): string {
  const title = language === "ar" ? news.title || news.titleEn : news.titleEn || news.title

  const slugifiedTitle = slugify(title, news.id || "news-item")

  if (slugifiedTitle.length < 3) {
    // If slug is too short (Arabic text didn't convert well), use ID-based slug
    return news.id || "news-item"
  }

  return slugifiedTitle
}

/**
 * Purifies HTML content by removing HTML tags and returning clean text
 * @param html - The HTML string to purify
 * @returns Clean text without HTML tags
 */
export function purifyHtml(html: string | null | undefined): string {
  if (!html) return ""
  return html.replace(/<\/?[^>]+(>|$)/g, "").trim()
}

/**
 * Checks if purified HTML content is valid (not empty and not just "string")
 * @param html - The HTML string to check
 * @returns True if the content is valid
 */
export function isValidHtmlContent(html: string | null | undefined): boolean {
  const purified = purifyHtml(html)
  return purified && purified !== "string" && purified.length > 0
}
