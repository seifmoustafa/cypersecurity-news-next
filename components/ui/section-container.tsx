import { cn } from "@/lib/utils";
import type React from "react";
interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function SectionContainer({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("py-8 md:py-12 lg:py-16", className)}>
      <div className="container mx-auto px-4 max-w-full 2xl:max-w-[1600px]">
        {children}
      </div>
    </section>
  );
}
