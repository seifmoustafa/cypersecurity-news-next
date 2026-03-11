"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useKeycloak } from "@/contexts/keycloak-context";
import { useLanguage } from "@/components/language-provider";
import { Loader2 } from "lucide-react";

/**
 * Login Page - Redirects to Keycloak for authentication
 * 
 * The original login page has been backed up to page.backup.tsx
 * To restore the original login page, rename page.backup.tsx to page.tsx
 */
export default function LoginPage() {
      const { isAuthenticated, isLoading, login } = useKeycloak();
      const router = useRouter();
      const { t } = useLanguage();

      React.useEffect(() => {
            if (!isLoading) {
                  if (isAuthenticated) {
                        // Already logged in, redirect to home
                        router.replace("/simple");
                  } else {
                        // Not logged in, redirect to Keycloak
                        login();
                  }
            }
      }, [isLoading, isAuthenticated, login, router]);

      // Show loading while checking auth or redirecting
      return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
                  <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-green-500/30">
                        <div className="flex flex-col items-center gap-4">
                              <Loader2 className="h-12 w-12 animate-spin text-green-500" />
                              <p className="text-slate-300 text-center">
                                    {t("common.loading") || "جاري التحميل..."}
                              </p>
                              <p className="text-slate-500 text-sm text-center">
                                    {t("auth.redirectingToLogin") || "جاري التحويل لتسجيل الدخول..."}
                              </p>
                        </div>
                  </div>
            </div>
      );
}
