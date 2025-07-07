import MainLayout from "@/components/layouts/main-layout"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen } from "lucide-react"

export default function DefinitionNotFound() {
  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 text-center">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Definition Not Found</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            The definition you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link href="/#standards">
            <Button>Back to Standards</Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  )
}
