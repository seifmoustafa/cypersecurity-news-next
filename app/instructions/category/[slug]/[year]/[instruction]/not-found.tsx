import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Home } from "lucide-react"

export default function InstructionNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <FileText className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">Instruction Not Found</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">The instruction you're looking for doesn't exist or has been moved.</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link href="/">
              <Button variant="outline" className="gap-2">
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </Link>
            <Link href="/instructions">
              <Button className="gap-2">
                <FileText className="h-4 w-4" />
                Browse Instructions
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
