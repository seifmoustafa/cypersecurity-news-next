"use client";

import { useRouter } from "next/navigation";
import { ReactNode, MouseEvent } from "react";

interface AuthLinkProps {
      href: string;
      children: ReactNode;
      className?: string;
      includeReturnUrl?: boolean;
}

/**
 * A link component that forces a full page reload when navigating to auth pages.
 * This ensures fonts load correctly when transitioning from layouts like /advanced or /simple.
 * Set includeReturnUrl to true when href is "/login" to redirect back after login.
 */
export function AuthLink({ href, children, className, includeReturnUrl }: AuthLinkProps) {
      const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            // Force full page reload by using window.location instead of router.push
            if (href === "/login" && includeReturnUrl) {
                  const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
                  window.location.href = `/login?returnUrl=${returnUrl}`;
            } else {
                  window.location.href = href;
            }
      };

      return (
            <a href={href} onClick={handleClick} className={className}>
                  {children}
            </a>
      );
}


/**
 * Hook to navigate to auth pages with a full page reload.
 * Use this for programmatic navigation to login, profile, or change-password.
 * When navigating to login, you can optionally pass includeReturnUrl to redirect back after login.
 */
export function useAuthNavigation() {
      const navigateToAuth = (path: "/login" | "/profile" | "/change-password", options?: { includeReturnUrl?: boolean }) => {
            // Force full page reload
            if (path === "/login" && options?.includeReturnUrl) {
                  const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
                  window.location.href = `/login?returnUrl=${returnUrl}`;
            } else {
                  window.location.href = path;
            }
      };

      return { navigateToAuth };
}
