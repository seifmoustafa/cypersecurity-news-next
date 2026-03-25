"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    
    if (token) {
      // Save internal token to localStorage using Portal's specific keys
      localStorage.setItem("client_access_token", token);
      
      // Parse token to get client_id
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        const payload = JSON.parse(jsonPayload);
        if (payload.sub) {
          localStorage.setItem("client_id", payload.sub);
        }
      } catch (e) {
        console.error("Failed to parse token", e);
      }
      
      // Redirect to home/simple page
      router.replace("/simple");
    } else {
      // Token not found, back to login
      router.replace("/login");
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
        <p className="text-slate-500 dark:text-slate-400 font-medium">Authenticating with Keycloak...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900"><Loader2 className="h-8 w-8 animate-spin text-green-500" /></div>}>
      <AuthCallbackContent />
    </Suspense>
  );
}
