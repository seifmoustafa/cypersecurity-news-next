import type React from "react";
import { cairo, roboto } from "@/lib/fonts";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import { ClientAuthProvider } from "@/contexts/client-auth-context";
import ErrorBoundary from "@/components/error-boundary";
import LoadingScreen from "@/components/loading-screen";
import { Suspense } from "react";

export const metadata = {
  title: "بوابة الأمن السيبراني | Cybersecurity Portal",
  description:
    "أحدث المستجدات والتحليلات حول التهديدات السيبرانية وتقنيات الحماية",
  icons: {
    icon: '/assets/app-icon',
    shortcut: '/assets/app-icon',
    apple: '/assets/app-icon',
  },
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <title>بوابة الأمن السيبراني | Cybersecurity Portal</title>
        <meta
          name="description"
          content="أحدث المستجدات والتحليلات حول التهديدات السيبرانية وتقنيات الحماية"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storageKey = 'theme-preference';
                  var stored = localStorage.getItem(storageKey);
                  var isDark = stored ? stored === 'dark' : true; // Default to dark
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
      <body
        className={`${cairo.variable} ${roboto.variable} font-cairo`}
        style={{ fontFamily: "var(--font-cairo), var(--font-roboto), 'Segoe UI', Tahoma, sans-serif" }}
      >
        <LanguageProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <ClientAuthProvider>
              <ErrorBoundary>
                <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
              </ErrorBoundary>
            </ClientAuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}