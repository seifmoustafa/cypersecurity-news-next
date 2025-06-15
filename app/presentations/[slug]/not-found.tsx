import { Presentation } from "lucide-react"
import { Button } from "@/components/ui/button"
import MainLayout from "@/components/layouts/main-layout"
import Link from "next/link"

export default function PresentationNotFound() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Presentation className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-4xl font-bold mb-2">Presentation Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The presentation you're looking for doesn't exist or has been removed.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/presentations">Back to Presentations</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
