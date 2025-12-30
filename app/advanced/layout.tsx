import type React from "react";
import { cairo, roboto } from "@/lib/fonts";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import ErrorBoundary from "@/components/error-boundary";
import LoadingScreen from "@/components/loading-screen";
import { Suspense } from "react";
import MainLayout from "@/components/layouts/main-layout";

// Metadata for Professionals Portal
export const metadata = {
      title: "بوابة الأمن السيبراني للمحترفين | Cybersecurity Portal for Professionals",
      description:
            "موارد متقدمة للمحترفين في مجال الأمن السيبراني - Advanced cybersecurity resources for professionals",
      icons: {
            icon: '/assets/app-icon',
            shortcut: '/assets/app-icon',
            apple: '/assets/app-icon',
      },
};

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default function AdvancedRootLayout({
      children,
}: Readonly<{
      children: React.ReactNode;
}>) {
      return (
            <html lang="ar" dir="rtl" suppressHydrationWarning>
                  <head>
                        <title>بوابة الأمن السيبراني للمحترفين | Cybersecurity Portal for Professionals</title>
                        <meta
                              name="description"
                              content="موارد متقدمة للمحترفين في مجال الأمن السيبراني"
                        />
                        <script
                              dangerouslySetInnerHTML={{
                                    __html: `
              (function() {
                try {
                  var storageKey = 'theme-preference';
                  var stored = localStorage.getItem(storageKey);
                  var isDark = stored ? stored === 'dark' : true;
                  var root = document.documentElement;
                  if (isDark) {
                    root.classList.add('dark');
                  } else {
                    root.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
                              }}
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
                                                <MainLayout>
                                                      {children}
                                                </MainLayout>
                                          </Suspense>
                                    </ErrorBoundary>
                              </ThemeProvider>
                        </LanguageProvider>
                  </body>
            </html>
      );
}
