import type React from "react";
import { cairo, roboto } from "@/lib/fonts";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
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
            __html: `(() => {
              try {
                const storageKey = 'theme-preference';
                const stored = localStorage.getItem(storageKey);
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const isDark = stored ? stored === 'dark' : prefersDark;
                const root = document.documentElement.classList;
                if (isDark) root.add('dark'); else root.remove('dark');
              } catch (_) {}
            })();`,
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
              <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
            </ErrorBoundary>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}


