import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container mx-auto py-16 flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
      <p className="text-xl text-gray-600 mb-8">The instruction you are looking for does not exist.</p>
      <Link href="/instructions">
        <Button>Back to Instructions</Button>
      </Link>
    </div>
  )
}
