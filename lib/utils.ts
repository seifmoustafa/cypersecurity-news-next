import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  if (!text || text.trim() === "") {
    return ""
  }

  return (
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
  ) // Limit length
}

// Alternative slugify for Arabic - creates ID-based slugs
export function createNewsSlug(news: any, language: string): string {
  const title = language === "ar" ? news.title || news.titleEn : news.titleEn || news.title

  if (!title || title.trim() === "") {
    return news.id || "news-item"
  }

  // For Arabic text or if slugify fails, use ID + partial title
  const slugifiedTitle = slugify(title)

  if (slugifiedTitle.length < 3) {
    // If slug is too short (Arabic text didn't convert well), use ID-based slug
    return `${news.id.substring(0, 8)}-${Date.now()}`
  }

  return slugifiedTitle
}
