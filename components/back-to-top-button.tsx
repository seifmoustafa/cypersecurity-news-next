"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BackToTopButtonProps {
      threshold?: number;
      className?: string;
}

export function BackToTopButton({ threshold = 400, className }: BackToTopButtonProps) {
      const [isVisible, setIsVisible] = useState(false);

      useEffect(() => {
            const toggleVisibility = () => {
                  if (window.scrollY > threshold) {
                        setIsVisible(true);
                  } else {
                        setIsVisible(false);
                  }
            };

            window.addEventListener("scroll", toggleVisibility, { passive: true });

            return () => window.removeEventListener("scroll", toggleVisibility);
      }, [threshold]);

      const scrollToTop = () => {
            window.scrollTo({
                  top: 0,
                  behavior: "smooth",
            });
      };

      return (
            <Button
                  variant="secondary"
                  size="icon"
                  onClick={scrollToTop}
                  className={cn(
                        "fixed bottom-6 z-50 rounded-full shadow-lg transition-all duration-300",
                        "hover:shadow-xl hover:scale-110 active:scale-95",
                        "bg-primary text-primary-foreground hover:bg-primary/90",
                        "rtl:left-6 ltr:right-6",
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none",
                        className
                  )}
                  aria-label="Back to top"
            >
                  <ChevronUp className="h-5 w-5" />
            </Button>
      );
}

export default BackToTopButton;
