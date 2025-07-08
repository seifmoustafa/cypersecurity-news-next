import type React from "react"
import localFont from "next/font/local"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/components/language-provider"
import ErrorBoundary from "@/components/error-boundary"
import LoadingScreen from "@/components/loading-screen"
import { Suspense } from "react"

// Add a cache control header to improve caching
export const metadata = {
  title: "بوابة الأمن السيبراني | Cybersecurity Portal",
  description: "أحدث المستجدات والتحليلات حول التهديدات السيبرانية وتقنيات الحماية",
    generator: 'v0.dev'
}

// Add this function to improve page loading performance
export const dynamic = "force-dynamic"

const cairo = localFont({
  src: [
    { path: "../public/fonts/Cairo-300.woff2", weight: "300", style: "normal" },
    { path: "../public/fonts/Cairo-400.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/Cairo-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-cairo",
  display: "swap",
})

const roboto = localFont({
  src: [
    { path: "../public/fonts/Roboto-300.woff2", weight: "300", style: "normal" },
    { path: "../public/fonts/Roboto-300-italic.woff2", weight: "300", style: "italic" },
    { path: "../public/fonts/Roboto-400.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/Roboto-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../public/fonts/Roboto-700.woff2", weight: "700", style: "normal" },
    { path: "../public/fonts/Roboto-700-italic.woff2", weight: "700", style: "italic" },
  ],
  variable: "--font-roboto",
  display: "swap",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <head>
        <title>بوابة الأمن السيبراني | Cybersecurity Portal</title>
        <meta name="description" content="أحدث المستجدات والتحليلات حول التهديدات السيبرانية وتقنيات الحماية" />
      </head>
      <body className={`${cairo.variable} ${roboto.variable}`}>
        <LanguageProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <ErrorBoundary>
              <Suspense fallback={<LoadingScreen />}>
                {children}
              </Suspense>
            </ErrorBoundary>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
