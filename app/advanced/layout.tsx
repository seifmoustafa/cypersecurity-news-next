import type React from "react";
import MainLayout from "@/components/layouts/main-layout";
// Metadata for Professionals Portal
export const metadata = {
      title: "بوابة الأمن السيبراني للمحترفين | Cybersecurity Portal for Professionals",
      description:
            "موارد متقدمة للمحترفين في مجال الأمن السيبراني - Advanced cybersecurity resources for professionals",
      icons: {
            icon: '/assets/app-icon',
            shortcut: '/assets/app-icon',
            apple: '/assets/app-icon',
      },
};

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default function AdvancedRootLayout({
      children,
}: Readonly<{
      children: React.ReactNode;
}>) {
      return (
            <MainLayout>
                  {children}
            </MainLayout>
      );
}
