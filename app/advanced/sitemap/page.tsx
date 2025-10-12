import type { Metadata } from "next";
import SitemapPageClient from "./SitemapPageClient";

export const metadata: Metadata = {
  title: "Site Map | Cybersecurity Portal",
  description: "Complete site map of the cybersecurity portal with all sections and categories",
};

export default function SitemapPage() {
  return <SitemapPageClient />;
}