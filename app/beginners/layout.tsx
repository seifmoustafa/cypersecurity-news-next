import type React from "react";
import { cairo, roboto } from "@/lib/fonts";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import ErrorBoundary from "@/components/error-boundary";
import LoadingScreen from "@/components/loading-screen";
import { Suspense } from "react";
import BeginnersLayout from "@/components/layouts/beginners-layout";

// Add a cache control header to improve caching
export const metadata = {
  title: "بوابة الأمن السيبراني للمبتدئين | Cybersecurity Portal for Beginners",
  description:
    "منصة مبسطة للأمن السيبراني تقدم المعرفة الأساسية والأدوات البسيطة للمبتدئين",
};

// Add this function to improve page loading performance
export const dynamic = "force-dynamic";

export default function BeginnersRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <head>
        <title>بوابة الأمن السيبراني للمبتدئين | Cybersecurity Portal for Beginners</title>
        <meta
          name="description"
          content="منصة مبسطة للأمن السيبراني تقدم المعرفة الأساسية والأدوات البسيطة للمبتدئين"
        />
      </head>
      <body className={`${cairo.variable} ${roboto.variable}`}>
        <LanguageProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <ErrorBoundary>
              <Suspense fallback={<LoadingScreen />}>
                <BeginnersLayout>
                  {children}
                </BeginnersLayout>
              </Suspense>
            </ErrorBoundary>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
