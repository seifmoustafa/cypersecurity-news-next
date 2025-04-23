import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function RegulationNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Regulation Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8">
        The regulation you are looking for does not exist or has been moved.
      </p>
      <Link href="/#regulation">
        <Button variant="default" size="lg">
          Return to Regulations
        </Button>
      </Link>
    </div>
  )
}
