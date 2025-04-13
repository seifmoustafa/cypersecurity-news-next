import type React from "react"
import type { Metadata } from "next"
import { Tajawal, Roboto } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/components/language-provider"

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-tajawal",
})

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
})

export const metadata: Metadata = {
  title: "مركز الأمن السيبراني | Cybersecurity Center",
  description: "أحدث المستجدات والتحليلات حول التهديدات السيبرانية وتقنيات الحماية",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <body className={`${tajawal.variable} ${roboto.variable}`}>
        <LanguageProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}


import './globals.css'