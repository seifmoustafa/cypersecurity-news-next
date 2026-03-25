import type React from "react";
import SimpleLayout from "@/components/layouts/simple-layout";
// Add a cache control header to improve caching
export const metadata = {
  title: "بوابة الأمن السيبراني  | Cybersecurity Portal",
  description:
    "بوابة مبسطة للأمن السيبراني تقدم المعرفة الأساسية والأدوات البسيطة ",
};

// Add this function to improve page loading performance
export const dynamic = "force-dynamic";

export default function BeginnersRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SimpleLayout>
      {children}
    </SimpleLayout>
  );
}