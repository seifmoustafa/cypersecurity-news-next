import Link from "next/link"
import { Button } from "@/components/ui/button"
import MainLayout from "@/components/layouts/main-layout"

export default function RegulationNotFound() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-4xl font-bold mb-4">اللائحة غير موجودة</h1>
        <p className="text-muted-foreground mb-8">اللائحة التي تبحث عنها غير موجودة أو تم نقلها.</p>
        <Link href="/#regulation">
          <Button variant="default">العودة إلى اللوائح</Button>
        </Link>
      </div>
    </MainLayout>
  )
}
