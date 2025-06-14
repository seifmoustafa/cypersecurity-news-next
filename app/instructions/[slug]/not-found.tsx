import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Home, ArrowLeft } from "lucide-react"

export default function InstructionNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="container mx-auto px-4 max-w-md">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <FileText className="h-10 w-10 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl">Instruction Not Found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">The instruction you're looking for doesn't exist or has been moved.</p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link href="/instructions">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Instructions
                </Button>
              </Link>
              <Link href="/">
                <Button className="gap-2">
                  <Home className="h-4 w-4" />
                  Go Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
