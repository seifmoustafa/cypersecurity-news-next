import type React from "react"
import { cairo, roboto } from "@/lib/fonts"
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
