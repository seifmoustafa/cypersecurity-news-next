import type React from "react";
import { cairo, roboto } from "@/lib/fonts";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import ErrorBoundary from "@/components/error-boundary";
import LoadingScreen from "@/components/loading-screen";
import { Suspense } from "react";
import SimpleLayout from "@/components/layouts/simple-layout";

// Add a cache control header to improve caching
export const metadata = {
  title: "بوابة الأمن السيبراني  | Cybersecurity Portal",
  description:
    "منصة مبسطة للأمن السيبراني تقدم المعرفة الأساسية والأدوات البسيطة ",
};

// Add this function to improve page loading performance
export const dynamic = "force-dynamic";

export default function BeginnersRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${roboto.variable}`} suppressHydrationWarning>
      <head>
        <title>بوابة الأمن السيبراني  | Cybersecurity Portal for Beginners</title>
        <meta
          name="description"
          content="منصة مبسطة للأمن السيبراني تقدم المعرفة الأساسية والأدوات البسيطة "
        />
      </head>
      <body className="rtl">
        <LanguageProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <ErrorBoundary>
              <Suspense fallback={<LoadingScreen />}>
                <SimpleLayout>
                  {children}
                </SimpleLayout>
              </Suspense>
            </ErrorBoundary>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
