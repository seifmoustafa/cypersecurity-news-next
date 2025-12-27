"use client";

import { useEffect, useLayoutEffect } from "react";
import { useLanguage } from "@/components/language-provider";
import { getFontFamily } from "@/lib/fonts";

// Force font application on every mount/navigation
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function AuthLayout({
      children,
}: {
      children: React.ReactNode;
}) {
      const { language, isRtl } = useLanguage();
      const dir = isRtl ? "rtl" : "ltr";

      // Force font application when this layout mounts (i.e., when navigating to auth pages)
      useIsomorphicLayoutEffect(() => {
            if (typeof window === "undefined") return;

            // Force immediate font application
            const fontFamily = getFontFamily(isRtl);

            document.documentElement.dir = dir;
            document.documentElement.lang = language;
            document.body.classList.remove("rtl", "ltr");
            document.body.classList.add(isRtl ? "rtl" : "ltr");
            document.body.style.fontFamily = fontFamily;

            // Force a reflow to ensure fonts are applied immediately
            document.body.offsetHeight;
      }, [language, isRtl, dir]);

      return (
            <div
                  style={{
                        fontFamily: isRtl
                              ? "'Cairo', var(--font-cairo), 'Segoe UI', Tahoma, sans-serif"
                              : "'Roboto', var(--font-roboto), 'Segoe UI', Tahoma, sans-serif",
                  }}
                  dir={dir}
            >
                  {children}
            </div>
      );
}
