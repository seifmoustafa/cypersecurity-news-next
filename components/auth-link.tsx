"use client";

import { useRouter } from "next/navigation";
import { ReactNode, MouseEvent } from "react";

interface AuthLinkProps {
      href: string;
      children: ReactNode;
      className?: string;
}

/**
 * A link component that forces a full page reload when navigating to auth pages.
 * This ensures fonts load correctly when transitioning from layouts like /advanced or /simple.
 */
export function AuthLink({ href, children, className }: AuthLinkProps) {
      const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            // Force full page reload by using window.location instead of router.push
            window.location.href = href;
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
 */
export function useAuthNavigation() {
      const navigateToAuth = (path: "/login" | "/profile" | "/change-password") => {
            // Force full page reload
            window.location.href = path;
      };

      return { navigateToAuth };
}
