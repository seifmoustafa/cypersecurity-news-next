import { Suspense } from "react";
import LoadingScreen from "@/components/loading-screen";
import SearchPageClient from "./SearchPageClient";
import MainLayout from "@/components/layouts/main-layout";

export default function SearchPage() {
  return (
    <MainLayout>
      <Suspense fallback={<LoadingScreen />}>
        <SearchPageClient />
      </Suspense>
    </MainLayout>
  );
}
